// approve-paypal route
import prisma from "@/lib/db";
import { paypal } from "@/lib/paypal";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const updateOrderToPaid = async ({
  id,
  orderPaypal,
  value,
  orderId
}: {
  id: string;
  orderPaypal: any;
  value: number;
  orderId: string
}) => {
  const order = await prisma.checkoutSession.findFirst({
    where: {
      orderId,
    },
    select: { isPaid: true },
  });

  if (!order) throw new Error('Order not found');
  if (order.isPaid) throw new Error('Order is already paid');

  await prisma.user.update({
    where: {
      id: id,  // Update the user's coins based on the user ID
    },
    data: {
      coin: { increment: value },
    },
  });

  await prisma.checkoutSession.update({
    where: {
      orderId,  // Ensure you update the correct order
    },
    data: {
      isPaid: true,
      paidAt: new Date(),
      orderPaypal,
    },
  });

  return NextResponse.json({ message: "success" }, { status: 200 });
};


// approve-paypal route
export async function POST(req: Request) {
  try {
    const { data, id, value }: { data: { orderID: string }, id: string, value: number } = await req.json();

    // Find the order by the PayPal order ID
    const order = await prisma.checkoutSession.findFirst({
      where: {
        userId: id,
        orderId: data.orderID, // Ensure the orderPaypal field is included in the query
      },
    });

    if (!order) throw new Error('Order not found');

    const captureData = await paypal.capturePayment(data.orderID);

    if (!captureData) throw new Error('No capture data received from PayPal');
    if (captureData.id !== order.orderId) throw new Error(`Capture ID ${captureData.id} does not match stored orderPaypal ID ${order.orderPaypal}`);
    if (captureData.status !== 'COMPLETED') throw new Error('PayPal payment not completed');

    await updateOrderToPaid({
      id,
      value,
      orderId: data.orderID,
      orderPaypal: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid: captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${order.id}`);
    return NextResponse.json({
      success: true,
      message: 'Your order has been successfully paid by PayPal',
    });
  } catch (err: any) {
    console.error('Error in approve-paypal route:', err.message);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
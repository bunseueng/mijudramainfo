// create-order route
import prisma from "@/lib/db";
import { paypal } from "@/lib/paypal";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, email,price }: { id: string; email:string; price: number } = await req.json();

    const customer = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const paypalOrder = await paypal.createOrder(Number(price));

    await prisma.checkoutSession.create({
      data: {
        userId: id,
        orderId: paypalOrder.id,
        isPaid: false,
        order: {}
      },
    });

    await prisma.customers.create({
      data: {
        email: email,
        orderId: paypalOrder.id,
        paymentMethod: "Paypal"
      }
    })

    return NextResponse.json({
      success: true,
      message: 'PayPal order created successfully',
      data: paypalOrder.id,
    });
  } catch (err: any) {
    console.error('Error creating PayPal order:', err.message);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

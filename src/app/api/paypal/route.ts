import prisma from "@/lib/db";
import { paypal } from "@/lib/paypal";
import { NextRequest, NextResponse } from "next/server";
interface PayPalOrder {
    id: string;
    email_address: string;
    status: string;
    pricePaid: string;
}

export async function POST(req: NextRequest) {
    const { action, id, price, orderId, value } = await req.json();

    
    try {
        if (action === "createOrder") {
            const order = await prisma.customers.findFirst({
                where: { id },
            });
            if (order) {
                const paypalOrder = await paypal.createOrder(price);
                await prisma.checkoutSession.update({
                    where: { id },
                    data: {
                        orderPaypal: {
                            id: paypalOrder.id,
                            email_address: "",
                            status: "",
                            pricePaid: "0",
                        },
                    },
                });
                return NextResponse.json({
                    success: true,
                    message: "PayPal order created successfully",
                    data: paypalOrder.id,
                }, { status: 200 });
            } else {
                throw new Error("Order not found");
            }
        } else if (action === "approveOrder") {
            const order = await prisma.checkoutSession.findFirst({
                where: { id },
            });
            if (!order) throw new Error("Order not found");

            const captureData = await paypal.capturePayment(orderId)
            const orderPaypal = order.orderPaypal as unknown as PayPalOrder;

            if (
                !captureData ||
                captureData.id !== orderPaypal?.id || // Access id from the object
                captureData.status !== "COMPLETED"
            ) {
                throw new Error("Error in PayPal payment");
            }


            await prisma.checkoutSession.update({
                where: { id },
                data: {
                    isPaid: true,
                    paymentResult: {
                        id: captureData.id,
                        status: captureData.status,
                        email_address: captureData.payer.email_address,
                        pricePaid: captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
                    },
                },
            });

            await prisma.user.update({
                where: { id },
                data: {
                    coin: { increment: value },
                },
            });

            return NextResponse.json({
                success: true,
                message: "Your order has been successfully paid by PayPal",
            }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
        }
    } catch (err: any) {
        console.error('Error in PayPal processing:', err);
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

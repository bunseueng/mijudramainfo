import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-06-20"
});

const endPointSecret = process.env.WEBHOOK_SECRET;

const fulfillOrder = async (data: Stripe.LineItem[], customerEmail: string) => {
    try {
        const user = await prisma.customers.create({
            data: {
                email: customerEmail,
                orderId: null,
                paymentMethod: "Stripe"
            }
        });
        console.log(JSON.stringify(user));
        return !!user; // Returns true if user is created, false otherwise
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

const saveCoinToUser = async (lineItems: Stripe.LineItem[], metadata: any) => {
    const coinMap: { [key: string]: number } = {
        "500 Coins": 500,
        "1200 Coins": 1200,
        "2000 Coins": 2000,
        "3300 Coins": 3300,
        "7000 Coins": 7000,
        "18000 Coins": 18000,
        "38000 Coins": 38000
    };

    try {
        for (const lineItem of lineItems) {
            if (lineItem.price && lineItem.price.product) {
                const product = lineItem.price.product as Stripe.Product;
                const addingSpecificCoin = coinMap[product.name] || 0;

                if (addingSpecificCoin > 0) {
                    // Log before updating user
                    console.log(`Updating user with email: ${metadata.email}, adding coins: ${addingSpecificCoin}`);

                    // First, retrieve the user to check their current coin balance
                    const user = await prisma.user.findUnique({
                        where: { email: metadata.email },
                        select: { coin: true }
                    });

                    if (!user) {
                        console.error(`User with email ${metadata.email} not found`);
                        return NextResponse.json({ error: "User not found" }, { status: 404 });
                    }

                    // If the coin field is null, initialize it to 0
                    const currentCoinBalance = user.coin ?? 0;

                    // Update the user's coin balance
                    const updatedUser = await prisma.user.update({
                        where: { email: metadata.email },
                        data: { coin: currentCoinBalance + addingSpecificCoin }
                    });

                    // Log after updating user
                    console.log("Updated user:", updatedUser);

                    if (updatedUser) {
                        console.log("Success adding coin");
                    } else {
                        console.error("Failed to update user coin balance");
                        return NextResponse.json({ error: "Failed to update user coin balance" }, { status: 500 });
                    }
                } else {
                    console.warn(`Unrecognized product name: ${product.name}`);
                }
            } else {
                console.warn('Line item does not have a valid price or product:', lineItem);
            }
        }

        return NextResponse.json({ message: "Success adding coin" }, { status: 200 });
    } catch (error: any) {
        console.error("Failed adding coin to database:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

const saveCheckoutSession = async (eventDataObject: any) => {
    try {
        console.log("Saving checkout session:", eventDataObject); // Log eventDataObject
        const res = await prisma.checkoutSession.create({
            data: {
                order: eventDataObject // Pass JSON object directly
            }
        });
        console.log("Saved checkout session:", res); // Log the response
        return res;
    } catch (error) {
        console.error("Error saving checkout session:", error);
        return false;
    }
};

const handleCompletedCheckoutSession = async (event: Stripe.CheckoutSessionCompletedEvent) => {
    try {
        const session = event.data.object as Stripe.Checkout.Session
        const metadata = session.metadata
        const sessionWithlineItems = await stripe.checkout.sessions.retrieve(
            (event.data.object as any).id, {
                expand: ["line_items.data.price.product"],
            }
        );
        const lineItems = sessionWithlineItems.line_items;

        if (!lineItems) return false;

        await saveCoinToUser(lineItems.data as Stripe.LineItem[], metadata)
       
        const ordersFulfilled = await fulfillOrder(
            lineItems.data as Stripe.LineItem[], 
            (event.data.object as any).customer_details.email
        );
        await saveCheckoutSession(event.data.object);

        if (ordersFulfilled) return true;

        console.error("Error fulfilling orders for", JSON.stringify(lineItems), JSON.stringify(event.data.object));
        return false;
    } catch (error) {
        console.error("Error in handleCompletedCheckoutSession:", error);
        return false;
    }
};

const handleCustomerSubscriptionUpdated = async (event: Stripe.CustomerSubscriptionUpdatedEvent) => {
    try {
        const customerID = event.data.object.customer;
        const customer = await stripe.customers.retrieve(customerID as string);
        const subscriptionCancel = event.data.object?.cancel_at;
        const email = (customer as any).email;

        if (email) {
            const user = await prisma.customers.findUnique({
                where: {
                    email: email.toLowerCase()
                }
            });

            if (user) {
                const res = await prisma.customers.update({
                    where: {
                        email: email.toLowerCase()
                    },
                    data: {
                        subscriptionCancel: subscriptionCancel ? new Date(subscriptionCancel * 1000) : null
                    }
                });
                if (!res) return false;
            }
        }
        return true;
    } catch (error) {
        console.error("Error unsubscribing customer", error);
        return false;
    }
};

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event;
    let result = "Webhook Called.";
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig!, endPointSecret!);
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    switch (event.type) {
        case "checkout.session.completed":
            const savedSession = await handleCompletedCheckoutSession(event);
            if (!savedSession) {
                return NextResponse.json({
                    error: "Unable to save checkout session"
                }, { status: 500 });
            };
            break;
        case "customer.subscription.updated":
            const updated = await handleCustomerSubscriptionUpdated(event);
            if (!updated)
                return NextResponse.json({
                    error: "Unable to update subscription"
                }, { status: 500 });
            break;
        default:
            console.warn(`Unhandled event type ${event.type}`);
    }
    return NextResponse.json({ received: true, status: result });
}

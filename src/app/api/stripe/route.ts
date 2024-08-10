import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20"
});


export async function POST(req: NextRequest) {
  try {
  const { items, email } = await req.json();
  console.log("Received items:", items);
  console.log("Received email:", email);
  if (!email) {
    return NextResponse.json({ error: "User email is required" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items,
    metadata: { email }, // Pass user email in metadata
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
  });
  console.log("Success", {
    email,items
  })

  return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session")
    return NextResponse.json({error: "Failed to create checkout session"})
  }
}

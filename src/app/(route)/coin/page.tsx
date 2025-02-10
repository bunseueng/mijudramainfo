export const dynamic = "force-dynamic";
import React from "react";
import Coin from "./Coin";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coin",
  description: "Buying Coin to support your favorite Actor/Actress",
};

const CoinPage = async () => {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    // Handle the error appropriately, e.g., by returning an error page or a message
    return (
      <div className="mx-auto px-4">
        <p>User not found or not logged in.</p>
      </div>
    );
  }

  const paypalClientID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  return (
    <div className="h-screen overflow-hidden">
      <Coin paypalClientID={paypalClientID} />
    </div>
  );
};

export default CoinPage;

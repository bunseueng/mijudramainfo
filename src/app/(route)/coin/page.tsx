import React from "react";
import Coin from "./Coin";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coin",
  description: "Buying Coin to support your favorite Actor/Actress",
};

const CoinPage = async () => {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    console.error("User not found or user ID is undefined");
    // Handle the error appropriately, e.g., by returning an error page or a message
    return (
      <div className="mx-auto px-4">
        <p>User not found or not logged in.</p>
      </div>
    );
  }
  const getCoin = await prisma.user.findUnique({
    where: {
      id: user?.id,
      email: user?.email,
    },
  });

  const paypalClientID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  console.log(paypalClientID);

  return (
    <div className="mx-auto overflow-hidden">
      <Coin getCoin={getCoin} paypalClientID={paypalClientID} />
    </div>
  );
};

export default CoinPage;

import React from "react";
import Coin from "./Coin";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";

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

  return (
    <div className="mx-auto px-4">
      <Coin getCoin={getCoin} paypalClientID={process.env.PAYPAL_CLIENT_ID} />
    </div>
  );
};

export default CoinPage;

import React from "react";
import Coin from "./Coin";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "@/lib/db";
import { currentUserProps } from "@/helper/type";

const CoinPage = async () => {
  const user = await getCurrentUser();
  const getCoin = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
  });
  return (
    <div className="mx-auto px-4">
      <Coin getCoin={getCoin} paypalClientID={process.env.PAYPAL_CLIENT_ID} />
    </div>
  );
};

export default CoinPage;

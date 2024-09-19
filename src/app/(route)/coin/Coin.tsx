"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import CoinModal from "@/app/component/ui/Modal/CoinModal";

interface UserI {
  getCoin: any;
  paypalClientID: string | undefined;
}

const Coin: React.FC<UserI> = ({ getCoin, paypalClientID }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  useEffect(() => {
    // Lock body scroll when modal is open
    document.body.style.overflow = openModal ? "hidden" : "auto";

    // Clean up the effect
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModal]);
  return (
    <div className="h-screen px-6">
      <div className="relative -mx-4 pt-16 pb-10 overflow-hidden">
        {/* Blurred Background with Black Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-contain object-cover"
            style={{
              backgroundImage: "url('/coin-bg.jpg')",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
            }}
          ></div>
          <div
            className="absolute inset-0 bg-black opacity-75"
            style={{
              zIndex: 1,
            }}
          ></div>
        </div>

        <div className="relative max-w-[1134px] mx-auto z-10">
          <div className="mx-auto px-4">
            <div className="-mx-3">
              <div className="relative float-left w-[50%] px-3 mb-6">
                <h1 className="max-w-[280px] text-white text-[30px] font-bold m-0">
                  MijuDramaInfo
                </h1>
                <div className="inline-flex items-center">
                  <Image
                    src="/yuan.png"
                    alt="Coin Image"
                    width={100}
                    height={100}
                    loading="lazy"
                    className="w-12 h-12 bg-cover bg-center object-cover"
                  />
                  <h1 className="text-white text-2xl font-bold pl-3">Coins</h1>
                </div>
                <p className="text-white font-bold mt-7">
                  Coins are a virtual good that can be used to show your support
                  across our platform. We’ll be adding a variety of fun ways to
                  spend your virtual gold coins in the future.
                </p>
                <button
                  className="text-white bg-[#1675b6] border-[1px] border-[#1675b6] hover:bg-[#115889] hover:border-[#0f527f] rounded-md font-bold align-middle shadow-md transform duration-300 px-8 py-3 mt-5"
                  onClick={() => setOpenModal(!openModal)}
                >
                  Get Coins
                </button>
                {openModal && (
                  <CoinModal
                    setOpenModal={setOpenModal}
                    getCoin={getCoin}
                    paypalClientID={paypalClientID}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coin;

"use client";

import Image from "next/image";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { currentUserProps } from "@/helper/type";
import dynamic from "next/dynamic";
const PaymentModal = dynamic(() => import("./PaymentModal"), { ssr: false });

interface CoinType {
  setOpenModal: (open: boolean) => void;
  getCoin: currentUserProps | null;
  paypalClientID: string | undefined;
}

const CoinModal: React.FC<CoinType> = ({
  setOpenModal,
  getCoin,
  paypalClientID,
}) => {
  const [value, setValue] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [openPayment, setOpenPayment] = useState<boolean>(false);
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-75 overflow-auto z-[2005]">
      <div className="w-auto mx-1 md:mx-auto md:w-[410px] max-w-full relative shadow-md my-[50px] overflow-hidden mt-[15vh]">
        <div className="w-auto mx-1 md:mx-auto md:w-[410px] flex flex-col items-center bg-gradient-to-br from-blue-100 via-orange-100 to-purple-100 p-3 md:p-8 rounded-lg shadow-lg relative border-8 border-orange-200 mt-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="w-20 h-20 absolute -top-11 -left-11 fill-red-400"
          >
            <path
              fillRule="evenodd"
              d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z"
              clipRule="evenodd"
            ></path>
          </svg>
          <p className="mono text-sm absolute -top-4 bg-red-400 text-zinc-100 py-0.5 px-2 font-bold tracking-wider rounded">
            POPULAR
          </p>
          <div className="text-sm absolute right-4 top-4 cursor-pointer dark:text-black">
            <IoClose size={22} onClick={() => setOpenModal(false)} />
          </div>
          <div>
            <div className="flex gap-4 justify-center">
              <Image
                src="/yuan.png"
                alt="Coin Image"
                width={100}
                height={100}
                className="w-12 h-12 bg-center object-cover"
              />
            </div>
            <p className="text-center text-3xl font-bold pt-1 dark:text-black">
              {getCoin?.coin}
            </p>
            <p className="opacity-60 text-center"></p>
            <div className="flex gap-4 justify-center">
              <div className="flex flex-col items-center my-1">
                <p className="font-extrabold text-md dark:text-black">
                  Total Coins
                </p>
                <p className="text-sm opacity-60 dark:text-black dark:opacity-100">
                  What are coins?
                </p>
              </div>
            </div>
          </div>
          <div className="w-full mt-5">
            <p className="text-start text-xl font-bold dark:text-black">
              Get Coin
            </p>
            <div className="my-2 border-[1px] border-[#00000024] rounded-sm">
              <div className="py-4 px-2">
                <div className="flex items-start justify-between">
                  <h1 className="text-lg dark:text-black">500 Coins</h1>
                  <button
                    className="bg-[#1b92e4] text-white font-bold border-[1px] border-[#1675b6] rounded-md shadow-md px-4 py-2"
                    onClick={() => {
                      setValue(500),
                        setPrice(1.99),
                        setOpenPayment(!openPayment);
                    }}
                  >
                    $1.99
                  </button>
                </div>
              </div>
            </div>
            <div className="my-2 border-[1px] border-[#00000024] rounded-sm">
              <div className="py-4 px-2">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <h1 className="text-lg dark:text-black">1,200 Coins</h1>
                    <div className="text-red-500 text-start">10% Bonus</div>
                  </div>
                  <button
                    className="bg-[#1b92e4] text-white font-bold border-[1px] border-[#1675b6] rounded-md shadow-md px-4 py-2"
                    onClick={() => {
                      setValue(1200),
                        setPrice(3.99),
                        setOpenPayment(!openPayment);
                    }}
                  >
                    $3.99
                  </button>
                </div>
              </div>
            </div>
            <div className="my-2 border-[1px] border-[#00000024] rounded-sm">
              <div className="py-4 px-2">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <h1 className="text-lg dark:text-black">2,000 Coins</h1>
                    <div className="text-red-500 text-start">20% Bonus</div>
                  </div>
                  <button
                    className="bg-[#1b92e4] text-white font-bold border-[1px] border-[#1675b6] rounded-md shadow-md px-4 py-2"
                    onClick={() => {
                      setValue(2000),
                        setPrice(5.99),
                        setOpenPayment(!openPayment);
                    }}
                  >
                    $5.99
                  </button>
                </div>
              </div>
            </div>
            <div className="my-2 border-[1px] border-[#00000024] rounded-sm">
              <div className="py-4 px-2">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <h1 className="text-lg dark:text-black">3,300 Coins</h1>
                    <div className="text-red-500 text-start">24% Bonus</div>
                  </div>
                  <button
                    className="bg-[#1b92e4] text-white font-bold border-[1px] border-[#1675b6] rounded-md shadow-md px-4 py-2"
                    onClick={() => {
                      setValue(3300),
                        setPrice(9.99),
                        setOpenPayment(!openPayment);
                    }}
                  >
                    $9.99
                  </button>
                </div>
              </div>
            </div>
            <div className="my-2 border-[1px] border-[#00000024] rounded-sm">
              <div className="py-4 px-2">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <h1 className="text-lg dark:text-black">7,000 Coins</h1>
                    <div className="text-red-500 text-start">32% Bonus</div>
                  </div>
                  <button
                    className="bg-[#1b92e4] text-white font-bold border-[1px] border-[#1675b6] rounded-md shadow-md px-4 py-2"
                    onClick={() => {
                      setValue(7000),
                        setPrice(19.99),
                        setOpenPayment(!openPayment);
                    }}
                  >
                    $19.99
                  </button>
                </div>
              </div>
            </div>
            <div className="my-2 border-[1px] border-[#00000024] rounded-sm">
              <div className="py-4 px-2">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <h1 className="text-lg dark:text-black">18,000 Coins</h1>
                    <div className="text-red-500 text-start">42% Bonus</div>
                  </div>
                  <button
                    className="bg-[#1b92e4] text-white font-bold border-[1px] border-[#1675b6] rounded-md shadow-md px-4 py-2"
                    onClick={() => {
                      setValue(18000),
                        setPrice(49.99),
                        setOpenPayment(!openPayment);
                    }}
                  >
                    $49.99
                  </button>
                </div>
              </div>
            </div>
            <div className="my-2 border-[1px] border-[#00000024] rounded-sm">
              <div className="py-4 px-2">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <h1 className="text-lg dark:text-black">38,000 Coins</h1>
                    <div className="text-red-500 text-start">50% Bonus</div>
                  </div>
                  <button
                    className="bg-[#1b92e4] text-white font-bold border-[1px] border-[#1675b6] rounded-md shadow-md px-4 py-2"
                    onClick={() => {
                      setValue(38000),
                        setPrice(99.99),
                        setOpenPayment(!openPayment);
                    }}
                  >
                    $99.99
                  </button>
                </div>
              </div>
              {openPayment && (
                <PaymentModal
                  value={value}
                  price={price}
                  setOpenPayment={setOpenPayment}
                  paypalClientID={paypalClientID}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinModal;

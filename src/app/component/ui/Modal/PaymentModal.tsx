"use client";

import { constants } from "@/lib/constants";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import Script from "next/script";

interface PaymentType {
  value: number | null;
  price: number | null;
  setOpenPayment: (value: boolean) => void;
  paypalClientID: string | undefined;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHED_KEY as string
);

const PaymentModal: React.FC<PaymentType> = ({
  value,
  price,
  setOpenPayment,
  paypalClientID,
}) => {
  const [linkToStripe, setLinkToStripe] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Paypal");
  const { data: session } = useSession();

  const route = useRouter();

  const checkout = async () => {
    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              price_data: {
                currency: "usd",
                unit_amount: Math.floor(price! * 100),
                product_data: {
                  name: value + " Coins",
                },
              },
              quantity: 1,
            },
          ],
          email: session?.user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });
        if (error) {
          console.error("Error redirecting to checkout:", error);
        }
      } else {
        console.error("Stripe.js failed to load.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = "";
    if (isPending) {
      status = "Loading PayPal...";
    } else if (isRejected) {
      status = "Error in loading PayPal.";
    }
    return <div>{status}</div>;
  }

  const handleCreatePayPalOrder = async () => {
    try {
      const id = session?.user.id as string;
      const email = session?.user.email as string;

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          email,
          price: price as number,
        }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        console.error("Failed to create PayPal order:", message);
        toast.error("Failed to create PayPal order");
        return "";
      }

      const { data: orderID } = await res.json();
      return orderID;
    } catch (error) {
      console.error("Error in creating PayPal order:", error);
      toast.error("Error in creating PayPal order");
      return "";
    }
  };

  const handleApprovePayPalOrder = async (orderID: string) => {
    try {
      const id = session?.user.id as string;
      const res = await fetch("/api/approve-paypal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: { orderID }, // Ensure data is passed correctly
          id,
          value: value as number,
        }),
      });

      if (res.ok) {
        toast.success("Payment approved successfully");
        route.push("/success");
      } else {
        const { message } = await res.json();
        toast.error(`Failed: ${message}`);
      }
    } catch (error) {
      console.error("Error in approving PayPal order:", error);
      toast.error("Error in approving PayPal order");
    }
  };

  useEffect(() => {
    if (value === 500) {
      setLinkToStripe(`${constants?.paymentLinks?.preOrder500Coin}`);
    } else if (value === 1200) {
      setLinkToStripe(`${constants?.paymentLinks?.preOrder1200Coin}`);
    } else if (value === 2000) {
      setLinkToStripe(`${constants?.paymentLinks?.preOrder2000Coin}`);
    } else if (value === 3300) {
      setLinkToStripe(`${constants?.paymentLinks?.preOrder3300Coin}`);
    } else if (value === 7000) {
      setLinkToStripe(`${constants?.paymentLinks?.preOrder7000Coin}`);
    } else if (value === 18000) {
      setLinkToStripe(`${constants?.paymentLinks?.preOrder18000Coin}`);
    } else if (value === 38000) {
      setLinkToStripe(`${constants?.paymentLinks?.preOrder38000Coin}`);
    }
  }, [value]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (paymentMethod === "Credit") {
          checkout();
        } else if (paymentMethod === "Paypal") {
          // Prevent form submission when using PayPal
        }
      }}
      className="relative z-10"
    >
      <div className="fixed inset-0 z-10 w-screen bg-black bg-opacity-10 overflow-auto py-32">
        <div className="flex h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative w-[450px] transform rounded-lg bg-white text-left transition-all my-2">
            <div className="w-full bg-white dark:bg-[#242526] px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded-md">
              <div className="flex items-center justify-between">
                <h1 className="text-md font-bold">Buy {value} Coins!</h1>
                <div className="text-end">
                  <button onClick={() => setOpenPayment(false)}>
                    <IoClose />
                  </button>
                </div>
              </div>

              <div className="text-center mb-6">
                <div
                  className={`w-[40%] inline-block text-center h-20 border-[1px] rounded-md align-top py-3 m-3 cursor-pointer ${
                    paymentMethod === "Paypal" &&
                    "bg-[#ecf5ff] border-[#06090c21] dark:text-black"
                  }`}
                  onClick={() => setPaymentMethod("Paypal")}
                >
                  <div className="inline-block pb-1">
                    <Image
                      src="/paypal.svg"
                      alt="PayPal Image"
                      width={100}
                      height={100}
                      className="w-8 h-8 bg-center object-cover"
                    />
                  </div>
                  <div className="text-center">PayPal</div>
                </div>
                {process.env.NODE_ENV === "development" && (
                  <div
                    className={`w-[40%] inline-block text-center h-20 border-[1px] rounded-md align-top py-3 m-3 cursor-pointer ${
                      paymentMethod === "Credit" &&
                      "bg-[#ecf5ff] border-[#06090c21] dark:text-black"
                    }`}
                    onClick={() => setPaymentMethod("Credit")}
                  >
                    <div className="inline-block pb-1">
                      <Image
                        src="/credit.png"
                        alt="Credit Card Image"
                        width={100}
                        height={100}
                        className="w-8 h-8 bg-center object-cover"
                      />
                    </div>
                    <div className="text-center">Credit Card</div>
                  </div>
                )}
              </div>
              <div className="text-center text-[#00000099] dark:text-white font-semibold m-6">
                Total: <span>${price}</span>
              </div>
              <div className="w-full mb-5">
                <Script
                  src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`}
                  strategy="afterInteractive"
                />
                {paymentMethod === "Paypal" && paypalClientID && (
                  <PayPalScriptProvider options={{ clientId: paypalClientID }}>
                    <PrintLoadingState />
                    <div
                      id="paypal-button-container"
                      style={{
                        backgroundColor: "white",
                        padding: "5px",
                        borderRadius: "5px",
                      }}
                    >
                      <PayPalButtons
                        style={{
                          layout: "vertical", // options: "horizontal" or "vertical"
                          color: "blue", // options: "gold", "blue", "silver", "white", or "black"
                          shape: "rect", // options: "rect" or "pill"
                          label: "paypal", // options: "paypal", "checkout", "buynow", or "pay"
                          height: 40, // Adjust the height of the button
                        }}
                        createOrder={async (data, actions) => {
                          // Create the PayPal order and return the order ID
                          const orderID = await handleCreatePayPalOrder();
                          return orderID; // Return the order ID for PayPal to complete
                        }}
                        onApprove={async (data, actions) => {
                          // Handle the payment approval
                          try {
                            const { orderID } = data; // Extract the order ID from the response
                            if (!orderID)
                              throw new Error("Order ID is undefined");
                            await handleApprovePayPalOrder(orderID); // Call the function to finalize the payment
                          } catch (error) {
                            console.error(
                              "Error in approving PayPal order:",
                              error
                            );
                            toast.error("Error in approving PayPal order");
                          }
                        }}
                      />
                    </div>
                  </PayPalScriptProvider>
                )}

                {paymentMethod === "Credit" && (
                  <button type="submit" className="mb-5">
                    <span className="bg-[#1b92e4] text-white font-bold border-[1px] border-[#1675b6] rounded-md shadow-md px-4 py-2">
                      Buy {value} Coins!
                    </span>
                  </button>
                )}
              </div>

              <p className="text-sm text-[#818a91] opacity-60">
                Purchased Coins don&apos;t expire, are non-transferrable and
                non-refundable. By purchasing Coins, you agree to our Terms of
                Use and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PaymentModal;

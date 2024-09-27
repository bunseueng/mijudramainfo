"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { FaBitcoin } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { currentUserProps, PersonType } from "@/helper/type";
import { personPopularity } from "@/helper/item-list";
import Link from "next/link";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter } from "next/navigation";

interface PopularityType {
  persons: PersonType;
  setOpenModal: (open: boolean) => void;
  currentUser: currentUserProps | any;
  tv_id: number;
}

const customStar = [10, 20, 100, "Custom"];
const coinPerStar = 5;

const PopularityModal: React.FC<PopularityType> = ({
  currentUser,
  persons,
  setOpenModal,
  tv_id,
}) => {
  const [selectedItems, setSelectedItems] = useState<Map<number, string>>(
    new Map([[0, customStar[0].toString()]]) // Set default selection to first item and first index
  );
  const [customValues, setCustomValues] = useState<Map<number, number>>(
    new Map()
  );
  const [stars, setStars] = useState<Map<number, number>>(
    new Map(personPopularity.map((_, index) => [index, 1]))
  );
  const [loading, setLoading] = useState<boolean>(false);
  const route = useRouter();

  useEffect(() => {
    // Ensure the default selection is set if `personPopularity` changes
    if (personPopularity.length > 0) {
      setSelectedItems((prev) => {
        const newSelectedItems = new Map(prev);
        if (!newSelectedItems.size) {
          newSelectedItems.set(0, customStar[0].toString());
        }
        return newSelectedItems;
      });
    }
  }, []);

  const handleSelect = (itemIndex: number, starValue: string) => {
    setSelectedItems((prev) => {
      const newSelectedItems = new Map(prev);
      if (newSelectedItems.get(itemIndex) === starValue) {
        // Toggle off if already selected
        newSelectedItems.delete(itemIndex);
      } else {
        newSelectedItems.set(itemIndex, starValue);
      }
      return newSelectedItems;
    });
    if (starValue !== "Custom") {
      setCustomValues((prev) => {
        const newCustomValues = new Map(prev);
        newCustomValues.delete(itemIndex);
        return newCustomValues;
      });
    }
  };

  const handleCustomChange = (itemIndex: number, value: number) => {
    setStars((prev) => new Map(prev).set(itemIndex, value));
  };

  const handleStarIncrement = (itemIndex: number) => {
    setStars((prev) => {
      const newStars = new Map(prev);
      newStars.set(itemIndex, (newStars.get(itemIndex) || 1) + 1);
      return newStars;
    });
  };
  const handleStarDecrement = (itemIndex: number) => {
    setStars((prev) => {
      const newStars = new Map(prev);
      const currentStars = newStars.get(itemIndex) || 1;
      if (currentStars > 1) {
        newStars.set(itemIndex, currentStars - 1);
      }
      return newStars;
    });
  };

  const calculateTotalCoins = useMemo(() => {
    let totalCoins = 0;
    selectedItems.forEach((selectedValue, index) => {
      const starCount = stars.get(index) || 1;
      if (selectedValue === "Custom") {
        totalCoins += (customValues.get(index) || starCount) * coinPerStar;
      } else {
        totalCoins += Number(selectedValue) * coinPerStar;
      }
    });
    return totalCoins;
  }, [selectedItems, stars, customValues]);

  const selectedDisplay = useMemo(() => {
    return Array.from(selectedItems.entries())
      .map(([index, value]) => {
        const item = personPopularity[index];
        const starCount = value === "Custom" ? stars.get(index) : Number(value);
        return item ? `${starCount} ${item.name}` : `Item ${value} ${index}`;
      })
      .join(", ");
  }, [selectedItems, stars]);

  const onSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/person/${tv_id}/send-popularity`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          popularity: Array.from(selectedItems.entries()).map(
            ([index, value]) => {
              const item = personPopularity[index];
              const starCount =
                value === "Custom" ? stars.get(index) : Number(value);
              return {
                itemId: item?.name, // Assuming item has an 'id' property
                personId: tv_id,
                starCount: starCount,
                actorName: persons?.name,
              };
            }
          ),
          calculateTotalCoins,
        }),
      });

      if (res.status === 200) {
        toast.success("Popularity sent successfully");
        setOpenModal(false);
        route.refresh();
      } else if (res.status === 400) {
        toast.error("Invalid User");
      } else if (res.status === 404) {
        toast.error("You don't have enough coin");
      } else if (res.status === 500) {
        toast.error("Server Error");
      }
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  console.log();

  return (
    <form className="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-75 overflow-auto z-[2005]">
      <div className="w-[550px] max-w-full relative shadow-md mx-auto my-[50px] overflow-hidden mt-[15vh]">
        <div className="relative w-[550px] transform rounded-lg bg-white text-left transition-all my-2">
          <div className="w-full bg-white dark:bg-[#242526] px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded-md">
            <div className="text-end">
              <button onClick={() => setOpenModal(false)}>
                <IoClose />
              </button>
            </div>
            <div className="flex items-center justify-center py-5">
              <Image
                src={`https://image.tmdb.org/t/p/original/${
                  persons?.profile_path || persons?.poster_path
                }`}
                alt={`${persons?.name}'s Avatar`}
                width={600}
                height={600}
                quality={100}
                className="w-20 h-20 rounded-full bg-center bg-cover object-cover"
              />
            </div>
            <h1 className="text-[#000000de] dark:text-white text-center text-lg font-semibold mb-2">
              Send Virtual Popularity to Support
            </h1>
            <h2 className="text-center text-xl text-black dark:text-white font-bold">
              Person Name
            </h2>
            {personPopularity.map((item, outerIdx) => (
              <div key={outerIdx}>
                <ul className="grid grid-cols-4">
                  {customStar.map((num, innerIdx) => (
                    <li
                      key={innerIdx}
                      className={`bg-[#f7fbff] dark:bg-[#191a1b] hover:border-[#dcdfe6] rounded-md py-3 my-2 mx-1 cursor-pointer ${
                        selectedItems.get(outerIdx) === num.toString()
                          ? "text-[#1675b6] border-[1px] border-[#409eff]"
                          : "border-[1px] border-[#ecf5ff] dark:border-[#000000df]"
                      }`}
                      onClick={() => handleSelect(outerIdx, num.toString())}
                    >
                      <div className="flex items-center justify-center">
                        <Image
                          src={`/${item?.image}`}
                          alt={item?.name}
                          width={100}
                          height={100}
                          className="w-10 h-10 bg-center bg-cover object-cover"
                        />
                      </div>
                      <div className="font-semibold text-center text-md">
                        {num === "Custom" ? (
                          <span>{num}</span>
                        ) : (
                          <span>
                            {num} {item?.name}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                {selectedItems.get(outerIdx) === "Custom" && (
                  <div className="block mb-6 mt-2 mx-auto">
                    <div className="relative block text-center mb-6 mt-2 mx-auto">
                      <div className="relative inline-block w-[180px] text-center">
                        <input
                          type="number"
                          placeholder="1"
                          className="w-full bg-white text-center text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] dark:border-0 border-[#c0c4cc] rounded-md outline-none py-2 px-4"
                          value={stars.get(outerIdx) || 1}
                          onChange={(e) =>
                            handleCustomChange(outerIdx, Number(e.target.value))
                          }
                          defaultValue={1}
                        />
                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            className="block text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-b-[1px] border-b-[#c0c4cc] dark:border-b-[#46494a] border-l-[1px] border-l-[#c0c4cc] dark:border-l-[#46494a] border-t-[1px] dark:border-t-0 border-t-[#c0c4cc] dark:border-t-[#46494a] border-r-[1px] dark:border-r-0 border-r-[#c0c4cc] dark:border-r-[#46494a] px-3 pb-1 rounded-tr-md hover:text-[#2490da] transform duration-300 group"
                            onClick={() => handleStarIncrement(outerIdx)}
                          >
                            <IoMdArrowDropup />
                          </button>
                          <button
                            type="button"
                            className="block text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-l-[1px] border-l-[#c0c4cc] dark:border-l-[#46494a] px-3 rounded-r-md pt-[2px] hover:text-[#2490da] transform duration-300 group"
                            onClick={() => handleStarDecrement(outerIdx)}
                          >
                            <IoMdArrowDropdown />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center justify-center">
              <h4>
                Cost:
                <span className="inline-block align-middle px-2">
                  <Image
                    src="/yuan.png"
                    alt="coin image"
                    width={100}
                    height={100}
                    className="w-5 h-5 bg-cover object-cover"
                  />
                </span>
                <span className="align-middle">{calculateTotalCoins}</span>
              </h4>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-[#00000099] dark:text-white text-center text-sm py-3">
                You need to obtain more coins in order to send 10 flowers.
              </p>
              <button
                type="submit"
                onClick={(e) => onSubmit(e)}
                className={`bg-[#1b92e4] text-white font-bold border-[1px] border-[#1675b6] rounded-md shadow-md px-4 py-2 mb-5 
                ${
                  currentUser?.coin === null ||
                  calculateTotalCoins > currentUser?.coin
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-100 cursor-pointer"
                }`}
                disabled={
                  currentUser?.coin === null ||
                  calculateTotalCoins > currentUser?.coin
                }
              >
                <span className="mr-1 pt-3 text-center align-middle">
                  <ClipLoader color="#fff" loading={loading} size={19} />
                </span>
                Send {selectedDisplay}!
              </button>
            </div>
            <div className="flex items-center justify-between">
              <Link
                href="/coin"
                className="text-[#1675b6] text-sm hover:opacity-70 transform duration-300"
              >
                What are Coins?
              </Link>
              <p className="text-[#000000de] dark:text-white text-sm font-semibold">
                Sent:
              </p>
              <div className="flex items-center text-[#000000de] dark:text-white text-sm font-semibold">
                Balance:
                <span className="text-[#000000de] dark:text-white text-sm font-semibold pl-1">
                  {currentUser?.coin || 0}
                </span>
                <Image
                  src="/yuan.png"
                  alt="Coin Image"
                  width={100}
                  height={100}
                  className="w-5 h-5 ml-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PopularityModal;

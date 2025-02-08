import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { personPopularity } from "@/helper/item-list";
import type { UserProps, PersonDBType, currentUserProps } from "@/helper/type";
import LazyImage from "@/components/ui/lazyimage";
import dynamic from "next/dynamic";
import PopularityRanking from "./PopularityRanking";

const PopularityModal = dynamic(() => import("../Modal/PopularityModal"), {
  ssr: false,
});

export interface Popularity {
  itemId: string;
  personId: string;
  starCount: number;
  actorName: string;
}

interface PopularitySectionProps {
  currentUser: currentUserProps | null;
  persons: any;
  getPersons: PersonDBType | null;
  tv_id: number;
  sortedUsers: UserProps[] | null;
  currentPopularityItem: Popularity;
  filteredPopularity: Popularity[];
  currentUsers: UserProps;
  currentIndex: number;
}

export default function PopularitySection({
  currentUser,
  persons,
  getPersons,
  tv_id,
  sortedUsers,
  currentPopularityItem,
  filteredPopularity,
  currentUsers,
  currentIndex,
}: PopularitySectionProps) {
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    document.body.style.overflow = openModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModal]);

  return (
    <div className="w-full bg-white dark:bg-[#242526] border-[1px] border-[#00000024] dark:border-[#232425] rounded-md mt-5 overflow-hidden">
      <div className="flex items-center justify-center py-5">
        <LazyImage
          coverFromDB={getPersons?.cover}
          src={`https://image.tmdb.org/t/p/h632/${persons?.profile_path}`}
          alt={`${persons?.name}'s Avatar` || "Person Profile"}
          width={600}
          height={600}
          quality={100}
          className="w-20 h-20 rounded-full bg-center bg-cover object-cover"
          priority
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {personPopularity?.map((item, idx) => (
          <div key={idx} className="flex items-center">
            <Image
              src={`/${item?.image}`}
              alt={`${item?.name}`}
              width={100}
              height={100}
              quality={90}
              className="w-12 h-12 bg-cover bg-center object-cover mx-2"
              priority
            />
            <div>
              <div className="font-bold text-md text-black dark:text-white">
                {String(
                  getPersons?.popularity?.find(
                    (pop: any) => pop?.itemId === item?.name
                  )?.starCount || 0
                )}
              </div>
              <div className="font-bold text-sm text-[#00000099] dark:text-[#ffffff99] uppercase">
                {item?.name}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[#00000099] dark:text-[#ffffff99] text-center text-sm my-2">
        Support your favorite stars by sending virtual flowers to boost their
        popularity.
      </p>
      <div
        className={`relative mx-2 ${
          filteredPopularity?.length > 0 ? "pb-8" : "pb-0"
        }`}
      >
        <button
          name="Popularity Button"
          className="block w-full text-white font-bold bg-[#1675b6] border-[1px] border-[#1675b6] hover:bg-[#115889] hover:border-[#0f527f] rounded-md py-2 my-2 mx-auto max-w-xs transform duration-300"
          onClick={() => setOpenModal(!openModal)}
        >
          Send Popularity
        </button>
        {openModal && (
          <PopularityModal
            currentUser={currentUser}
            persons={persons}
            setOpenModal={setOpenModal}
            tv_id={tv_id}
          />
        )}
        {currentPopularityItem?.actorName !== persons?.name && (
          <div className="h-auto overflow-hidden">
            <AnimatePresence>
              {currentUsers &&
                filteredPopularity &&
                filteredPopularity[currentIndex] && (
                  <motion.div
                    key={filteredPopularity[currentIndex].personId}
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "100%" }}
                    transition={{
                      type: "tween",
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                    className="absolute bottom-0 left-0 w-full flex items-center justify-center"
                  >
                    <div className="flex items-center">
                      <Image
                        src={
                          currentUsers?.profileAvatar ||
                          currentUsers?.image ||
                          "/placeholder-image.avif" ||
                          "/placeholder.svg"
                        }
                        alt={`${currentUsers?.name || "User"}'s Profile`}
                        width={100}
                        height={100}
                        quality={90}
                        className="w-6 h-6 bg-center object-cover rounded-full"
                        priority
                      />
                      <div className="flex items-center ml-2">
                        <p className="text-xs text-[#2490da] font-semibold px-1">
                          {currentUsers?.displayName ||
                            currentUsers?.name ||
                            "User"}
                        </p>
                        <div>
                          <p className="text-xs">
                            Sent{" "}
                            <span>
                              {filteredPopularity[currentIndex]?.starCount !==
                              undefined
                                ? String(
                                    filteredPopularity[currentIndex].starCount
                                  )
                                : "0"}
                            </span>{" "}
                            <span>
                              {filteredPopularity[currentIndex]?.itemId || ""}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        )}
      </div>
      {filteredPopularity?.length > 0 && (
        <PopularityRanking sortedUsers={sortedUsers} getPersons={getPersons} />
      )}
    </div>
  );
}

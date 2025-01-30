import { DramaPagination } from "@/app/component/ui/Pagination/DramaPagination";
import Image from "next/image";
import React, { Suspense } from "react";
import Link from "next/link";
import DramaFilter from "@/app/(route)/(drama)/drama/top/DramaFilter";
import SearchLoading from "../Loading/SearchLoading";
import AdBanner from "../Adsense/AdBanner";
import { currentUserProps, PersonDBType } from "@/helper/type";
import { TPersonLove } from "@/helper/zod";
import { toast } from "react-toastify";
import { GoHeart } from "react-icons/go";
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface ITopActor {
  title: string;
  total_results: number;
  currentUser: currentUserProps;
  router: AppRouterInstance;
  items: string;
  register: UseFormRegister<{
    userId?: string | undefined;
    love?: number | undefined;
    loveBy?: string[] | undefined;
  }>;
  handleSubmit: UseFormHandleSubmit<
    {
      userId?: string | undefined;
      love?: number | undefined;
      loveBy?: string[] | undefined;
    },
    undefined
  >;
  person: PersonDBType[];
  person_like: PersonDBType[];
  setPage: (value: number) => void;
}

const TopActorCard: React.FC<ITopActor> = ({
  title,
  total_results,
  currentUser,
  router,
  items,
  register,
  handleSubmit,
  person,
  person_like,
  setPage,
}) => {
  const getBirth = (placeOfBirth: string) => {
    if (!placeOfBirth) return ""; // Handle cases where placeOfBirth is undefined or null
    const parts = placeOfBirth.split(","); // Split the string by comma
    return parts[parts.length - 1].trim(); // Get the last part and trim whitespace
  };

  const handleLove = async (data: TPersonLove, actorId: number) => {
    try {
      const res = await fetch(`/api/person/${actorId}/love`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          love: data?.love,
          loveBy: data?.loveBy,
          ...data, // Include other data here
        }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        toast.error("Failed to love");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to love");
    }
  };

  return (
    <div className="max-w-[1134px] mx-auto py-4">
      <div className="py-5">
        <AdBanner dataAdFormat="auto" dataAdSlot="8077904488" />
      </div>
      <div className="mt-10">
        <div className="flex flex-col md:flex-row mt-10 w-full">
          <div className="w-full md:w-[70%] px-1 md:px-3">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-2xl font-bold">{title}</h1>
              <p>{total_results} results</p>
            </div>
            {person?.map((person: any) => {
              const personRecord =
                person_like &&
                person_like?.find(
                  (db: PersonDBType) => db?.personId === String(person?.id)
                );
              const isCurrentUserLoved = personRecord?.lovedBy.find(
                (item: any) => item?.includes(currentUser?.id)
              );
              return (
                <div
                  className="flex border-2 bg-white dark:bg-[#242424] dark:border-[#272727] rounded-lg p-4 mb-10"
                  key={person?.id}
                >
                  <div className="float-left w-[25%] md:w-[20%] px-1 md:px-3 align-top table-cell">
                    <div className="relative">
                      <Link
                        prefetch={false}
                        href={`/person/${person?.id}-${spaceToHyphen(
                          person?.name
                        )}`}
                      >
                        {person?.profile_path ? (
                          <Image
                            src={
                              `https://image.tmdb.org/t/p/original/${person?.profile_path}` ||
                              "Person Profile"
                            }
                            alt={person?.profile_path}
                            width={200}
                            height={200}
                            style={{ width: "100%", height: "100%" }}
                            priority
                            className="w-full object-cover align-middle overflow-clip"
                          />
                        ) : (
                          <Image
                            src="/empty-img.jpg"
                            alt={person?.profile_path || "Person Profile"}
                            width={200}
                            height={200}
                            style={{ width: "100%", height: "100%" }}
                            priority
                            className="w-full h-full align-middle overflow-clip"
                          />
                        )}
                      </Link>
                    </div>
                  </div>
                  <div className="pl-2 md:pl-3 w-[80%]">
                    <div className="flex items-center justify-between">
                      <Link
                        prefetch={false}
                        href={`/person/${person?.id}-${spaceToHyphen(
                          person?.name
                        )}`}
                        className="text-md text-sky-700 dark:text-[#2196f3] font-bold"
                      >
                        {person?.name || person?.title}
                      </Link>
                      <button
                        onClick={handleSubmit((data) =>
                          handleLove(data, person.id)
                        )}
                      >
                        {isCurrentUserLoved ? (
                          <span className="flex items-center text-red-600">
                            <GoHeart {...register("love")} />
                            <span className="pl-1">
                              {personRecord?.love || 0}
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <GoHeart {...register("love")} />
                            <span className="pl-1">
                              {personRecord?.love || 0}
                            </span>
                          </span>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-[#818a91] font-semibold line-clamp-3 truncate whitespace-normal">
                      {getBirth(person?.place_of_birth)}
                    </p>
                    <p className="text-sm font-semibold line-clamp-3 truncate whitespace-normal my-2">
                      {person?.biography === ""
                        ? `${person?.name} does not have biography yet!`
                        : person?.biography}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-full md:w-[30%] px-1 md:pl-3 md:pr-1 lg:px-3">
            <div className="py-5 hidden md:block">
              <AdBanner dataAdFormat="auto" dataAdSlot="3527489220" />
            </div>
            <div className="border bg-white dark:bg-[#242424] rounded-lg">
              <h1 className="text-lg font-bold p-4 border-b-2 border-b-slate-400 dark:border-[#272727]">
                Advanced Search
              </h1>
              <Suspense fallback={<SearchLoading />}>
                <DramaFilter />
              </Suspense>
            </div>
            <div className="hidden md:block relative bg-black mx-auto my-5">
              <div className="min-w-auto min-h-screen">
                <AdBanner dataAdFormat="auto" dataAdSlot="4321696148" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-5">
        <Suspense fallback={<div>Loading...</div>}>
          <DramaPagination setPage={setPage} totalItems={items} />
        </Suspense>
      </div>
    </div>
  );
};

export default TopActorCard;

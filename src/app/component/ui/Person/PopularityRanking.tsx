import Image from "next/image";
import Link from "next/link";
import type { UserProps, PersonDBType } from "@/helper/type";

type UserTotalPopularity = {
  itemId: string;
  personId: string;
  totalPopularity: number;
  actorName: string;
};

interface PopularityRankingProps {
  sortedUsers: UserProps[] | null;
  getPersons: PersonDBType | null;
}

export default function PopularityRanking({
  sortedUsers,
  getPersons,
}: PopularityRankingProps) {
  return (
    <>
      <div className="border-y-[1px] border-y-[#06090c21] dark:border-y-[#3e4042] mt-4">
        <div className="mx-2 py-5">
          <h1 className="text-center md:text-lg">Top Popularity Senders</h1>
          {sortedUsers?.map((user, idx: number) => (
            <div className="flex items-center mt-3" key={idx}>
              <Image
                src={`/${
                  idx === 0
                    ? `gold-medal.svg`
                    : idx === 1
                    ? `silver-medal.svg`
                    : "bronze-medal.svg"
                }`}
                alt="medal"
                width={100}
                height={100}
                className="w-10 h-10 bg-cover object-cover"
                priority
              />
              <div className="flex items-center my-2">
                <Image
                  src={user?.profileAvatar || user?.image || "/empty-pf.jpg"}
                  alt={`${user?.name}'s Avatar` || "User Profile"}
                  width={100}
                  height={100}
                  quality={90}
                  className="w-10 h-10 bg-cover object-cover rounded-full"
                  priority
                />
                <div className="inline-block ml-2">
                  <p className="inline-block text-md text-[#2490da] font-semibold px-1">
                    {user?.displayName || user?.name}
                  </p>
                  <p className="text-xs text-[#00000099] dark:text-[#ffffff99] font-semibold px-1">
                    {String(
                      user?.totalPopularitySent
                        ?.filter(
                          (p: any) => p?.personId === getPersons?.personId
                        )
                        ?.map(
                          (sent: UserTotalPopularity) =>
                            sent?.totalPopularity || 0
                        )[0] || 0
                    )}{" "}
                    <span>popularity</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full text-center p-3">
        <Link prefetch={false} href="" className="text-[#2196f3]">
          See all
        </Link>
      </div>
    </>
  );
}

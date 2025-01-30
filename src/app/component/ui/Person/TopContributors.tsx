import Image from "next/image";
import type { UserProps, PersonDBType } from "@/helper/type";

interface TopContributorsProps {
  sortedChanges: any[];
  users: UserProps[];
  getPersons: PersonDBType | null;
}

export default function TopContributors({
  sortedChanges,
  users,
  getPersons,
}: TopContributorsProps) {
  if (!sortedChanges?.length) return null;

  return (
    <div className="my-5">
      <h1 className="font-bold text-lg">Top Contributors</h1>
      {sortedChanges?.slice(0, 4)?.map((drama: any, idx) => {
        const getUser = users?.find((users: UserProps) =>
          users?.id?.includes(drama?.userId)
        );
        const userContributions =
          getPersons?.changes?.reduce((acc: Record<string, number>, change) => {
            acc[change.userId] = (acc[change.userId] || 0) + 1;
            return acc;
          }, {} as Record<string, number>) || {};
        const userContributeCount = userContributions[drama.userId] || 0;

        return (
          <div className="flex items-center py-2" key={idx}>
            <div className="block">
              <Image
                src={getUser?.profileAvatar || (getUser?.image as string)}
                alt={
                  getUser?.displayName ||
                  (getUser?.name as string) ||
                  "User Profile"
                }
                width={100}
                height={100}
                loading="lazy"
                className="size-[40px] object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col pl-2">
              <p className="text-[#2196f3]">
                {getUser?.displayName || getUser?.name}
              </p>
              <p className="text-sm">{String(userContributeCount)} edits</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

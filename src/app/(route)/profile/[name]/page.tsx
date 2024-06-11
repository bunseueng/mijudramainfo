import React from "react";
import CoverPhoto from "./CoverPhoto";
import prisma from "@/lib/db";
import Image from "next/image";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { IoMdMail, IoMdNotifications } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";
import ProfileItem from "./ProfileItem";
import moment from "moment";

const ProfilePage = async ({ params }: { params: { name: string } }) => {
  const user = await prisma?.user?.findUnique({ where: { name: params.name } });
  const users = await prisma?.user?.findMany({});
  const currentUser = await getCurrentUser();
  const date = new Date(user?.createdAt as Date);
  const formattedDate = date?.toISOString()?.split("T")[0];
  const biography = user?.biography?.replace(
    /<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi,
    ""
  );

  const lists = await prisma.dramaList.findMany({
    where: {
      userId: user?.id,
    },
  });

  const formattedLists = lists.map((list) => ({
    ...list,
    tvId: list.tvId.flat(),
    movieId: list.movieId.flat(),
  }));

  const tvid = formattedLists?.map((item: any) => item?.tvId);
  const movieId = formattedLists?.map((item: any) => item?.movieId);

  const watchlist = await prisma?.watchlist?.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "asc" },
  });

  const tv_id = watchlist?.map((id: any) => id?.movieId).flat(); // Flatten the array of arrays
  const existedFavorite = watchlist
    ?.map((id: any) => id?.favoriteIds?.map((item: any) => item?.id))
    ?.flat(); // Flatten the array of arrays

  const lastLogin = user?.lastLogin
    ? moment(user?.lastLogin).fromNow()
    : "Unknown"; // or any other fallback value you'd like to show

  const findFriendId = await prisma.friend?.findUnique({
    where: {
      friendRequestId_friendRespondId: {
        friendRequestId: currentUser?.id as string,
        friendRespondId: user?.id as string,
      },
    },
  });

  const friends = await prisma?.friend?.findMany({
    where: {
      OR: [
        { friendRequestId: currentUser?.id },
        { friendRespondId: currentUser?.id },
      ],
    },
  });

  const yourFriend = users?.filter((user: any) =>
    friends?.map((friend: any) => friend?.friendRespondId).includes(user?.id)
  );

  return (
    <main className="overflow-hidden">
      <div className="relative">
        <CoverPhoto user={user} currentUser={currentUser} />
        <div className="max-w-[1520px] w-full mx-auto py-3 px-3 md:px-6">
          <div className="w-full flex items-center justify-between flex-1">
            <div className="relative">
              <div className="w-[150px] h-[150px] absolute -top-24">
                <Image
                  src={
                    user?.profileAvatar !== null
                      ? user?.profileAvatar
                      : (user?.image as any)
                  }
                  alt="profile image"
                  width={150}
                  height={150}
                  quality={100}
                  className="w-full h-full bg-center bg-cover object-cover rounded-full"
                />
              </div>
            </div>
            <div className="flex items-center  relative left-0 mt-10">
              <IoMdMail size={25} className="mr-2" />
              <IoMdNotifications size={25} className="mr-2" />
              <button className="bg-transparent text-white border-2 border-[rgb(83, 100, 113)] rounded-full px-8 py-2">
                Follow
              </button>
            </div>
          </div>
          <div className="mt-10 mb-5">
            <h1 className="text-2xl font-bold">
              {user?.displayName || user?.name}
            </h1>
            <h1 className="text-sm text-[#71767b] font-bold">@{user?.name}</h1>
            <p className="text-white mt-3 break-words">{biography}</p>
            <h4 className="flex items-center mt-3 text-[#71767b]">
              <FaCalendarAlt />{" "}
              <span className="pl-2">Joined {formattedDate}</span>
            </h4>
            <div className="flex items-center text-[#71767b] mt-2">
              <p>
                <span className="text-white">0</span> Following
              </p>
              <p className="pl-4">
                <span className="text-white">0</span> Follower
              </p>
            </div>
          </div>
        </div>
        <ProfileItem
          user={user}
          currentUser={currentUser}
          tv_id={tv_id}
          existedFavorite={existedFavorite}
          list={formattedLists}
          movieId={movieId}
          tvid={tvid}
          formattedDate={formattedDate}
          lastLogin={lastLogin}
          findFriendId={findFriendId}
          friend={friends}
          yourFriend={yourFriend}
          findSpecificUser={[]}
        />
      </div>
    </main>
  );
};

export default ProfilePage;

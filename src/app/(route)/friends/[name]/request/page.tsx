import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
const FriendRequest = dynamic(() => import("./FriendRequest"));

export const metadata: Metadata = {
  title: "Friend Request",
  description: "All of your friends request in this website.",
};

const FriendRequestPage = async (props: {
  params: Promise<{ name: string }>;
}) => {
  const params = await props.params;
  return (
    <Suspense key={params.name} fallback={<SearchLoading />}>
      <div>
        <FriendRequest name={params.name} />
      </div>
    </Suspense>
  );
};

export default FriendRequestPage;

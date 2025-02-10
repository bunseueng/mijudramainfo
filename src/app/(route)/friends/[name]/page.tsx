export const dynamic = "force-dynamic";
import React, { lazy, Suspense } from "react";
import { Metadata } from "next";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
const Friend = lazy(() => import("./Friend"));

export const metadata: Metadata = {
  title: "Friends",
  description: "All your friends lists",
};

const FriendPage = async (props: { params: Promise<{ name: string }> }) => {
  const params = await props.params;
  return (
    <Suspense key={params.name} fallback={<SearchLoading />}>
      <div>
        <Friend name={params.name} />
      </div>
    </Suspense>
  );
};

export default FriendPage;

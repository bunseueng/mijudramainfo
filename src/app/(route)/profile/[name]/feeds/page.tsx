import React, { Suspense } from "react";
import ProfilePage from "../page";
import prisma from "@/lib/db";
import { Metadata } from "next";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

export const maxDuration = 60;
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const user = await prisma?.user?.findUnique({ where: { name: params.name } });
  return {
    title: `${user?.displayName || user?.name}'s Feeds` || "User's Feeds",
    description:
      user?.biography === null
        ? `${user?.displayName || user?.name}'s page`
        : user?.biography,
  };
}

const FeedsPage = async (props: { params: Promise<{ name: string }> }) => {
  const params = await props.params;
  return (
    <Suspense key={params.name} fallback={<SearchLoading />}>
      <div className="mb-10">
        <ProfilePage params={params as any} />
      </div>
    </Suspense>
  );
};

export default FeedsPage;

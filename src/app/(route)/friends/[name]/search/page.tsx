import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
const UserSearch = dynamic(() => import("./UserSearch"));

export const metadata: Metadata = {
  title: "Searching User",
  description: "Searching for all users in this website.",
};

const SearchPag = async (props: { params: Promise<{ name: string }> }) => {
  const params = await props.params;
  return (
    <Suspense key={params.name} fallback={<SearchLoading />}>
      <div>
        <UserSearch name={params.name} />
      </div>
    </Suspense>
  );
};

export default SearchPag;

export const dynamic = "force-dynamic";
import React, { lazy, Suspense } from "react";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
const Notifications = lazy(() => import("./Notifications"));

const NotificaitonsPage = async () => {
  const currentUser = await getCurrentUser();
  return (
    <Suspense fallback={<SearchLoading />}>
      <div>
        <Notifications currentUser={currentUser} />
      </div>
    </Suspense>
  );
};

export default NotificaitonsPage;

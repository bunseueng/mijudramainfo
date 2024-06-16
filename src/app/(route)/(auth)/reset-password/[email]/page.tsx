import React, { Suspense } from "react";
import ResetPassword from "./ResetPassword";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";

const ResetPasswordPage = ({ params }: { params: { email: string } }) => {
  return (
    <Suspense fallback={<SearchLoading />}>
      <ResetPassword params={params} />
    </Suspense>
  );
};

export default ResetPasswordPage;

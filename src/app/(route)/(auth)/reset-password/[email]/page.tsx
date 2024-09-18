import dynamic from "next/dynamic";
import React from "react";
const ResetPassword = dynamic(() => import("./ResetPassword"), { ssr: false });

const ResetPasswordPage = ({ params }: { params: { email: string } }) => {
  return <ResetPassword params={params} />;
};

export default ResetPasswordPage;

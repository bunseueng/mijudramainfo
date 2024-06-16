import React from "react";
import ResetPassword from "./ResetPassword";

const ResetPasswordPage = ({ params }: { params: { email: string } }) => {
  return <ResetPassword params={params} />;
};

export default ResetPasswordPage;

import React from "react";
import ResetPassword from "./ResetPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password  to continue to explore our website.",
};

const ResetPasswordPage = async (props: { params: Promise<{ email: string }> }) => {
  const params = await props.params;
  return <ResetPassword params={params} />;
};

export default ResetPasswordPage;

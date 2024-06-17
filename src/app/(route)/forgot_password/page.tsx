import dynamic from "next/dynamic";
import React from "react";
const ForgotPasswordForm = dynamic(() => import("./ForgotPasswordForm"), {
  ssr: false,
});

const ForgotPasswordPage = () => {
  return (
    <div>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;

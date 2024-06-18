import { Metadata } from "next";
import dynamic from "next/dynamic";
const ForgotPasswordForm = dynamic(() => import("./ForgotPassword"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Sending email to reset to password",
};

const ForgotPasswordPage = () => {
  return <ForgotPasswordForm />;
};

export default ForgotPasswordPage;

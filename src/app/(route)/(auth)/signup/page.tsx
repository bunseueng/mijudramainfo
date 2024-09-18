import React from "react";
import dynamic from "next/dynamic";
const Signup = dynamic(() => import("./Signup"), { ssr: false });

const SignupPage = () => {
  return <Signup />;
};

export default SignupPage;

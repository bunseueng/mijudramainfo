import dynamic from "next/dynamic";
import React from "react";
const Signin = dynamic(() => import("./Signin"), { ssr: false });

const SigninPage = () => {
  return <Signin />;
};

export default SigninPage;

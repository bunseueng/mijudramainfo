import React from "react";
import Signin from "./Signin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign-in",
  description:
    "Sign in for MijuDramaInfo and gain access to a world of Asian dramas and movies. It&#39;s quick, easy, and completely free!",
};

const SigninPage = () => {
  return <Signin />;
};

export default SigninPage;

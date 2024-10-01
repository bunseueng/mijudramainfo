import React from "react";
import Signup from "./Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign-up",
  description:
    "Sign up for MijuDramaInfo and gain access to a world of Asian dramas and movies. It&#39;s quick, easy, and completely free!",
};

const SignupPage = () => {
  return <Signup />;
};

export default SignupPage;

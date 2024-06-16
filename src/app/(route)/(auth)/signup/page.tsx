import React, { Suspense } from "react";
import Signup from "./Signup";

const SignupPage = () => {
  return (
    <Suspense>
      <Signup />
    </Suspense>
  );
};

export default SignupPage;

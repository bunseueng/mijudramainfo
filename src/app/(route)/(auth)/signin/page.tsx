import dynamic from "next/dynamic";
import React, { Suspense } from "react";
const Signin = dynamic(() => import("./Signin"), {
  ssr: false,
});

const SigninPage = () => {
  return (
    <Suspense fallback="Loading...">
      <Signin />;
    </Suspense>
  );
};

export default SigninPage;

"use client";
import { signInForm, TSignInForm } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
// @ts-ignore
import { AnimatedBackground } from "animated-backgrounds";
import { Input } from "./AuthInput";
const Signin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignInForm>({
    resolver: zodResolver(signInForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (userData: TSignInForm) => {
      setIsLoading(true);
      try {
        const signInData = await signIn("credentials", {
          email: userData.email,
          password: userData.password,
          redirect: false,
          rememberMe,
        });

        if (!signInData || signInData.ok !== true) {
          setIsLoading(false);
          toast.error("Failed to sign in");
          console.log("Invalid credentials");
        } else {
          toast.success("Sign-in successful");
          router.push("/");
        }
      } catch (error: any) {
        toast.error("Failed to sign in");
        console.error("Sign-in error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [router, rememberMe]
  );

  const handleSignIn = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: string,
    callback: { callbackUrl: string | undefined }
  ) => {
    e.preventDefault();
    signIn(`${type}`, callback);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <AnimatedBackground
        animationName="starryNight"
        style={{ position: "absolute", zIndex: "0" }}
      />
      {/* Left Section */}
      <div className="max-w-md w-full space-y-8 p-10 bg-white bg-opacity-10 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg z-50 mt-20 mb-36 mx-4: md:mx-0">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Welcome to MijuDramaInfo
          </h2>
          <p className="mt-2 text-sm text-gray-200">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
              onClick={(e) =>
                handleSignIn(e, "google", { callbackUrl: undefined })
              }
            >
              <FaGoogle className="text-white" size={20} />
            </button>
            <button
              type="button"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
              onClick={(e) => handleSignIn(e, "github", { callbackUrl: "/" })}
            >
              <FaGithub className="text-white" size={20} />
            </button>
          </div>

          <div className="flex items-center justify-center">
            <span className="h-px w-full bg-gray-300"></span>
            <p className="text-center text-sm text-gray-200 px-3">
              Or continue with
            </p>
            <span className="h-px w-full bg-gray-300"></span>
          </div>

          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Email
              </label>
              <Input
                {...register("email", { required: "Email is required" })}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="text-xs italic text-red-500 mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Password
              </label>
              <Input
                {...register("password", { required: "Password is required" })}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-xs italic text-red-500 mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-200 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-indigo-300 hover:text-indigo-200"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? <ClipLoader color="#ffffff" size={20} /> : "Sign in"}
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-200">
          Not a member?{" "}
          <Link
            href="/signup"
            className="font-medium text-indigo-300 hover:text-indigo-200"
          >
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;

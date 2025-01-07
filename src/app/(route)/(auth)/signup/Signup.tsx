"use client";
import { signUpForm, TSignUpForm } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCheck, FaGithub, FaGoogle } from "react-icons/fa6";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
// @ts-ignore
import { AnimatedBackground } from "animated-backgrounds";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Input } from "../signin/AuthInput";

const Signup = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignUpForm>({
    resolver: zodResolver(signUpForm),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TSignUpForm) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          password: data.password,
        }),
      });

      if (response.ok) {
        router.push("/signin");
        console.log("sucessfully submitted");
      } else {
        console.log("failed");
      }

      if (response.status === 401) {
        toast.error("User already exists");
      }
      if (response.status === 200) {
        toast.success("Sign-up successfully");
      }
      if (response.status === 500) {
        toast.error("Failed to sign-up");
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AnimatedBackground
        animationName="starryNight"
        style={{ position: "absolute", zIndex: "0" }}
      />
      <div className="max-w-md w-full space-y-8 p-10 bg-white bg-opacity-10 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg mt-20 mb-36 mx-4 md:mx-0">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Welcome to MijuDramaInfo
          </h2>
          <p className="mt-2 text-sm text-gray-200">Create your account with</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
              onClick={() => signIn("google")}
            >
              <FaGoogle className="text-white" size={20} />
            </button>
            <button
              type="button"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
              onClick={() => signIn("github", { callbackUrl: "/" })}
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
                htmlFor="name"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Username
              </label>
              <Input
                {...register("name", { required: "Username is required" })}
                id="name"
                name="name"
                type="text"
                autoComplete="username"
                placeholder="Username"
              />
              {errors.name && (
                <p className="text-xs italic text-red-400 mt-2">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Email address
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
                <p className="text-xs italic text-red-400 mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200 mb-1 mt-4"
              >
                Password
              </label>
              <Input
                {...register("password", { required: "Password is required" })}
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-xs italic text-red-400 mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <Input
              {...register("terms", {
                required: "You must agree to the terms",
              })}
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="ml-2 block text-sm text-gray-200 cursor-pointer"
            >
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          {errors.terms && (
            <p className="text-xs italic text-red-400 mt-2">
              {errors.terms.message}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? <ClipLoader color="#ffffff" size={20} /> : "Sign up"}
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-200">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-medium text-indigo-300 hover:text-indigo-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

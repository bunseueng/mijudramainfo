"use client";
import { signUpForm, TSignUpForm } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCheck } from "react-icons/fa6";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

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
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Section */}
      <div className="w-full md:w-2/5 xl:w-1/4 bg-white dark:bg-[#242526] flex flex-col justify-start items-center md:items-start pt-16 md:py-16 lg:px-2">
        <div className="order-0 md:order-1 mb-12 md:mb-0 w-full px-4">
          <Link
            className="no-underline hover:no-underline font-bold text-2xl lg:text-4xl flex items-center mb-5"
            href="/"
          >
            <p className="text-lg md:text-2xl text-cyan-400">MijuDramaInfo</p>
            <Image
              src="/Untitled.svg"
              alt="Website logo"
              width={200}
              height={200}
              quality={100}
              className="w-[25px] h-[50px] md:w-[50px]"
            />
          </Link>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-row items-center justify-start">
              <p className="mb-0 me-4 text-lg">Sign in with</p>

              <button
                type="button"
                className=" mx-1 inline-block h-9 w-9 rounded-full bg-primary fill-white p-2 uppercase leading-normal shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:bg-[#1f6fa7] dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
              >
                <span className="[&>svg]:mx-auto [&>svg]:h-3.5 [&>svg]:w-3.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                  </svg>
                </span>
              </button>

              <button
                type="button"
                className=" mx-1 inline-block h-9 w-9 rounded-full bg-primary fill-white p-2 uppercase leading-normal shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:bg-[#1f6fa7] dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
              >
                <span className="[&>svg]:mx-auto [&>svg]:h-3.5 [&>svg]:w-3.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                  </svg>
                </span>
              </button>

              <button
                type="button"
                className=" mx-1 inline-block h-9 w-9 rounded-full bg-primary fill-white p-2 uppercase leading-normal shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:bg-[#1f6fa7] dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
              >
                <span className="[&>svg]:mx-auto [&>svg]:h-3.5 [&>svg]:w-3.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                  </svg>
                </span>
              </button>
            </div>

            <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:before:border-neutral-500 dark:after:border-neutral-500">
              <p className="mx-4 mb-0 text-center font-semibold dark:text-white">
                Or
              </p>
            </div>

            <div className="relative mb-6" data-twe-input-wrapper-init>
              <h1 className="text-lg font-bold pb-5">Sign up</h1>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  {...register("name")}
                  id="username"
                  name="name"
                  type="username"
                  autoComplete="username"
                  className="block w-full rounded-md border-0 py-1.5 bg-white dark:bg-[#3a3b3c] text-gray-900 dark:text-white shadow-sm placeholder:text-gray-400 focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none pl-2"
                />
                {errors.name && (
                  <p className="text-xs italic text-red-500 mt-2">
                    {errors.name?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="relative mb-6" data-twe-input-wrapper-init>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Email
                </label>
              </div>
              <div className="mt-2">
                <input
                  {...register("email")}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 bg-white dark:bg-[#3a3b3c] text-gray-900 dark:text-white shadow-sm placeholder:text-gray-400 focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none pl-2"
                />
                {errors.email && (
                  <p className="text-xs italic text-red-500 mt-2">
                    {errors.email?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="relative mb-6" data-twe-input-wrapper-init>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  {...register("password")}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  className="block w-full rounded-md border-0 py-1.5 bg-white dark:bg-[#3a3b3c] text-gray-900 dark:text-white shadow-sm placeholder:text-gray-400 focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none pl-2"
                />
                {errors.password && (
                  <p className="text-xs italic text-red-500 mt-2">
                    {errors.password?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div className="mb-[0.125rem] block min-h-[1.5rem] ps-[1.5rem]">
                <input
                  {...register("terms")}
                  className="relative float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ms-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-checkbox checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ms-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent rtl:float-right dark:border-neutral-400 dark:checked:border-primary dark:checked:bg-black"
                  type="checkbox"
                  value=""
                  id="terms"
                />
                <label
                  className="text-sm inline-block ps-[0.15rem] hover:cursor-pointer"
                  htmlFor="terms"
                >
                  I agree to the Terms of Service and Privacy Policy
                </label>
                {errors.terms && (
                  <p className="text-xs italic text-red-500 mt-2">
                    {errors.terms?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="text-center lg:text-left">
              <button
                type="submit"
                className="flex items-center justify-center w-full rounded bg-primary px-7 pb-2 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:bg-[#1f6fa7] dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
              >
                <ClipLoader color="#242526" loading={isLoading} size={20} />
                <span className="pl-1">
                  {isLoading ? "SIGN UP..." : "SIGN UP"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full flex md:w-3/5 xl:w-3/4 relative text-white bg-[#242526] flex-col justify-center md:justify-start items-center md:items-start md:py-16 md:px-6 ">
        {/* Background Image and Overlay only in Right Section */}
        <div className="md:absolute md:inset-0 md:w-full md:bg-[url(/鞠婧祎.jpg)] md:bg-cover md:bg-center md:z-0"></div>
        <div className="md:absolute md:inset-0 md:bg-black md:opacity-50 md:z-0"></div>

        {/* Content of the Right Section */}
        <div className="relative z-10 mb-12 md:mb-0 px-4">
          <h1 className="text-xl font-bold pb-4">Don&#39;t have an account?</h1>
          <h3 className="text-md font-bold pb-4">
            Sign up for MijuDramaInfo and gain access to a world of Asian dramas
            and movies. It&#39;s quick, easy, and completely free!
          </h3>
          <p className="pb-2">
            By creating an account, you can enjoy the following features:
          </p>
          <ul className="flex flex-col pb-4">
            <li className="inline-flex items-center pb-2 pl-4">
              <FaCheck />
              <span>Create your own personalized drama list</span>
            </li>
            <li className="inline-flex items-center pb-2 pl-4">
              <FaCheck />
              <span>Join in discussions with other fans</span>
            </li>
            <li className="inline-flex items-center pb-2 pl-4">
              <FaCheck />
              <span>
                Contribute to, and improve the information in our database
              </span>
            </li>
            <li className="inline-flex items-center pb-2 pl-4">
              <FaCheck />
              <span>Rate and review dramas and movies</span>
            </li>
            <li className="inline-flex items-center pb-2 pl-4">
              <FaCheck />
              <span>Keep track of your favorite actors and actresses</span>
            </li>
            <li className="inline-flex items-center pb-2 pl-4">
              <FaCheck />
              <span>Discover new and exciting content</span>
            </li>
            <li className="inline-flex items-center pb-2 pl-4">
              <FaCheck />
              <span>Less advertisements</span>
            </li>
            <li className="inline-flex items-center pb-2 pl-4">
              <FaCheck />
              <span>Build custom mixed lists (movies and TV)</span>
            </li>
            <li className="inline-flex items-center pb-2 pl-4">
              <FaCheck />
              <span>Build and maintain a personal watchlist</span>
            </li>
          </ul>
          <p>
            Don&#39;t miss out - sign up now and start enjoying all the benefits
            of MijuDramaInfo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

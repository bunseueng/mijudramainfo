"use client";
import { signInForm, TSignInForm } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCheck, FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa6";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

const Signin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    [router]
  );

  return (
    <section className="max-w-6xl mx-auto my-20">
      <div className="h-full">
        <div className="flex h-full flex-wrap items-center justify-center lg:justify-between">
          <div className="shrink-1 mb-12 grow-0 order-1 md:order-0 basis-auto md:mb-0 md:w-6/12 xl:w-6/12 px-4">
            <h1 className="text-xl font-bold pb-4">
              Don&apos;t have an account?
            </h1>
            <h3 className="text-md font-bold pb-4">
              Sign up for MijuDramaInfo and gain access to a world of Asian
              dramas and movies. It&apos;s quick, easy, and completely free!
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
              Don&apos;t miss out - sign up now and start enjoying all the
              benefits of MyDramaList.
            </p>
          </div>

          <div className="order-0 md:order-1 mb-12 md:mb-0 w-full md:w-5/12 xl:w-5/12 px-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-row items-center justify-center lg:justify-start">
                <p className="mb-0 me-4 text-lg">Sign in with</p>

                <button
                  type="button"
                  className="mx-1 inline-block h-9 w-9 rounded-full bg-primary fill-white p-2 uppercase leading-normal shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:bg-[#1f6fa7] dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                  onClick={() => signIn("google")}
                >
                  <FaGoogle className="pl-[1.5px]" size={17} />
                </button>

                <button
                  type="button"
                  className=" mx-1 inline-block h-9 w-9 rounded-full bg-primary fill-white p-2 uppercase leading-normal shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:bg-[#1f6fa7] dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                  onClick={() => signIn("github")}
                >
                  <FaGithub className="pl-[1.2px]" size={19} />
                </button>

                <button
                  type="button"
                  className=" mx-1 inline-block h-9 w-9 rounded-full bg-primary fill-white p-2 uppercase leading-normal shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:bg-[#1f6fa7] dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                >
                  <FaFacebookF className="pl-1" />
                </button>
              </div>

              <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:before:border-neutral-500 dark:after:border-neutral-500">
                <p className="mx-4 mb-0 text-center font-semibold dark:text-white">
                  Or
                </p>
              </div>

              <div className="relative mb-6" data-twe-input-wrapper-init>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Email address
                </label>
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
                    autoComplete="current-password"
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
                    className="relative float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ms-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-checkbox checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ms-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent rtl:float-right dark:border-neutral-400 dark:checked:border-primary dark:checked:bg-primary"
                    type="checkbox"
                    value=""
                    id="remember"
                  />
                  <label
                    className="inline-block ps-[0.15rem] hover:cursor-pointer"
                    htmlFor="remember"
                  >
                    Remember me
                  </label>
                </div>

                <Link href="/forgot-password">Forgot password?</Link>
              </div>

              <div className="text-center lg:text-left">
                <button
                  type="submit"
                  className="flex items-center justify-center w-full rounded bg-primary px-7 pb-2 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:bg-[#1f6fa7] dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                >
                  <ClipLoader color="#242526" size={20} loading={isLoading} />
                  <span className="pl-1">
                    {isLoading ? "Login..." : "Login"}
                  </span>
                </button>

                <div className="mb-0 mt-2 pt-1 text-sm font-semibold">
                  Not a member yet?
                  <Link
                    href={`/signup`}
                    className="text-[#2490da] transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700 pl-3"
                  >
                    Register now!
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;

import { footer, footerRecommend } from "@/helper/item-list";
import ThemeSwitch from "@/components/ui/ThemeIcon";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-gradient-to-r from-sky-900 to-blue-800">
      <div className="max-w-[1520px] mx-auto py-4 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-white">
            <Link
              className="no-underline hover:no-underline font-bold text-2xl lg:text-4xl flex items-center"
              href="/"
            >
              <p className="text-lg md:text-2xl text-cyan-400">MijuDramaList</p>
              <Image
                src="/untitled.svg"
                alt="Website logo"
                width={200}
                height={200}
                quality={100}
                className="w-[25px] h-[50px] md:w-[50px]"
              />
            </Link>
            <p className="my-2">© Copyright 2024. All rights reserved.</p>
            <div className="flex items-center my-4">
              <ul className="ul">
                <li className="li">
                  <Link
                    href="https://www.facebook.com/YuTuQJJ/"
                    className="border border-white rounded-full mr-2 link"
                  >
                    <FaFacebookF className="m-2 icon" />
                  </Link>
                </li>
                <li className="li">
                  <Link
                    href=""
                    className="border border-white rounded-full mr-2 link"
                  >
                    <FaTwitter className="m-2 icon" />
                  </Link>
                </li>
                <li className="li">
                  <Link
                    href=""
                    className="border border-white rounded-full mr-2 link"
                  >
                    <FaYoutube className="m-2 icon" />
                  </Link>
                </li>
                <li className="li">
                  <Link
                    href=""
                    className="border border-white rounded-full mr-2 link"
                  >
                    <FaInstagram className="m-2 icon" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-start text-white font-semibold pt-5 md:pt-0">
            <h1 className="text-xl font-bold mb-2 uppercase">About</h1>
            {footer?.map((item: any, idx: number) => (
              <Link href={item?.link} key={idx}>
                {item?.label}
              </Link>
            ))}
          </div>
          <div className="pt-5 md:pt-10 lg:pt-0">
            <h1 className="text-xl font-semibold text-white pb-2 uppercase">
              Dark Mode
            </h1>
            <ul className="ul flex items-center">
              <li className="li dark:border-[#3a3b3c] darkMode">
                <span className="bg-white  dark:bg-black rounded-full mr-2 p-2 link relative">
                  <ThemeSwitch />
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-start text-white font-semibold pt-5 md:pt-10 lg:pt-0">
            <h1 className="text-xl font-bold mb-2 uppercase">Recommended</h1>
            {footerRecommend?.map((item: any, idx: number) => (
              <Link href={item?.link} key={idx} className="pb-3">
                {item?.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

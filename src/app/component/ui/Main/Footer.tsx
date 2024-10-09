import { footer, footerRecommend } from "@/helper/item-list";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
const ThemeSwitch = dynamic(() => import("@/components/ui/ThemeIcon"), {
  ssr: false,
});

const Footer = () => {
  return (
    <footer className="bg-[#191a20] dark:bg-[#ffffff05] from-transparent to-transparent w-full overflow-hidden z-[9999]">
      <div className="max-w-6xl mx-auto py-4 px-4 md:px-6 z-50">
        <div className="w-full md:w-1/3 relative float-left text-white">
          <Link
            prefetch={true}
            className="no-underline hover:no-underline font-bold text-2xl lg:text-4xl flex items-center cursor-default"
            href="/"
          >
            <p className="text-lg md:text-2xl text-cyan-400 cursor-pointer">
              MijuDramaList
            </p>
            <Image
              src="/Untitled.svg"
              alt="Mijudramainfo"
              width={200}
              height={200}
              quality={100}
              loading="lazy"
              className="w-[25px] h-[50px] md:w-[50px] cursor-pointer"
            />
          </Link>
          <p className="my-2">© Copyright 2024. All rights reserved.</p>
          <div className="flex items-center my-4">
            <ul className="ul">
              <li className="li">
                <Link
                  prefetch={true}
                  href="https://www.facebook.com/YuTuQJJ/"
                  className="border border-white rounded-full mr-2 link"
                >
                  <FaFacebookF className="m-2 icon" name="Facebook" />
                </Link>
              </li>
              <li className="li">
                <Link
                  prefetch={true}
                  href="https://x.com/cdramaworldkh"
                  className="border border-white rounded-full mr-2 link"
                >
                  <FaTwitter className="m-2 icon" name="Twiiter" />
                </Link>
              </li>
              <li className="li">
                <Link
                  prefetch={true}
                  href="https://www.youtube.com/@CDramaWorldKH"
                  className="border border-white rounded-full mr-2 link"
                >
                  <FaYoutube className="m-2 icon" name="Youtube" />
                </Link>
              </li>
              <li className="li">
                <Link
                  prefetch={true}
                  href="https://www.instagram.com/cdrama_worldd/"
                  className="border border-white rounded-full mr-2 link"
                >
                  <FaInstagram className="m-2 icon" name="Instagram" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full md:w-1/4 relative float-left">
          <div className="flex flex-col items-start text-white font-semibold pt-5 md:pt-0">
            <h1 className="text-md font-bold mb-2 uppercase">About</h1>
            {footer?.map((item: any, idx: number) => (
              <Link
                prefetch={true}
                href={item?.link}
                key={idx}
                className="text-sm pb-2"
              >
                {item?.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/4 relative float-left">
          <div className="pt-5 md:pt-0">
            <h1 className="text-md font-semibold text-white pb-2 uppercase">
              Dark Mode
            </h1>
            <span className="flex mr-2 p-2">
              <ThemeSwitch />
            </span>
          </div>
        </div>

        <div className="w-full md:w-1/6 relative float-left">
          <div className="flex flex-col items-start text-white font-semibold pt-5 md:pt-0">
            <h1 className="text-md font-bold mb-2 uppercase">Recommended</h1>
            {footerRecommend?.map((item: any, idx: number) => (
              <Link
                prefetch={true}
                href={item?.link}
                key={idx}
                className="text-sm pb-2"
              >
                {item?.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

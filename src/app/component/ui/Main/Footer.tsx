"use client";

import ThemeSwitch from "@/components/ui/ThemeIcon";
import { footer, footer_watch, footerRecommend } from "@/helper/item-list";
import Image from "next/image";
import Link from "next/link";
import { FaGithubAlt, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#191a20] dark:bg-[#ffffff05] w-full h-full">
      <div className="max-w-6xl mx-auto py-8 px-4 md:px-6 h-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 h-full">
          {/* Brand Section */}
          <div className="text-white h-full flex flex-col">
            <div className="flex items-center py-1">
              <Link
                prefetch={false}
                href="/"
                className="flex-shrink-0 font-bold text-xl text-gray-900 dark:text-white"
                aria-label="Website Logo"
              >
                <Image
                  src="/MIJUDRAMAINFO.webp"
                  alt="Mijudramainfo Logo"
                  width={150}
                  height={40}
                  className="w-[100px] h-[27px] sm:w-[120px] sm:h-[32px] md:w-[150px] md:h-[40px] lg:w-[150px] lg:h-[40px] object-contain"
                  priority
                />
              </Link>
            </div>
            <div className="flex items-center mt-4 h-[36px] flex-shrink-0">
              <ul className="flex space-x-2 h-full">
                {[
                  {
                    icon: <FaGithubAlt className="w-5 h-5" />,
                    href: "https://github.com/bunseujjy",
                    name: "Github",
                  },
                  {
                    icon: <FaTwitter className="w-5 h-5" />,
                    href: "https://x.com/cdramaworldkh",
                    name: "Twitter",
                  },
                  {
                    icon: <FaYoutube className="w-5 h-5" />,
                    href: "https://www.youtube.com/@CDramaWorldKH",
                    name: "Youtube",
                  },
                  {
                    icon: <FaInstagram className="w-5 h-5" />,
                    href: "https://www.instagram.com/cdrama_worldd/",
                    name: "Instagram",
                  },
                ].map((social) => (
                  <li
                    key={social.name}
                    className="h-[36px] w-[36px] flex-shrink-0"
                  >
                    <Link
                      aria-label={`Visit ${social.name}`}
                      prefetch={false}
                      href={`${social.href}`}
                      className="border border-white rounded-full flex items-center justify-center w-full h-full hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                    >
                      {social.icon}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* About Section */}
          <div className="text-white h-full">
            <h2 className="text-md font-bold h-[24px] mb-4 uppercase flex-shrink-0">
              About
            </h2>
            <nav className="flex flex-col space-y-2">
              {footer?.map((item: any, idx: number) => (
                <Link
                  prefetch={false}
                  href={`${item?.link}`}
                  key={idx}
                  className="text-sm h-[20px] flex items-center hover:text-cyan-400 transition-colors flex-shrink-0"
                  aria-label={`Visit ${item?.label}`}
                >
                  {item?.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Dark Mode Section */}
          <div className="flex flex-col text-white h-full">
            <div className="w-full h-full">
              <h2 className="text-md font-bold h-[24px] mb-4 uppercase flex-shrink-0">
                Dark Mode
              </h2>
              <div className="h-[40px] flex items-center flex-shrink-0">
                <ThemeSwitch />
              </div>
            </div>
            <h2 className="text-md font-bold h-[24px] my-4 uppercase flex-shrink-0">
              Watch
            </h2>
            <ul className="flex flex-col space-y-2">
              {footer_watch?.map((item: any, idx: number) => (
                <li className="block" key={idx}>
                  <Link
                    aria-label={`Visit Watch Page`}
                    prefetch={false}
                    href={`${item.link}`}
                    className="text-sm h-[20px] flex items-center hover:text-cyan-400 transition-colors flex-shrink-0"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Section */}
          <div className="text-white h-full">
            <h2 className="text-md font-bold h-[24px] mb-4 uppercase flex-shrink-0">
              Recommended
            </h2>
            <div className="flex flex-col space-y-2">
              {footerRecommend?.map((item: any, idx: number) => (
                <Link
                  prefetch={false}
                  href={`${item?.link}`}
                  key={idx}
                  className="text-sm h-[20px] flex items-center hover:text-cyan-400 transition-colors flex-shrink-0"
                  aria-label={`Visit ${item?.label}`}
                >
                  {item?.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

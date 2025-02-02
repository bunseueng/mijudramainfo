"use client";

import ThemeSwitch from "@/components/ui/ThemeIcon";
import { footer, footerRecommend } from "@/helper/item-list";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#191a20] dark:bg-[#ffffff05] w-full h-full">
      <div className="max-w-6xl mx-auto py-8 px-4 md:px-6 h-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 h-full">
          {/* Brand Section */}
          <div className="text-white h-full flex flex-col">
            <div className="flex items-center mt-4 h-[36px] flex-shrink-0">
              <ul className="flex space-x-2 h-full">
                {[
                  {
                    icon: <FaFacebookF className="w-5 h-5" />,
                    href: "https://www.facebook.com/YuTuQJJ/",
                    name: "Facebook",
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
                      href={social.href}
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
                  href={item?.link}
                  key={idx}
                  className="text-sm h-[20px] flex items-center hover:text-cyan-400 transition-colors flex-shrink-0"
                >
                  {item?.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Dark Mode Section */}
          <div className="text-white h-full">
            <h2 className="text-md font-bold h-[24px] mb-4 uppercase flex-shrink-0">
              Dark Mode
            </h2>
            <div className="h-[40px] flex items-center flex-shrink-0">
              <ThemeSwitch />
            </div>
          </div>

          {/* Recommended Section */}
          <div className="text-white h-full">
            <h2 className="text-md font-bold h-[24px] mb-4 uppercase flex-shrink-0">
              Recommended
            </h2>
            <nav className="flex flex-col space-y-2">
              {footerRecommend?.map((item: any, idx: number) => (
                <Link
                  prefetch={false}
                  href={item?.link}
                  key={idx}
                  className="text-sm h-[20px] flex items-center hover:text-cyan-400 transition-colors flex-shrink-0"
                >
                  {item?.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

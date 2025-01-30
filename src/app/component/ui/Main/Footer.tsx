import ThemeSwitch from "@/components/ui/ThemeIcon";
import { footer, footerRecommend } from "@/helper/item-list";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#191a20] dark:bg-[#ffffff05] w-full">
      <div className="max-w-6xl mx-auto py-4 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="text-white">
            <Link
              prefetch={false}
              className="no-underline hover:no-underline font-bold text-2xl lg:text-4xl flex items-center"
              href="/"
            >
              <p className="text-lg md:text-2xl text-cyan-400">MijuDramaList</p>
              <Image
                src="/Untitled.svg"
                alt="Mijudramainfo"
                width={200}
                height={200}
                quality={100}
                loading="lazy"
                className="w-[25px] h-[50px] md:w-[50px]"
              />
            </Link>
            <p className="my-2">© Copyright 2024. All rights reserved.</p>
            <div className="flex items-center my-4">
              <ul className="flex space-x-2">
                {[
                  {
                    icon: <FaFacebookF className="m-2" />,
                    href: "https://www.facebook.com/YuTuQJJ/",
                    name: "Facebook",
                  },
                  {
                    icon: <FaTwitter className="m-2" />,
                    href: "https://x.com/cdramaworldkh",
                    name: "Twitter",
                  },
                  {
                    icon: <FaYoutube className="m-2" />,
                    href: "https://www.youtube.com/@CDramaWorldKH",
                    name: "Youtube",
                  },
                  {
                    icon: <FaInstagram className="m-2" />,
                    href: "https://www.instagram.com/cdrama_worldd/",
                    name: "Instagram",
                  },
                ].map((social) => (
                  <li key={social.name}>
                    <Link
                      aria-label={`Visit ${social.name}?`}
                      prefetch={true}
                      href={social.href}
                      className="border border-white rounded-full inline-flex hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                    >
                      {social.icon}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* About Section */}
          <div className="text-white">
            <h2 className="text-md font-bold mb-4 uppercase">About</h2>
            <div className="flex flex-col space-y-2">
              {footer?.map((item: any, idx: number) => (
                <Link
                  prefetch={false}
                  href={item?.link}
                  key={idx}
                  className="text-sm hover:text-cyan-400 transition-colors"
                >
                  {item?.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Dark Mode Section */}
          <div className="text-white">
            <h2 className="text-md font-bold mb-4 uppercase">Dark Mode</h2>
            <div className="p-2">
              <ThemeSwitch />
            </div>
          </div>

          {/* Recommended Section */}
          <div className="text-white">
            <h2 className="text-md font-bold mb-4 uppercase">Recommended</h2>
            <div className="flex flex-col space-y-2">
              {footerRecommend?.map((item: any, idx: number) => (
                <Link
                  prefetch={false}
                  href={item?.link}
                  key={idx}
                  className="text-sm hover:text-cyan-400 transition-colors"
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

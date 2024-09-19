"use client";

import Link from "next/link";
import React, { useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const PersonList = ({ personId }: any) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<string>("Overview");

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleNavbarMouseEnter = (label: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHovered(label);
  };
  const handleNavbarMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHovered(null);
    }, 200);
  };

  return (
    <div className="bg dark:bg-[#191a20] border-b-[1px] border-b-[#ffffff] flex items-center justify-center shadow-md m-0 p-0 gap-0">
      <ul className="relative inline-block m-0 p-0">
        <li
          className={`inline-flex items-center justify-end mx-2 cursor-pointer pt-4 pb-2 leading-[1px] -mb-[1px] ${
            currentItem === "Overview" && "border-b-[4px] border-b-[#01b4e4]"
          }`}
          onClick={() => setCurrentItem("Overview")}
          onMouseEnter={() => handleNavbarMouseEnter("Overview")}
          onMouseLeave={handleNavbarMouseLeave}
        >
          Overview{" "}
          <span className="inline-flex items-center justify-center ml-1">
            <IoIosArrowDown />
          </span>
        </li>{" "}
        {hovered === "Overview" && (
          <div
            className="absolute top-7 left-2 bg-white border-[1px] border-[#00000026] shadow-md rounded-md mt-2"
            onMouseEnter={() => handleNavbarMouseEnter("Overview")}
            onMouseLeave={handleNavbarMouseLeave}
          >
            <ul className="text-black py-2">
              <li className="text-sm text-muted-foreground opacity-60 my-2 mx-6 cursor-text">
                Edit Information
              </li>
              <li className="text-sm my-2 mx-6 cursor-pointer">
                <Link
                  prefetch={true}
                  href={`/person/${personId}/edit/details`}
                  onClick={() => setCurrentItem("Overview")}
                >
                  Primary Details
                </Link>
              </li>
              <li className="text-sm my-2 mx-6 cursor-pointer">
                <Link prefetch={true} href={`/person/${personId}/edit/cover`}>
                  Cover Image
                </Link>
              </li>
              <li className="text-sm my-2 mx-6 cursor-pointer">
                <Link prefetch={true} href={`/person/${personId}/edit/cast`}>
                  Cast Credits
                </Link>
              </li>
              <li className="text-sm my-2 mx-6 cursor-pointer">
                <Link prefetch={true} href={`/person/${personId}/edit/crew`}>
                  Crew Credits
                </Link>
              </li>
              <li className="text-sm my-2 mx-6 cursor-pointer">
                <Link
                  prefetch={true}
                  href={`/person/${personId}/edit/external_link`}
                >
                  External_Links Credits
                </Link>
              </li>
              <li className="text-sm my-2 mx-6 cursor-pointer">
                <Link prefetch={true} href={`/person/${personId}/edit/details`}>
                  Report
                </Link>
              </li>
            </ul>
          </div>
        )}
        <li
          className={`inline-flex items-center justify-end mx-2 cursor-pointer pt-4 pb-[0.25rem] ${
            currentItem === "Media" && "border-b-[4px] border-b-[#01b4e4]"
          }`}
          onClick={() => setCurrentItem("Media")}
          onMouseEnter={() => handleNavbarMouseEnter("Media")}
          onMouseLeave={handleNavbarMouseLeave}
        >
          Media{" "}
          <span>
            <IoIosArrowDown />
          </span>
        </li>
        {hovered === "Media" && (
          <div
            className="absolute top-7 left-16 bg-white border-[1px] border-[#00000026] shadow-md rounded-md mt-2"
            onMouseEnter={() => handleNavbarMouseEnter("Media")}
            onMouseLeave={handleNavbarMouseLeave}
          >
            <ul className="text-black py-2">
              <li className="text-sm my-2 mx-6 cursor-pointer">Profiles</li>
            </ul>
          </div>
        )}
        <li
          className={`inline-flex items-center justify-end mx-2 cursor-pointer pt-4 pb-[0.25rem] ${
            currentItem === "Fandom" && "border-b-[4px] border-b-[#01b4e4]"
          }`}
          onClick={() => setCurrentItem("Fandom")}
          onMouseEnter={() => handleNavbarMouseEnter("Fandom")}
          onMouseLeave={handleNavbarMouseLeave}
        >
          Fandom{" "}
          <span>
            <IoIosArrowDown />
          </span>
        </li>{" "}
        {hovered === "Fandom" && (
          <div
            className="absolute top-7 right-24 bg-white border-[1px] border-[#00000026] shadow-md rounded-md mt-2"
            onMouseEnter={() => handleNavbarMouseEnter("Fandom")}
            onMouseLeave={handleNavbarMouseLeave}
          >
            <ul className="py-2">
              <li className="text-sm my-2 mx-6 cursor-pointer">Discuss</li>
            </ul>
          </div>
        )}
        <li
          className={`inline-flex items-center justify-end mx-2 cursor-pointer pt-4 pb-1 ${
            currentItem === "Share" && "border-b-[4px] border-b-[#01b4e4]"
          }`}
          onClick={() => setCurrentItem("Share")}
          onMouseEnter={() => handleNavbarMouseEnter("Share")}
          onMouseLeave={handleNavbarMouseLeave}
        >
          Share{" "}
          <span>
            <IoIosArrowDown />
          </span>
        </li>
        {hovered === "Share" && (
          <div
            className="absolute top-7 right-4 bg-white border-[1px] border-[#00000026] shadow-md rounded-md mt-2"
            onMouseEnter={() => handleNavbarMouseEnter("Share")}
            onMouseLeave={handleNavbarMouseLeave}
          >
            <ul className="text-black py-2">
              <li className="text-sm my-2 mx-6 cursor-pointer">Share Links</li>
              <li className="text-sm my-2 mx-6 cursor-pointer">Facebook</li>
              <li className="text-sm my-2 mx-6 cursor-pointer">Tweet</li>
            </ul>
          </div>
        )}
      </ul>
    </div>
  );
};

export default PersonList;

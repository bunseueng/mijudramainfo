import React from "react";
import Link from "next/link";

interface NavbarItemsProps {
  items: { label: string; link: string }[];
  currentNav: string;
  setCurrentNav: (nav: string) => void;
  handleNavbarMouseEnter: (label: string) => void;
  handleNavbarMouseLeave: () => void;
}

const NavbarItems: React.FC<NavbarItemsProps> = ({
  items,
  currentNav,
  setCurrentNav,
  handleNavbarMouseEnter,
  handleNavbarMouseLeave,
}) => {
  return (
    <ul className="hidden lg:flex flex-col relative mt-4 font-medium border border-gray-100 rounded-b-md lg:flex-row lg:mt-0 lg:border-0 dark:border-gray-700">
      {items.map((item, idx) => (
        <li
          key={idx}
          onMouseEnter={() => handleNavbarMouseEnter(item.label)}
          onMouseLeave={handleNavbarMouseLeave}
          onClick={() => setCurrentNav(item.link)}
        >
          <Link
            prefetch={false}
            href={item.link}
            className={`block py-2 px-2 xl:px-3 text-xs md:text-[16px] font-semibold text-[#FFFFFF] rounded lg:bg-transparent cursor-default ${
              item.link === currentNav &&
              "text-[#bb8b51] opacity-100 font-semibold"
            }`}
          >
            <span className="cursor-pointer">{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavbarItems;

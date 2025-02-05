import type React from "react";
import Link from "next/link";
import Image from "next/image";

interface NavbarItemsProps {
  items: { label: string; link: string; icon: string }[];
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
    <ul className="hidden lg:flex flex-col relative mt-4 font-medium border border-gray-100 rounded-b-md lg:flex-row lg:mt-0 lg:border-0 dark:border-gray-700 justify-center items-center gap-2 lg:gap-4">
      {items.map((item, idx) => (
        <li
          key={idx}
          onMouseEnter={() => handleNavbarMouseEnter(item.label)}
          onMouseLeave={handleNavbarMouseLeave}
          onClick={() => setCurrentNav(item.link)}
          className="relative group"
        >
          <Link
            prefetch={false}
            href={item.link}
            className={`flex items-center px-3 py-2 rounded-md transition-all duration-300 ease-in-out ${
              item.link === currentNav
                ? "bg-gray-800 text-[#bb8b51]"
                : "text-white hover:bg-gray-800 hover:text-[#bb8b51]"
            }`}
          >
            {item?.label !== "For You" && (
              <Image
                src={item.icon || "/placeholder.svg"}
                alt={`${item.label} icon`}
                width={25}
                height={25}
                className="w-5 h-5 mr-2 rounded-md object-cover"
              />
            )}
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#bb8b51] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></div>
        </li>
      ))}
    </ul>
  );
};

export default NavbarItems;

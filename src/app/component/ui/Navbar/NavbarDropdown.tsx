import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface NavbarDropdownProps {
  items: { label: string; link: string }[];
  title: string;
}

const NavbarDropdown: React.FC<NavbarDropdownProps> = ({ items, title }) => {
  return (
    <ul className="py-2 px-5">
      <span className="text-md text-[#818a91] my-1 px-2 xl:px-3">{title}</span>
      {items.map((item, idx) => (
        <motion.li
          key={idx}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={item.link}
            className="block py-2 px-2 xl:px-3 text-sm xl:text-md text-black dark:text-white font-semibold rounded lg:bg-transparent cursor-pointer hover:bg-gray-400 hover:text-black transform duration-300"
          >
            <span className="text-xs cursor-pointer">{item.label}</span>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
};

export default NavbarDropdown;

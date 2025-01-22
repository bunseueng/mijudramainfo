import React from "react";
import { motion } from "framer-motion";
import NavbarDropdown from "./NavbarDropdown";
import {
  tv_subitems,
  movie_subitems,
  people_subitems,
} from "@/helper/item-list";

interface NavbarDropdownMenuProps {
  hovered: boolean;
  setHovered: (hovered: boolean) => void;
  hoverTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
}

const NavbarDropdownMenu: React.FC<NavbarDropdownMenuProps> = ({
  hovered,
  setHovered,
  hoverTimeout,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{
        opacity: hovered ? 1 : 0,
        y: hovered ? 0 : 15,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`absolute top-[60px] left-[20%] w-[600px] bg-gray-100 dark:bg-[#18191a] flex rounded-md mx-3 ${
        hovered ? "block" : "hidden"
      }`}
      onMouseEnter={() => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setHovered(true);
      }}
      onMouseLeave={() => {
        hoverTimeout.current = setTimeout(() => {
          setHovered(false);
        }, 300);
      }}
    >
      <NavbarDropdown items={tv_subitems} title="TV Shows" />
      <NavbarDropdown items={movie_subitems} title="Movies" />
      <NavbarDropdown items={people_subitems} title="People" />
    </motion.div>
  );
};

export default NavbarDropdownMenu;

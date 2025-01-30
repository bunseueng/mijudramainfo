import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Tv, Film, Users } from "lucide-react";

interface SidebarItemProps {
  item: {
    label: string;
    link: string;
  };
  currentNav: string;
  setCurrentNav: (nav: string) => void;
  closeSidebar: () => void;
}

const iconMap: { [key: string]: React.ReactNode } = {
  Home: <Home className="mr-2 h-4 w-4" />,
  "TV Shows": <Tv className="mr-2 h-4 w-4" />,
  Movies: <Film className="mr-2 h-4 w-4" />,
  People: <Users className="mr-2 h-4 w-4" />,
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  currentNav,
  setCurrentNav,
  closeSidebar,
}) => {
  const isActive = item.link === currentNav;

  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      className={`w-full justify-start ${
        isActive ? "bg-primary text-primary-foreground" : ""
      }`}
      asChild
    >
      <Link
        prefetch={false}
        href={item.link}
        onClick={() => {
          setCurrentNav(item.link);
          closeSidebar();
        }}
      >
        {iconMap[item.label] || null}
        {item.label}
      </Link>
    </Button>
  );
};

export default SidebarItem;

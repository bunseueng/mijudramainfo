import React from "react";
import Link from "next/link";
import Image from "next/image";

interface NavbarLogoProps {
  setCurrentNav: (nav: string) => void;
}

const NavbarLogo: React.FC<NavbarLogoProps> = ({ setCurrentNav }) => {
  return (
    <div className="hidden md:flex items-center py-1">
      <Link
        href="/"
        className="flex-shrink-0 font-bold text-xl text-gray-900 dark:text-white gap-1.5"
        onClick={() => setCurrentNav("/")}
        aria-label="Homepage"
      >
        <Image
          src="/MIJUDRAMAINFO__2_-removebg-preview.png"
          alt="Mijudramainfo Logo"
          width={150}
          height={10}
          className="h-8 sm:h-10 w-auto"
          style={{ maxWidth: "100%", height: "40px" }}
          priority
        />
      </Link>
    </div>
  );
};

export default NavbarLogo;

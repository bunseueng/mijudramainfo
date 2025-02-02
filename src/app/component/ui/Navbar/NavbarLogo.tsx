import React from "react";
import Link from "next/link";
import Image from "next/image";

interface NavbarLogoProps {
  setCurrentNav: (nav: string) => void;
}

const NavbarLogo: React.FC<NavbarLogoProps> = ({ setCurrentNav }) => {
  return (
    <div className="flex items-center py-1">
      <Link
        prefetch={false}
        href="/"
        className="flex-shrink-0 font-bold text-xl text-gray-900 dark:text-white"
        onClick={() => setCurrentNav("/")}
        aria-label="Homepage"
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
  );
};

export default NavbarLogo;

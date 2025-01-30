"use client";

import ReportModal from "@/app/component/ui/Modal/ReportModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";

const PersonList = ({ personId }: any) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<string>("Overview");
  const [currentUrl, setCurrentUrl] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
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

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };
  const handleShare = (idx: number) => {
    setIsShareModalOpen((prev) => {
      const newShareModal = [...prev];
      newShareModal[idx] = !newShareModal[idx];
      // Toggle the specific item
      return newShareModal;
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success("Copied to clipboard");
      setIsShareModalOpen([]);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    setCurrentUrl(`${window.location.origin}${pathname}`);
  }, [pathname]);
  return (
    <div className="bg dark:bg-[#191a20] border-b-[1px] border-b-[#ffffff] flex items-center justify-center shadow-md m-0 p-0 gap-0">
      <ul className="relative inline-block m-0 p-0">
        <li
          className={`inline-flex items-center justify-end text-xs md:text-base mx-2 cursor-pointer pt-4 pb-2 leading-[1px] -mb-[1px] ${
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
                  prefetch={false}
                  href={`/person/${personId}/edit/details`}
                  onClick={() => setCurrentItem("Overview")}
                >
                  Primary Details
                </Link>
              </li>
              <li className="text-sm my-2 mx-6 cursor-pointer">
                <Link prefetch={false} href={`/person/${personId}/edit/cover`}>
                  Cover Image
                </Link>
              </li>
              <li className="text-sm my-2 mx-6 cursor-pointer">
                <Link prefetch={false} href={`/person/${personId}/edit/cast`}>
                  Cast Credits
                </Link>
              </li>
              <li className="text-sm my-2 mx-6 cursor-pointer">
                <Link prefetch={false} href={`/person/${personId}/edit/crew`}>
                  Crew Credits
                </Link>
              </li>
              <li className="text-sm my-2 mx-6 cursor-pointer">
                <Link
                  prefetch={false}
                  href={`/person/${personId}/edit/external_link`}
                >
                  External_Links Credits
                </Link>
              </li>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <li className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer">
                    Report a Problem
                  </li>
                </DialogTrigger>
                {isOpen && (
                  <ReportModal route="person" id={personId} type="person" />
                )}
              </Dialog>
            </ul>
          </div>
        )}
        <li
          className={`inline-flex items-center justify-end text-xs md:text-base mx-2 cursor-pointer pt-4 pb-[0.25rem] ${
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
            className="absolute top-7 left-28 bg-white border-[1px] border-[#00000026] shadow-md rounded-md mt-2"
            onMouseEnter={() => handleNavbarMouseEnter("Media")}
            onMouseLeave={handleNavbarMouseLeave}
          >
            <ul className="text-black py-2">
              <Link href={`/person/${personId}/photos`}>
                <li className="text-sm my-2 mx-6 cursor-pointer">Profiles</li>
              </Link>
            </ul>
          </div>
        )}
        <li
          className={`inline-flex items-center justify-end text-xs md:text-base mx-2 cursor-pointer pt-4 pb-[0.25rem] ${
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
            className="absolute top-7 right-16 bg-white border-[1px] border-[#00000026] shadow-md rounded-md mt-2"
            onMouseEnter={() => handleNavbarMouseEnter("Fandom")}
            onMouseLeave={handleNavbarMouseLeave}
          >
            <ul className="py-2 text-black">
              <Link href="#comment">
                <li className="text-sm my-2 mx-6 cursor-pointer">Discuss</li>
              </Link>
            </ul>
          </div>
        )}
        <li
          className={`inline-flex items-center justify-end text-xs md:text-base mx-2 cursor-pointer pt-4 pb-1 ${
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
            className="absolute top-7 right-0 md:-right-14 bg-white border-[1px] border-[#00000026] shadow-md rounded-md mt-2"
            onMouseEnter={() => handleNavbarMouseEnter("Share")}
            onMouseLeave={handleNavbarMouseLeave}
          >
            <ul className="text-black py-2">
              <li
                className="text-sm hover:bg-[#f8f9fa]  py-1 px-6 cursor-pointer"
                onClick={() => {
                  handleShare(1);
                }}
              >
                Share Links
              </li>
              <Dialog
                open={isShareModalOpen[1]}
                onOpenChange={() => handleShare(1)}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Links</DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <Input value={currentUrl} ref={inputRef} readOnly />
                    <Button onClick={copyToClipboard} size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => handleShare(1)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <li
                className="text-sm my-2 mx-6 cursor-pointer"
                onClick={shareOnFacebook}
              >
                Facebook
              </li>
              <li
                className="text-sm my-2 mx-6 cursor-pointer"
                onClick={shareOnTwitter}
              >
                Tweet
              </li>
            </ul>
          </div>
        )}
      </ul>
    </div>
  );
};

export default PersonList;

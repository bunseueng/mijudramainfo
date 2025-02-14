"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Share2, Edit, Image, Users, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import ReportModal from "@/app/component/ui/Modal/ReportModal";

type LucideIcon = typeof ChevronDown;

type DropdownItem =
  | { label: string; href: string }
  | { label: string; onClick: () => void };

type TvListProps = {
  tv_id: string;
};

const TvList = ({ tv_id }: TvListProps) => {
  const [activeItem, setActiveItem] = useState<string>("Overview");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const [currentUrl, setCurrentUrl] = useState<string>("");

  useEffect(() => {
    setCurrentUrl(`${window.location.origin}${pathname}`);
  }, [pathname]);

  const menuItems: Array<{
    label: string;
    icon: LucideIcon;
    dropdownItems: DropdownItem[];
  }> = [
    {
      label: "Overview",
      icon: Edit,
      dropdownItems: [
        { label: "Primary Details", href: `/tv/${tv_id}/edit/detail` },
        { label: "Cover Image", href: `/tv/${tv_id}/edit/cover` },
        { label: "Related Titles", href: `/tv/${tv_id}/edit/related` },
        { label: "Cast Credits", href: `/tv/${tv_id}/edit/cast` },
        { label: "Crew Credits", href: `/tv/${tv_id}/edit/crew` },
        { label: "Genres", href: `/tv/${tv_id}/edit/genres` },
        { label: "Tags", href: `/tv/${tv_id}/edit/genres` },
        { label: "Release Information", href: `/tv/${tv_id}/edit/release` },
        { label: "Services", href: `/tv/${tv_id}/edit/services` },
        { label: "External Links", href: `/tv/${tv_id}/edit/external_link` },
        {
          label: "Production Information",
          href: `/tv/${tv_id}/edit/production`,
        },
      ],
    },
    {
      label: "Media",
      icon: Image,
      dropdownItems: [
        { label: "Backdrop", href: `/tv/${tv_id}/photos` },
        { label: "Poster", href: `/tv/${tv_id}/photos/poster` },
        { label: "Videos", href: `/tv/${tv_id}/videos` },
      ],
    },
    {
      label: "Fandom",
      icon: Users,
      dropdownItems: [
        { label: "Discuss", href: "#comment" },
        { label: "Reviews", href: `/tv/${tv_id}/reviews` },
      ],
    },
    {
      label: "Share",
      icon: Share2,
      dropdownItems: [
        { label: "Share Links", onClick: () => setIsShareModalOpen(true) },
        { label: "Facebook", onClick: () => shareOnSocialMedia("facebook") },
        { label: "Twitter", onClick: () => shareOnSocialMedia("twitter") },
      ],
    },
  ];

  const shareOnSocialMedia = (platform: "facebook" | "twitter") => {
    const url =
      platform === "facebook"
        ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            currentUrl
          )}`
        : `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            currentUrl
          )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success("Copied to clipboard");
      setIsShareModalOpen(false);
    } catch (err) {
      toast.error("Failed to copy text: ");
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-center h-12 md:h-16">
          <ul className="flex items-center justify-center space-x-8">
            {menuItems.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  className={`group inline-flex items-center text-sm md:text-base pt-4 pb-3 px-1
                    ${
                      activeItem === item.label
                        ? "text-blue-600 border-b-[3px] border-blue-600"
                        : "text-gray-700 dark:text-gray-200 hover:text-blue-600"
                    }`}
                  onClick={() => setActiveItem(item.label)}
                >
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="md:hidden">
                    <item.icon className="w-4 h-4" />
                  </span>
                  <ChevronDown
                    className="w-3 h-3 ml-1 transform transition-transform duration-200 
                    group-hover:rotate-180"
                  />
                </button>

                <AnimatePresence>
                  {hoveredItem === item.label && item.dropdownItems && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-48 rounded-md bg-white dark:bg-gray-800 
                        shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <ul className="py-2">
                        {item.dropdownItems.map((dropdownItem) => (
                          <li key={dropdownItem.label}>
                            {"href" in dropdownItem ? (
                              <Link
                                href={dropdownItem.href}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 
                                  dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                {dropdownItem.label}
                              </Link>
                            ) : (
                              <button
                                onClick={dropdownItem.onClick}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 
                                  hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                {dropdownItem.label}
                              </button>
                            )}
                          </li>
                        ))}
                        {item.label === "Overview" && (
                          <li>
                            <button
                              onClick={() => setIsReportModalOpen(true)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 
                                hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              Report a Problem
                            </button>
                          </li>
                        )}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this page</DialogTitle>
            <DialogDescription>
              Copy the link or share directly to social media
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
            <Input
              value={currentUrl}
              ref={inputRef}
              readOnly
              className="bg-transparent border-none focus:outline-none"
            />
            <Button onClick={copyToClipboard} size="sm" variant="ghost">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2">
            <Button
              onClick={() => shareOnSocialMedia("facebook")}
              className="w-full sm:w-auto"
            >
              Share on Facebook
            </Button>
            <Button
              onClick={() => shareOnSocialMedia("twitter")}
              className="w-full sm:w-auto"
            >
              Share on Twitter
            </Button>
            <Button
              onClick={() => setIsShareModalOpen(false)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReportModal
        route="tv"
        id={tv_id}
        type="tv"
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </nav>
  );
};

export default TvList;

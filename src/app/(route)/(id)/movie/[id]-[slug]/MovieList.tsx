"use client";

import { fetchMovie, fetchMovieImages } from "@/app/actions/fetchMovieApi";
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
import LazyImage from "@/components/ui/lazyimage";
import { movieId } from "@/helper/type";
import { useQuery } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { toast } from "react-toastify";

const MovieList = ({ movie_id }: movieId) => {
  const { data: movie } = useQuery({
    queryKey: ["movie"],
    queryFn: () => fetchMovie(movie_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const { data: image } = useQuery({
    queryKey: ["image"],
    queryFn: () => fetchMovieImages(movie_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
  });
  const [hovered, setHovered] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<string>("Overview");
  const [currentUrl, setCurrentUrl] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="bg-[#191a20] text-white border-b-[1px] border-b-[#ffffff] flex items-center justify-center shadow-md m-0 p-0 gap-0">
      <LazyImage
        src={`https://image.tmdb.org/t/p/w500/${
          movie?.poster_path || movie?.backdrop_path
        }`}
        alt={`${movie?.name || movie?.title}'s Poster`}
        width={200}
        height={200}
        quality={100}
        priority
        className="w-[60px] h-[90px] bg-center object-center rounded-md hidden"
      />
      <ul className="relative inline-block m-0 p-0 z-50">
        <li
          className={`inline-flex items-center justify-end text-xs md:text-base mx-2 cursor-pointer pb-2 leading-[1px] -mb-[1px] ${
            currentItem === "Overview" && "border-b-[2px] border-b-[#01b4e4]"
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
              <li className="text-sm text-muted-foreground hover:bg-[#f8f9fa] opacity-60 my-2 mx-6 cursor-text">
                Edit Information
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer">
                <Link
                  href={`/movie/${movie_id}/edit/detail`}
                  onClick={() => setCurrentItem("Overview")}
                >
                  Primary Details
                </Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer">
                <Link prefetch={false} href={`/movie/${movie_id}/edit/cover`}>
                  Cover Image
                </Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer">
                <Link prefetch={false} href={`/movie/${movie_id}/edit/related`}>
                  Related Titles
                </Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer">
                <Link prefetch={false} href={`/movie/${movie_id}/edit/cast`}>
                  Cast Credits
                </Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer">
                <Link prefetch={false} href={`/movie/${movie_id}/edit/crew`}>
                  Crew Credits
                </Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer">
                <Link prefetch={false} href={`/movie/${movie_id}/edit/genres`}>
                  Genres
                </Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer">
                <Link prefetch={false} href={`/movie/${movie_id}/edit/genres`}>
                  Tags
                </Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer">
                <Link prefetch={false} href={`/movie/${movie_id}/edit/release`}>
                  Release Information
                </Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer">
                <Link
                  prefetch={false}
                  href={`/movie/${movie_id}/edit/services`}
                >
                  Services
                </Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer">
                <Link
                  prefetch={false}
                  href={`/movie/${movie_id}/edit/external_link`}
                >
                  External Links
                </Link>
              </li>
              <li className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer">
                <Link
                  prefetch={false}
                  href={`/movie/${movie_id}/edit/production`}
                >
                  Production Information
                </Link>
              </li>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <li className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer">
                    Report a Problem
                  </li>
                </DialogTrigger>
                {isOpen && <ReportModal route="movie" id={movie_id} />}
              </Dialog>
            </ul>
          </div>
        )}
        <li
          className={`inline-flex items-center justify-end text-xs md:text-base mx-2 cursor-pointer pt-4 pb-[0.25rem] ${
            currentItem === "Media" && "border-b-[3px] border-b-[#01b4e4]"
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
        {(hovered === "Media" || hovered === "Videos") && (
          <div
            className="absolute top-7 left-14 lg:left-[116px] bg-white border-[1px] border-[#00000026] shadow-md rounded-md mt-2"
            onMouseEnter={() => handleNavbarMouseEnter("Media")}
            onMouseLeave={handleNavbarMouseLeave}
          >
            <ul className="relative text-black py-2">
              <li className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer">
                <Link prefetch={false} href={`/movie/${movie_id}/photos`}>
                  Photos{" "}
                  <span className="inline-block align-middle pl-2 pb-1">
                    <IoIosArrowForward />
                  </span>
                </Link>
              </li>

              <div
                className="relative"
                onMouseEnter={() => handleNavbarMouseEnter("Videos")}
                onMouseLeave={handleNavbarMouseLeave}
              >
                <li
                  className={`text-sm py-2 px-6 cursor-pointer ${
                    hovered === "Videos" && "bg-cyan-400"
                  }`}
                >
                  Videos{" "}
                  <span className="inline-block align-middle pl-2 pb-1">
                    <IoIosArrowForward />
                  </span>
                </li>
                {hovered === "Videos" && (
                  <div className="w-[150px] md:w-[200px] absolute top-7 left-6 md:-top-10 md:left-full bg-white border-[1px] border-[#00000026] shadow-md rounded-md mt-2">
                    <ul className="py-2">
                      <Link
                        prefetch={false}
                        href={`/movie/${movie_id}/videos/trailers`}
                      >
                        <li className="text-xs md:text-basehover:bg-[#f8f9fa] py-1 px-2 md:px-6 cursor-pointer">
                          Trailers
                        </li>
                      </Link>
                      <Link
                        prefetch={false}
                        href={`/movie/${movie_id}/videos/behind_the_scenes`}
                      >
                        <li className="text-xs md:text-basehover:bg-[#f8f9fa] py-1 px-2 md:px-6 cursor-pointer">
                          Behind The Scenes
                        </li>
                      </Link>
                      <Link
                        prefetch={false}
                        href={`/movie/${movie_id}/videos/featurettes`}
                      >
                        <li className="text-xs md:text-basehover:bg-[#f8f9fa] py-1 px-2 md:px-6 cursor-pointer">
                          Featurettes
                        </li>
                      </Link>
                      <Link
                        prefetch={false}
                        href={`/movie/${movie_id}/videos/teasers`}
                      >
                        <li className="text-xs md:text-basehover:bg-[#f8f9fa] py-1 px-2 md:px-6 cursor-pointer">
                          Teasers
                        </li>
                      </Link>
                      <Link
                        prefetch={false}
                        href={`/movie/${movie_id}/videos/opening_credits`}
                      >
                        <li className="text-xs md:text-basehover:bg-[#f8f9fa] py-1 px-2 md:px-6 cursor-pointer">
                          Opening Credits
                        </li>
                      </Link>
                      <Link
                        prefetch={false}
                        href={`/movie/${movie_id}/videos/clips`}
                      >
                        <li className="text-xs md:text-basehover:bg-[#f8f9fa] py-1 px-2 md:px-6 cursor-pointer">
                          Clips
                        </li>
                      </Link>
                    </ul>
                  </div>
                )}
              </div>
            </ul>
          </div>
        )}
        <li
          className={`inline-flex items-center justify-end text-xs md:text-base mx-2 cursor-pointer pt-4 pb-[0.25rem] ${
            currentItem === "Fandom" && "border-b-[3px] border-b-[#01b4e4]"
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
            className="absolute top-7 right-[59px] bg-white border-[1px] border-[#00000026] shadow-md rounded-md mt-2"
            onMouseEnter={() => handleNavbarMouseEnter("Fandom")}
            onMouseLeave={handleNavbarMouseLeave}
          >
            <ul className="text-black py-2">
              <Link href="#comment">
                <li className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer">
                  Discuss
                </li>
              </Link>
              <Link prefetch={false} href={`/movie/${movie_id}/reviews`}>
                <li className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer">
                  Reviews
                </li>
              </Link>
            </ul>
          </div>
        )}
        <li
          className={`inline-flex items-center justify-end text-xs md:text-base mx-2 cursor-pointer pt-4 pb-1 ${
            currentItem === "Share" && "border-b-[3px] border-b-[#01b4e4]"
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
            className="absolute top-7 right-0 md:-right-[52px] bg-white border-[1px] border-[#00000026] shadow-md rounded-md mt-2"
            onMouseEnter={() => handleNavbarMouseEnter("Share")}
            onMouseLeave={handleNavbarMouseLeave}
          >
            <ul className="text-black py-2">
              <li
                className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer"
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
                className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer"
                onClick={shareOnFacebook}
              >
                Facebook
              </li>
              <li
                className="text-sm hover:bg-[#f8f9fa] py-1 px-6 cursor-pointer"
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

export default MovieList;

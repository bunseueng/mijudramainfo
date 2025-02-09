"use client";

import { editPageList } from "@/helper/item-list";
import { Drama, tvId } from "@/helper/type";
import Link from "next/link";
import React, { useState, useEffect, lazy, Suspense } from "react";
import { VscQuestion } from "react-icons/vsc";
import { useRouter, usePathname } from "next/navigation";
import { useDramaData } from "@/hooks/useDramaData";
import { spaceToHyphen } from "@/lib/spaceToHyphen";

const TvDetails = lazy(() => import("./TvDetails"));
const TvCover = lazy(() => import("../cover/TvCover"));
const RelatedTitle = lazy(() => import("../related/RelatedTitle"));
const TvCast = lazy(() => import("../cast/TvCast"));
const TvCrew = lazy(() => import("../crew/TvCrew"));
const TvServices = lazy(() => import("../services/TvServices"));
const ReleaseInfo = lazy(() => import("../release/ReleaseInfo"));
const Production = lazy(() => import("../production/Production"));
const Genres = lazy(() => import("../genres/Genres"));
const ExternalLink = lazy(() => import("../external_link/ExternalLink"));

const TvEditList: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const { tv, isLoading } = useDramaData(tv_id);
  const [currentPage, setCurrentPage] = useState("/edit");
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: string
  ) => {
    e.preventDefault();
    setCurrentPage(link);
    router.push(`/tv/${tv?.id}/edit${link}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    if (pathname) {
      const pathArray = pathname.split("/");
      const newPage = `/${pathArray[pathArray.length - 1]}`;
      setCurrentPage(newPage);
    }
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderContent = () => {
    const components = {
      "/edit": TvDetails,
      "/detail": TvDetails,
      "/cover": TvCover,
      "/related": RelatedTitle,
      "/cast": TvCast,
      "/crew": TvCrew,
      "/services": TvServices,
      "/release": ReleaseInfo,
      "/production": Production,
      "/genres": Genres,
      "/external_link": ExternalLink,
    };

    const Component = components[currentPage as keyof typeof components];

    return Component ? (
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-full h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }
      >
        <Component tv_id={tv_id} tvDetails={tvDetails as any} />
      </Suspense>
    ) : null;
  };

  return (
    <div className="w-full h-full">
      <div className="w-full relative h-auto float-right bg-background border border-border shadow-sm rounded-b-md">
        <div className="px-4 py-3">
          <h1 className="text-2xl font-semibold">
            <Link
              prefetch={false}
              href={`/tv/${tv?.id}-${spaceToHyphen(tv?.name || tv?.title)}`}
              className="hover:text-primary transition-colors"
            >
              {tv?.title || tv?.name}
            </Link>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 p-4">
            <div className="bg-card border border-border rounded-md px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-medium">Edit</h2>
                <VscQuestion className="text-muted-foreground" />
              </div>

              <nav>
                <ul className="space-y-2">
                  {editPageList?.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        prefetch={false}
                        href={`/tv/${tv?.id}/edit${item.link}`}
                        className={`flex items-center px-2 py-1.5 rounded-md transition-colors ${
                          currentPage === item.link
                            ? "text-primary bg-primary/10"
                            : "text-foreground hover:bg-muted"
                        }`}
                        onClick={(e) => handleNavigation(e, item.link)}
                      >
                        <span className="inline-flex items-center justify-center w-8">
                          {item.icon}
                        </span>
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          <div className="flex-1 p-4">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default TvEditList;

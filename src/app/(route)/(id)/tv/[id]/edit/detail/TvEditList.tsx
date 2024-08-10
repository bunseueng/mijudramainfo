"use client";

import { fetchTv } from "@/app/actions/fetchMovieApi";
import { editPageList } from "@/helper/item-list";
import { Drama, tvId } from "@/helper/type";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { VscQuestion } from "react-icons/vsc";
import TvDetails from "./TvDetails";
import { useRouter, usePathname } from "next/navigation";
import TvCover from "../cover/TvCover";
import RelatedTitle from "../related/RelatedTitle";
import TvCast from "../cast/TvCast";
import TvCrew from "../crew/TvCrew";
import TvServices from "../services/TvServices";
import ReleaseInfo from "../release/ReleaseInfo";
import Production from "../production/Production";
import Genres from "../genres/Genres";
import ExternalLink from "../external_link/ExternalLink";

const TvEditList: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const [currentPage, setCurrentPage] = useState("/detail");
  const { data: tv } = useQuery({
    queryKey: ["tvEdit", tv_id],
    queryFn: () => fetchTv(tv_id),
  });

  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: string
  ) => {
    e.preventDefault();
    setCurrentPage(link);
    router.push(`/tv/${tv?.id}/edit/${link}`);
  };

  useEffect(() => {
    if (pathname) {
      const pathArray = pathname.split("/");
      const newPage = `/${pathArray[pathArray.length - 1]}`;
      setCurrentPage(newPage);
    }
  }, [pathname]);

  return (
    <div className="w-full h-[100%]">
      <div className="w-full relative h-auto float-right bg-white dark:bg-[#242526] border-2 border-slate-200 dark:border-[#232426] shadow-sm rounded-b-md">
        <div className="px-3 mb-2">
          <h1 className="text-2xl font-semibold pt-3 mb-2">
            <Link href={`/tv/${tv?.id}`}>{tv?.title || tv?.name}</Link>
          </h1>
        </div>
        <div className="relative float-left w-full md:w-[25%] py-3 px-4">
          <div className="bg-white dark:bg-[#3a3b3c] border-2 border-[#dcdfe6] dark:border-[#242527] rounded-sm px-4 py-2">
            <div className="flex items-center justify-between">
              <h1>Edit</h1>
              <VscQuestion />
            </div>
          </div>
          <ul className="pt-3">
            {editPageList?.map((item, idx) => (
              <li
                key={idx}
                className={`pb-2 ${
                  currentPage === item?.link
                    ? "text-[#1675b6]"
                    : "text-black dark:text-white"
                }`}
              >
                <Link
                  href={`/tv/${tv?.id}/edit/${item?.link}`}
                  className="text-md"
                  shallow
                  onClick={(e) => handleNavigation(e, item.link)}
                >
                  <span className="inline-block text-center mr-5 md:mr-3 lg:mr-5">
                    {item?.icon}
                  </span>
                  <span className="text-center md:text-sm lg:text-md">
                    {item?.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative float-left w-full md:w-[75%] -px-3">
          {currentPage === "/detail" ? (
            <TvDetails tv_id={tv_id} tvDetails={tvDetails} />
          ) : currentPage === "/cover" ? (
            <TvCover tv_id={tv_id} tvDetails={tvDetails} />
          ) : currentPage === "/related" ? (
            <RelatedTitle tv_id={tv_id} tvDetails={tvDetails} />
          ) : currentPage === "/cast" ? (
            <TvCast tv_id={tv_id} tvDetails={tvDetails} />
          ) : currentPage === "/crew" ? (
            <TvCrew tv_id={tv_id} tvDetails={tvDetails} />
          ) : currentPage === "/services" ? (
            <TvServices tv_id={tv_id} tvDetails={tvDetails} />
          ) : currentPage === "/release" ? (
            <ReleaseInfo tv_id={tv_id} tvDetails={tvDetails} />
          ) : currentPage === "/production" ? (
            <Production tv_id={tv_id} tvDetails={tvDetails} />
          ) : currentPage === "/genres" ? (
            <Genres tv_id={tv_id} tvDetails={tvDetails} />
          ) : currentPage === "/external_link" ? (
            <ExternalLink tv_id={tv_id} tvDetails={tvDetails} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TvEditList;

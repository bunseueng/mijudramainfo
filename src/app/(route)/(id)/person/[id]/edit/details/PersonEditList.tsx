"use client";

import { personEditList } from "@/helper/item-list";
import { PersonDBType } from "@/helper/type";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { VscQuestion } from "react-icons/vsc";
import { useRouter, usePathname } from "next/navigation";
import PersonDetails from "./PersonDetails";
import PersonCover from "../cover/PersonCover";
import PersonCast from "../cast/PersonCast";
import PersonCrew from "../crew/PersonCrew";
import PersonExternalLink from "../external_link/PersonExternalLink";

export interface PersonEditList {
  person_id: string;
  personDB: PersonDBType | null;
}

const PersonEditList: React.FC<PersonEditList> = ({ person_id, personDB }) => {
  const [currentPage, setCurrentPage] = useState("/detail");

  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: string
  ) => {
    e.preventDefault();
    setCurrentPage(link);
    router.push(`/person/${person_id}/edit/${link}`);
  };

  useEffect(() => {
    if (pathname) {
      const pathArray = pathname.split("/");
      const newPage = `/${pathArray[pathArray.length - 1]}`;
      setCurrentPage(newPage);
    }
  }, [pathname]);

  return (
    <div className="w-full h-[100%] my-0">
      <div className="max-w-[1520px] relative h-auto mx-auto dark:bg-[#242526] shadow-sm rounded-b-md">
        <div className="relative float-left w-full md:w-[25%] py-3 px-4">
          <div className="bg-white dark:bg-[#3a3b3c] border-2 border-[#dcdfe6] dark:border-[#242527] rounded-sm px-4 py-2">
            <div className="flex items-center justify-between">
              <h1>Edit</h1>
              <VscQuestion />
            </div>
          </div>
          <ul className="pt-3">
            {personEditList?.map((item, idx) => (
              <li
                key={idx}
                className={`pb-2 ${
                  currentPage === item?.link
                    ? "text-[#1675b6]"
                    : "text-black dark:text-white"
                }`}
              >
                <Link
                  href={`/person/${person_id}/edit/${item?.link}`}
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
          {currentPage === "/details" ? (
            <PersonDetails person_id={person_id} personDB={personDB} />
          ) : currentPage === "/cover" ? (
            <PersonCover person_id={person_id} personDB={personDB} />
          ) : currentPage === "/cast" ? (
            <PersonCast person_id={person_id} personDB={personDB} />
          ) : currentPage === "/crew" ? (
            <PersonCrew person_id={person_id} personDB={personDB} />
          ) : currentPage === "/external_link" ? (
            <PersonExternalLink person_id={person_id} personDB={personDB} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PersonEditList;

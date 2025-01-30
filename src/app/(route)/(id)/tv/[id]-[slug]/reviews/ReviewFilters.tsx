import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import { reviewLanguage, reviewStatus } from "@/helper/item-list";
import Link from "next/link";
import { ITvReview } from "@/helper/type";

interface ReviewFiltersProps {
  tv_id: string;
  reviewType: string;
  languages: string | undefined;
  status: string;
  openDropdown: string | null;
  getReview: ITvReview[];
  handleDropdownToggle: (type: string) => void;
  setReviewType: (type: string) => void;
  setLanguages: (lang: string) => void;
  setStatus: (status: string) => void;
  selectBox: (key: string, value: string) => void;
}

const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  tv_id,
  reviewType,
  languages,
  status,
  openDropdown,
  getReview,
  handleDropdownToggle,
  setReviewType,
  setLanguages,
  setStatus,
  selectBox,
}) => {
  return (
    <div className="px-4 py-3">
      <div className="block">
        {/* Review Type Dropdown */}
        <div className="relative inline-block">
          <button
            type="button"
            name="most_helpful"
            className="relative text-xs md:text-sm bg-white dark:bg-[#3a3b3c] border border-[#dcdfe6] dark:border-[#3e4042] rounded px-5 py-3"
            onClick={() => handleDropdownToggle("review_type")}
          >
            {reviewType}
            <span className="inline-block align-middle">
              <IoIosArrowDown />
            </span>
          </button>
          {openDropdown === "review_type" && (
            <AnimatePresence>
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ height: "90px" }}
                className="w-full h-auto absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10"
              >
                {/* Most Helpful Option */}
                <li
                  className={`text-xs md:text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                    reviewType === "Most Helpful"
                      ? "text-[#409eff] font-bold bg-[#00000011] dark:bg-[#2a2b2c]"
                      : "text-black dark:text-white"
                  }`}
                  onClick={() => {
                    handleDropdownToggle("review_type");
                    setReviewType("Most Helpful");
                    selectBox("sortby", "most_helpful");
                  }}
                >
                  Most Helpful
                </li>
                {/* Most Recent Option */}
                <li
                  className={`text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                    reviewType === "Most Recent"
                      ? "text-[#409eff] font-bold bg-[#00000011] dark:bg-[#2a2b2c]"
                      : "text-black dark:text-white"
                  }`}
                  onClick={() => {
                    handleDropdownToggle("review_type");
                    setReviewType("Most Recent");
                    selectBox("sortby", "most_recent");
                  }}
                >
                  Most Recent
                </li>
              </motion.ul>
            </AnimatePresence>
          )}
        </div>

        {/* Language and Status Filters */}
        <div className="relative inline-block">
          <button
            type="button"
            name="most_helpful"
            className="relative text-xs md:text-sm px-5 py-3"
            onClick={() => handleDropdownToggle("language")}
          >
            All Languages
            <span className="inline-block align-middle">
              <IoIosArrowDown />
            </span>
          </button>
          {openDropdown === "language" && (
            <AnimatePresence>
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ width: "400px", height: "auto" }}
                className="w-full h-auto absolute bg-white dark:bg-[#242424] border-[1px] border-[#dcdfe6] dark:border-[#242424] py-1 mt-2 rounded-md z-10"
              >
                {/* Language Section */}
                <li className="w-[50%] relative float-left flex flex-col">
                  <label htmlFor="language" className="font-semibold px-5 py-3">
                    Languages
                  </label>
                  <div className="px-5 py-1">
                    <label
                      className={`mr-4 text-sm hover:text-[#409eff] transform duration-300 cursor-pointer ${
                        "all_language" === languages
                          ? "text-[#409eff] font-bold"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="languages"
                        className="align-middle transform duration-300 cursor-pointer mr-1 px-2 mb-1"
                        checked={"all_language" as any}
                        onClick={() => {
                          setLanguages("");
                          selectBox("xlang", "all_language");
                        }}
                      />
                      <span className="px-1">All Languages</span>
                    </label>
                  </div>
                  {/* Language Options */}
                  {reviewLanguage
                    ?.filter((langDB) =>
                      getReview?.some((item) =>
                        item?.review_language
                          ?.split(",")
                          .map((lang) => lang.trim().toLowerCase())
                          .includes(langDB?.value.trim().toLowerCase())
                      )
                    )
                    ?.map((lang, idx) => (
                      <div key={idx} className="px-5 py-1">
                        <label
                          className={`mr-4 text-sm hover:text-[#409eff] transform duration-300 cursor-pointer ${
                            languages === lang?.value
                              ? "text-[#409eff] font-bold"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="languages"
                            className="align-middle transform duration-300 cursor-pointer mr-1 px-2 mb-1"
                            checked={lang?.value === languages}
                            onClick={() => {
                              setLanguages(lang?.value);
                              selectBox("xlang", lang?.value);
                            }}
                            defaultValue="en"
                          />
                          <span className="px-1">
                            {lang?.label} (
                            {
                              getReview?.filter((review) =>
                                review?.review_language?.includes(lang?.value)
                              )?.length
                            }
                            )
                          </span>
                        </label>
                      </div>
                    ))}
                </li>

                {/* Status Section */}
                <li className="w-[50%] relative float-left flex flex-col">
                  <label htmlFor="status" className="font-semibold px-5 py-3">
                    Filter by Status
                  </label>
                  {reviewStatus?.map((stat, idx) => (
                    <div key={idx} className="px-5 py-1">
                      <label
                        className={`mr-4 text-sm hover:text-[#409eff] transform duration-300 cursor-pointer ${
                          status === stat?.value
                            ? "text-[#409eff] font-bold"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          className="align-middle transform duration-300 cursor-pointer mr-1 px-2 mb-1"
                          checked={stat?.value === status}
                          onClick={() => {
                            setStatus(stat?.value);
                            selectBox("status", stat?.value);
                          }}
                        />
                        <span className="px-1">{stat?.label}</span>
                      </label>
                    </div>
                  ))}
                </li>
              </motion.ul>
            </AnimatePresence>
          )}
        </div>

        {/* Write Review Button */}
        <Link
          prefetch={false}
          href={`/tv/${tv_id}/write_reviews`}
          className="text-xs md:text-base float-none relative inline-block md:float-right text-white bg-[#409eff] border border-[#409eff] rounded-md px-4 py-2 mt-5 md:mt-0"
        >
          Write Review
        </Link>
      </div>
    </div>
  );
};

export default ReviewFilters;

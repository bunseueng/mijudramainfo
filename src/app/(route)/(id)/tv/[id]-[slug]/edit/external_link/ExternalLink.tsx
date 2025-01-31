"use client";

import { external_link } from "@/helper/item-list";
import { Drama, ExternalLinkType, tvId } from "@/helper/type";
import { TExternalLink, externalLink } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaShare } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { GrPowerReset } from "react-icons/gr";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { isValidUrl, sanitizeUrl } from "@/lib/isValidUrl";

const ExternalEditModal = dynamic(
  () => import("@/app/component/ui/Modal/ExternalEditModal"),
  { ssr: false }
);

const ExternalLink: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const [storedData, setStoredData] = useState<ExternalLinkType[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedExternal, setSelectedExternal] = useState<string>("");
  const [openExternal, setOpenExternal] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [database, setDatabase] = useState<ExternalLinkType[]>([]);
  const [editingIndexes, setEditingIndexes] = useState<boolean[]>(
    Array(tvDetails?.external_links?.length || 0).fill(false)
  );
  const [markedForDeletion, setMarkedForDeletion] = useState<boolean[]>(
    Array(tvDetails?.external_links?.length || 0).fill(false)
  );
  const [isItemDataChanged, setIsItemDataChanged] = useState<boolean[]>(
    Array(tvDetails?.external_links?.length || 0).fill(false)
  );
  const [initialValues, setInitialValues] = useState(
    tvDetails?.external_links || []
  );
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
    reset,
  } = useForm<TExternalLink>({
    resolver: zodResolver(externalLink),
  });

  useEffect(() => {
    setDatabase([...(tvDetails?.external_links || []), ...storedData] as any);
  }, [storedData, tvDetails?.external_links]);

  const scrollIntoViewIfNeeded = (element: any) => {
    const rect = element?.getBoundingClientRect();
    const isVisible =
      rect?.top >= 0 &&
      rect?.left >= 0 &&
      rect?.bottom <=
        (window?.innerHeight || document?.documentElement?.clientHeight) &&
      rect?.right <=
        (window?.innerWidth || document?.documentElement.clientWidth);

    if (!isVisible) {
      element?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  };

  const handleDropdownToggle = (dropdown: string) => {
    setOpenDropdown((prev) => (prev === `${dropdown}` ? null : `${dropdown}`));
  };

  const toggleEdit = (index: number) => {
    setEditingIndexes((prev) =>
      prev.map((isEditing, idx) => (idx === index ? !isEditing : isEditing))
    );
  };

  const setExternals = (role: string) => {
    setSelectedExternal(role);
  };

  const addingItem = async (data: TExternalLink) => {
    if (selectedExternal === "Website") {
      const isValid = await trigger(["url"]);
      if (!isValid) return;
    }
    try {
      const item = {
        title: selectedExternal,
        id: data.id,
        url: data?.url,
        link_url:
          external_link.find((item) => item.label === selectedExternal)
            ?.link_url || "",
        link_text: data.link_text,
        additional_text: data.additional_text,
      };

      // Update both storedData and database states
      setStoredData((prevStoredData) => {
        const newStoredData = [...prevStoredData, item] as ExternalLinkType[];
        setDatabase([
          ...(tvDetails?.external_links || []),
          ...newStoredData,
        ] as any);
        return newStoredData;
      });

      // Reset form and close dropdown
      setSelectedExternal("");
      setOpenExternal(false);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const removingStored = (title: string) => {
    setStoredData((prev) => {
      const newStoredData = prev.filter((item) => item.title !== title);
      setDatabase([
        ...(tvDetails?.external_links || []),
        ...newStoredData,
      ] as any);
      return newStoredData;
    });
  };

  const markForDeletion = (
    e: React.MouseEvent<HTMLButtonElement>,
    idx: number
  ) => {
    e.preventDefault();
    const newMarkedForDeletion = [...markedForDeletion];
    newMarkedForDeletion[idx] = true;
    setMarkedForDeletion(newMarkedForDeletion);
    setOpenExternal(false);
  };

  const handleAdding = (label: string) => {
    if (
      !database
        ?.filter((item) => item?.title !== "Website")
        ?.find((data) => data?.title === label)
    ) {
      handleDropdownToggle("external");
      setExternals(label);
    } else {
      console.log("Item already in the database.");
    }
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const requestData = {
        tv_id: tv_id.toString(),
        external_links: markedForDeletion.includes(true)
          ? tvDetails?.external_links?.filter(
              (_, idx) => !markedForDeletion[idx]
            )
          : database?.map((item) => ({ ...item })),
      };

      const res = await fetch(`/api/tv/${tv_id}/external_links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (res.status === 200) {
        // Update local state with the new data
        const updatedData = await res.json();
        setDatabase(updatedData.external_links || []);
        setInitialValues(updatedData.external_links || []);
        setStoredData([]);
        setMarkedForDeletion(
          Array(updatedData.external_links?.length || 0).fill(false)
        );
        setIsItemDataChanged(
          Array(updatedData.external_links?.length || 0).fill(false)
        );

        router.refresh();
        toast.success("Success");
      } else if (res.status === 400) {
        toast.error("Invalid User");
      }
    } catch (error: any) {
      console.error("Error:", error);
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetItem = (idx: number) => {
    setDatabase((prev) => {
      const updatedDatabase = [...prev];
      updatedDatabase[idx] = initialValues[idx] as ExternalLinkType | any;
      return updatedDatabase;
    });
    setEditingIndexes((prev) =>
      prev.map((edit, index) => (index === idx ? false : edit))
    );
    setMarkedForDeletion((prev) =>
      prev.map((marked, index) => (index === idx ? false : marked))
    );
    setIsItemDataChanged((prev) =>
      prev.map((changed, index) => (index === idx ? false : changed))
    );
  };

  return (
    <form className="py-3 px-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">
        External Links
      </h1>
      <div className="text-left mb-4 ml-3">
        {database?.map((item, idx: number) => {
          return (
            <div
              className="relative mb-4 bg-[#fff] dark:bg-[#242526] border-[1px] border-[#c0c4cc] dark:border-[#00000024] rounded-md"
              key={idx}
            >
              <div className="relative font-semibold py-2 px-4">
                {item?.title}
              </div>
              <div className="absolute top-2 right-4">
                <button
                  type="button"
                  className="bg-[#fff] dark:bg-[#3a3b3c] border-[1px] border-[#c0c4cc] dark:border-[#3e4042] rounded-md px-1 py-0.5 mr-3 shadow-sm"
                  onClick={(e) => {
                    storedData?.length > 0
                      ? removingStored(item?.title)
                      : markForDeletion(e, idx);
                  }}
                >
                  <MdDelete />
                </button>
                {(markedForDeletion[idx] || isItemDataChanged[idx]) && (
                  <button
                    type="button"
                    className="bg-[#fff] dark:bg-[#3a3b3c] border-[1px] border-[#c0c4cc] dark:border-[#3e4042] rounded-md px-1 py-0.5 mr-3 shadow-sm"
                    onClick={() => handleResetItem(idx)}
                  >
                    <GrPowerReset />
                  </button>
                )}

                <button
                  className="bg-[#fff] dark:bg-[#3a3b3c] border-[1px] border-[#c0c4cc] dark:border-[#3e4042] rounded-md px-1 py-0.5 shadow-sm"
                  type="button"
                  onClick={() => {
                    toggleEdit(idx);
                    setEditingIndex(idx);
                  }}
                >
                  <MdEdit />
                </button>
              </div>
              <div className="relative font-semibold py-2 px-4">
                {editingIndexes[idx] && (
                  <ExternalEditModal
                    item={item}
                    database={database}
                    setDatabase={setDatabase}
                    toggleEdit={toggleEdit}
                    setEditingIndex={setEditingIndex}
                    editingIndex={editingIndex}
                    isItemDataChanged={isItemDataChanged}
                    setIsItemDataChanged={setIsItemDataChanged}
                    selectedExternal={selectedExternal}
                    setEditingIndexes={setEditingIndexes}
                    idx={idx}
                  />
                )}
                {!editingIndexes[idx] && (
                  <div className="-mx-3">
                    {selectedExternal === "Website" ? (
                      <div
                        className={`relative flex items-center w-full px-3 ${
                          storedData.find(
                            (data) => data.title === item.title
                          ) && "text-green-400"
                        } ${
                          markedForDeletion[idx] && "text-red-400 line-through"
                        } ${isItemDataChanged[idx] && "text-blue-300"}`}
                      >
                        <span className="pr-1">
                          {item?.link_text || item?.id}
                        </span>
                        <a
                          href={sanitizeUrl(item?.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            if (!item?.url || !isValidUrl(item?.url)) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <FaShare />
                        </a>
                        <span className="pl-1">{item?.additional_text}</span>
                      </div>
                    ) : (
                      <div
                        className={`relative flex items-center w-full px-3 ${
                          storedData.find(
                            (data) => data.title === item.title
                          ) && "text-green-400"
                        } ${
                          markedForDeletion[idx] && "text-red-400 line-through"
                        } ${isItemDataChanged[idx] && "text-blue-300"}`}
                      >
                        <span className="pr-1">
                          {item?.id || item?.link_text}
                        </span>
                        <a
                          href={
                            isValidUrl(`${item?.link_url}${item?.id}`)
                              ? `${item?.link_url}${item?.id}`
                              : "#"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaShare />
                        </a>
                        <span className="pl-1">
                          {item?.additional_text !== "" &&
                            item?.additional_text}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {openExternal && (
          <div className="relative bg-[#fff] dark:bg-[#242526] border-[1px] border-[#c0c4cc] dark:border-[#00000024]  shadow-sm rounded-md mb-3">
            <div className="relative px-4 py-2">New External Link</div>
            <div className="px-4 py-2">
              <div className="mb-5">
                <div className="relative">
                  <div className="relative mt-2">
                    <input
                      type="text"
                      name="job"
                      readOnly
                      autoComplete="off"
                      className="w-full md:w-[33%] placeholder:text-black dark:placeholder:text-white bg-[#fff] dark:bg-[#3a3b3c] detail_placeholder border-[1px] border-[#c0c4cc] dark:border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-1.5 px-3 mt-1 cursor-pointer"
                      placeholder={
                        selectedExternal || "Select an external link"
                      }
                      onClick={() => handleDropdownToggle("external")}
                    />
                    <IoIosArrowDown className="absolute bottom-3 left-52" />
                  </div>
                  {openDropdown === `external` && (
                    <AnimatePresence>
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`w-full md:w-[30%] h-[250px] absolute bg-[#fff] dark:bg-[#242424] border-[1px] border-[#edeff0] dark:border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll `}
                      >
                        {external_link?.map((items, index) => {
                          const isContentRating =
                            selectedExternal === items?.label;
                          const isInDatabase = database
                            ?.filter((item) => item?.title !== "Website")
                            ?.find((data) => data?.title === items?.label);
                          return (
                            <li
                              ref={(el) => {
                                if (isContentRating) scrollIntoViewIfNeeded(el);
                              }}
                              className={`text-sm hover:bg-[#00000011] dark:hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 ${
                                isContentRating
                                  ? "text-[#409eff] bg-[#fff] dark:bg-[#2a2b2c]"
                                  : ""
                              } ${
                                isInDatabase
                                  ? "text-[#818a91] opacity-50 cursor-not-allowed"
                                  : "cursor-pointer"
                              } `}
                              onClick={() =>
                                !isInDatabase && handleAdding(items.label)
                              }
                              key={index}
                            >
                              {items?.label}
                            </li>
                          );
                        })}
                      </motion.ul>
                    </AnimatePresence>
                  )}
                </div>
              </div>

              {selectedExternal && (
                <div className="mb-5">
                  {selectedExternal === "Website" ? (
                    <div className="flex items-center">
                      <div className="relative inline-block w-full">
                        <label htmlFor="url">
                          <span>*</span> URL
                        </label>
                        <input
                          {...register("url")}
                          type="text"
                          className={`h-10 leading-[40px] placeholder:text-sm bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] text-[#ffffffcc] rounded-md px-4 outline-none focus:border-[#1675b6] ${
                            errors?.url && "border-red-400 focus:border-red-400"
                          }`}
                          placeholder="Website URL/Link"
                        />
                        {errors?.url && (
                          <p className="text-[12px] text-red-500 pt-1">
                            {external_link?.find(
                              (item) => item?.label === selectedExternal
                            )?.error || ""}{" "}
                            {errors.url.message}
                          </p>
                        )}
                      </div>
                      <div className="relative inline-block w-full">
                        <label htmlFor="link_text">Link Text</label>
                        <input
                          {...register("link_text")}
                          type="text"
                          className="h-10 leading-[40px] placeholder:text-sm bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] text-[#ffffffcc] rounded-md outline-none focus:border-[#1675b6] px-4"
                          placeholder="Link Text/Anchor Text"
                        />
                      </div>
                      <div className="relative inline-block w-full">
                        <label htmlFor="additional_text">Additional Text</label>
                        <input
                          {...register("additional_text")}
                          type="text"
                          className="h-10 leading-[40px] placeholder:text-sm bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] text-[#ffffffcc] rounded-md outline-none focus:border-[#1675b6] px-4"
                          placeholder="Additional Text"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative inline-block w-full">
                      <input
                        {...register("id")}
                        type="text"
                        className="h-10 leading-[40px] text-black bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] text-[#ffffffcc] rounded-md outline-none focus:border-[#1675b6] px-4"
                        placeholder={
                          external_link.find(
                            (item) => item.label === selectedExternal
                          )?.placeholder || ""
                        }
                      />
                    </div>
                  )}
                  <small className="text-muted-foreground opacity-60">
                    {external_link?.find(
                      (item) => item?.label === selectedExternal
                    )?.eg || ""}
                  </small>
                  {errors?.id && (
                    <p className="text-[12px] text-red-500 pt-1">
                      {
                        external_link
                          ?.filter((item: any) => item?.label !== "Website")
                          ?.find((item) => item?.label === selectedExternal)
                          ?.error
                      }{" "}
                      {selectedExternal !== "Website" && errors.id.message}
                    </p>
                  )}
                </div>
              )}
              <button
                name="Cancel"
                type="button"
                className="text-sm bg-[#fff] dark:bg-[#3a3b3c] border-[1px] border-[#c0c4cc] dark:border-[#3e4042] rounded-md px-5 py-2"
                onClick={() => setOpenExternal(!openExternal)}
              >
                Cancel
              </button>
              <button
                name="Add"
                type="button"
                className="text-sm text-white bg-[#409effd9] border-[1px] border-[#409effcc] rounded-md px-5 py-2 ml-3"
                onClick={() => addingItem(getValues())}
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
      {(tvDetails?.external_links?.length || 0) > 0 ||
        (!openExternal && (
          <button
            type="button"
            className="text-sm bg-[#fff] dark:bg-[#3a3b3c] border-[1px] border-[#c0c4cc] dark:border-[#3e4042] rounded-md px-5 py-2 mb-4 ml-3"
            onClick={() => setOpenExternal(!openExternal)}
            name="Add External Link"
          >
            Add External Link
          </button>
        ))}
      {(tvDetails?.external_links?.length || 0) > 0 && (
        <button
          type="button"
          className="text-sm bg-[#fff] dark:bg-[#3a3b3c] border-[1px] border-[#c0c4cc] dark:border-[#3e4042] rounded-md px-5 py-2 mb-4 ml-3"
          onClick={() => setOpenExternal(!openExternal)}
          name="Add External Link"
        >
          Add External Link
        </button>
      )}
      <div className="border-t-2 border-t-[#78828c21] pt-5 mx-3">
        <button
          name="Submit"
          type="submit"
          className={`flex items-center text-white bg-[#5cb85c] border-[1px] border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
            storedData?.length > 0 ||
            markedForDeletion?.includes(true) ||
            isItemDataChanged?.includes(true) ||
            loading
              ? "cursor-pointer"
              : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
          }`}
          disabled={
            !(
              storedData?.length > 0 ||
              markedForDeletion?.includes(true) ||
              isItemDataChanged?.includes(true)
            ) || loading
          }
        >
          {loading ? <Loader2 className="h-6 w-4 animate-spin" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default ExternalLink;

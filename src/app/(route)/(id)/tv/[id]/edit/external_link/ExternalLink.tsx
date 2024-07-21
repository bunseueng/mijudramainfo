"use client";

import ExternalEditModal from "@/app/component/ui/Modal/ExternalEditModal";
import { external_link } from "@/helper/item-list";
import { Drama, ExternalLinkType, tvId } from "@/helper/type";
import { TExternalLink, externalLink } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { JsonValue } from "@prisma/client/runtime/library";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaShare } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

const ExternalLink: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const [storedData, setStoredData] = useState<ExternalLinkType[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedExternal, setSelectedExternal] = useState<string>("");
  const [openExternal, setOpenExternal] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [database, setDatabase] = useState<ExternalLinkType[]>([]);
  const [editingIndexes, setEditingIndexes] = useState<boolean[]>(
    Array(tvDetails?.external_links?.length || 0).fill(false)
  );
  const [markedForDeletion, setMarkedForDeletion] = useState<boolean[]>(
    Array(tvDetails?.external_links?.length || 0).fill(false)
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
    setDatabase([...(tvDetails?.external_links || ([] as any)), ...storedData]);
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
      setStoredData((prevStoredData) => [...prevStoredData, item] as any);
    } catch (error) {
      console.log(error);
    }
  };

  const removingStored = (title: string) => {
    setStoredData((prev) => prev.filter((item) => item.title !== title));
  };

  const markForDeletion = (
    e: React.MouseEvent<HTMLButtonElement>,
    idx: number
  ) => {
    e.preventDefault();
    const newMarkedForDeletion = [...markedForDeletion];
    newMarkedForDeletion[idx] = true; // Toggle the deletion status
    setMarkedForDeletion(newMarkedForDeletion);
    setOpenExternal(false);
  };

  const handleAdding = (label: string) => {
    // Check if the item is not in the database
    if (!database?.find((data) => data?.title === label)) {
      // Call setExternals and handleDropdownToggle if item is not in database
      handleDropdownToggle("external");
      setExternals(label);
    } else {
      // Optionally handle the case where the item is already in the database
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

  const toggleEdit = (index: number) => {
    setEditingIndexes((prev) =>
      prev.map((isEditing, idx) => (idx === index ? !isEditing : isEditing))
    );
  };

  useEffect(() => {
    if (storedData) {
      setExternals("");
      setOpenExternal(false);
      reset();
    }
  }, [storedData, reset]);

  return (
    <form className="py-3 px-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">
        External Links
      </h1>
      <div className="text-left mb-4 ml-3">
        {database?.map((item, idx: number) => {
          return (
            <div
              className="relative mb-4 bg-[#242526] border-2 border-[#00000024] "
              key={idx}
            >
              <div className="relative font-semibold py-2 px-4">
                {item?.title}
              </div>
              <div className="absolute top-2 right-4">
                <button
                  type="button"
                  className="bg-[#3a3b3c] border-2 border-[#3e4042] rounded-md px-1 py-0.5 mr-3 shadow-md"
                  onClick={(e) => {
                    storedData?.length > 0
                      ? removingStored(item?.title)
                      : markForDeletion(e, idx);
                  }}
                >
                  <MdDelete />
                </button>
                <button
                  className="bg-[#3a3b3c] border-2 border-[#3e4042] rounded-md px-1 py-0.5 shadow-md"
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
                    toggleEdit={toggleEdit}
                    setEditingIndex={setEditingIndex}
                    idx={idx}
                  />
                )}
                {!editingIndexes[idx] && (
                  <div className="-mx-3">
                    {selectedExternal === "Website" ? (
                      <div
                        className={`relative flex items-center w-full px-3 ${
                          storedData[idx - 2] && "text-green-400"
                        } ${
                          markedForDeletion[idx] && "text-red-400 line-through"
                        }`}
                      >
                        <span className="pr-1">{item?.link_text}</span>
                        <a
                          href={item?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaShare />
                        </a>
                        <span className="pl-1">{item?.additional_text}</span>
                      </div>
                    ) : (
                      <div
                        className={`relative flex items-center w-full px-3 ${
                          storedData[idx - 2] && "text-green-400"
                        } ${
                          markedForDeletion[idx] && "text-red-400 line-through"
                        }`}
                      >
                        <span className="pr-1">{item?.id}</span>
                        <a
                          href={`${item?.link_url}${item?.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaShare />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {openExternal && (
          <div className="relative bg-[#242526] border-2 border-[#0000001a] shadow-md rounded-md mb-3">
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
                      className="w-full bg-[#3a3b3c] detail_placeholder border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-1.5 px-3 mt-1 cursor-pointer"
                      placeholder={
                        selectedExternal || "Select an external link"
                      } // Update this line
                      onClick={() => handleDropdownToggle("external")}
                    />
                    <IoIosArrowDown className="absolute bottom-3 right-2" />
                  </div>
                  {openDropdown === `external` && (
                    <AnimatePresence>
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`w-full h-[250px] absolute bg-[#242424] border-2 border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll`}
                      >
                        {external_link?.map((items, index) => {
                          const isContentRating =
                            selectedExternal === items?.label;
                          const isInDatabase = database?.find(
                            (data) => data?.title === items?.label
                          );

                          return (
                            <li
                              ref={(el) => {
                                if (isContentRating) scrollIntoViewIfNeeded(el);
                              }}
                              className={`text-sm hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 ${
                                isContentRating
                                  ? "text-[#409eff] bg-[#2a2b2c]"
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
                          className={`h-10 leading-[40px] bg-[#3a3b3c] border-2 border-[#46494a] text-[#ffffffcc] rounded-md px-4 outline-none focus:border-[#1675b6] ${
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
                          className="h-10 leading-[40px] bg-[#3a3b3c] border-2 border-[#46494a] text-[#ffffffcc] rounded-md outline-none focus:border-[#1675b6] px-4"
                          placeholder="Link Text/Anchor Text"
                        />
                      </div>
                      <div className="relative inline-block w-full">
                        <label htmlFor="additional_text">Additional Text</label>
                        <input
                          {...register("additional_text")}
                          type="text"
                          className="h-10 leading-[40px] bg-[#3a3b3c] border-2 border-[#46494a] text-[#ffffffcc] rounded-md outline-none focus:border-[#1675b6] px-4"
                          placeholder="Additional Text"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative inline-block w-full">
                      <input
                        {...register("id")}
                        type="text"
                        className="h-10 leading-[40px] bg-[#3a3b3c] border-2 border-[#46494a] text-[#ffffffcc] rounded-md outline-none focus:border-[#1675b6] px-4"
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
                type="button"
                className="text-sm bg-[#3a3b3c] border-2 border-[#3e4042] rounded-md px-5 py-2"
                onClick={() => setOpenExternal(!openExternal)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="text-sm bg-[#409effd9] border-2 border-[#409effcc] rounded-md px-5 py-2 ml-3"
                onClick={() => addingItem(getValues())}
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
      {tvDetails?.external_links?.length !== 0 ||
        (!openExternal && (
          <button
            type="button"
            className="text-sm bg-[#3a3b3c] border-2 border-[#3e4042] rounded-md px-5 py-2 mb-4 ml-3"
            onClick={() => setOpenExternal(!openExternal)}
          >
            Add External Link
          </button>
        ))}{" "}
      {(tvDetails?.external_links?.length || 0) > 0 && (
        <button
          type="button"
          className="text-sm bg-[#3a3b3c] border-2 border-[#3e4042] rounded-md px-5 py-2 mb-4 ml-3"
          onClick={() => setOpenExternal(!openExternal)}
        >
          Add External Link
        </button>
      )}
      <div className="border-t-2 border-t-[#78828c21] pt-5 mx-3">
        <button
          type="submit"
          className={`flex items-center bg-[#5cb85c] border-2 border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
            storedData?.length > 0 || markedForDeletion?.includes(true)
              ? "cursor-pointer"
              : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
          }`}
          disabled={
            storedData?.length > 0 || markedForDeletion?.includes(true)
              ? false
              : true
          }
        >
          <span className="mr-1 pt-1">
            <ClipLoader color="#242526" loading={loading} size={19} />
          </span>
          Submit
        </button>
      </div>
    </form>
  );
};

export default ExternalLink;

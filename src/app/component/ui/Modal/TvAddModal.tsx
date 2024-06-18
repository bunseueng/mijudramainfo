"use client";

import { serviceLogo, serviceType, tvSubtitle } from "@/helper/item-list";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import countryList from "react-select-country-list";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDetails, TCreateDetails } from "@/helper/zod";
import { useForm } from "react-hook-form";
import { customStyles } from "@/helper/MuiStyling";
import { Drama, EditDramaPage } from "@/helper/type";
import { JsonValue } from "@prisma/client/runtime/library";

interface EditModal {
  tv?: JsonValue | [];
  idx: number;
  setOpen: (open: boolean) => void;
  open: boolean;
  setDeleteIndex: (ind: number) => void;
  drama: EditDramaPage[];
  setStoredData: (data: EditDramaPage[]) => void;
  storedData: EditDramaPage[];
}

const TvAddModal: React.FC<EditModal> = ({
  tv,
  idx,
  setOpen,
  open,
  drama,
  setStoredData,
  storedData,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [service, setService] = useState<
    {
      logoPath: string;
      label: string;
      logo: string;
    }[]
  >([]);

  const [servicesType, setServicesType] = useState<string[]>([]);
  const [subtitle, setSubtitle] = useState<{ label: string; value: string }[]>(
    []
  );
  const [countries, setCountries] = useState<
    { label: string; value: string }[]
  >([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<TCreateDetails>({
    resolver: zodResolver(createDetails),
  });
  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (value: any) => {
    setCountries(value);
  };
  console.log(tv);
  const subtitleChangeHandler = (value: any) => {
    setSubtitle(value);
  };

  const handleDropdownToggle = (dropdown: string, idx: number) => {
    setOpenDropdown((prev) =>
      prev === `${dropdown}-${idx}` ? null : `${dropdown}-${idx}`
    );
  };

  useEffect(() => {
    if (storedData && storedData[idx]) {
      const data = storedData[idx];
      setService([
        { label: data.service_name, logoPath: data.service, logo: data?.logo },
      ]);
      setServicesType([data.service_type]);
      setCountries(data.availability);
      setSubtitle(data.subtitles);
      setValue("services.link", data.link);
      setValue("services.service", data.service_name);
      setValue("services.service_type", data.service_type);
      reset(data as unknown as Drama);
    }
  }, [idx, open, reset, storedData, setValue]);

  const setServices = (
    idx: number,
    serviceLogo: { label: string; logoPath: string; logo: string }
  ) => {
    setService((prev) => {
      const newServices = [...prev];
      newServices[idx] = serviceLogo;
      return newServices;
    });
  };
  const setServiceType = (idx: number, role: string) => {
    setServicesType((prev) => {
      const newRoles = [...prev];
      newRoles[idx] = role;
      return newRoles;
    });
  };

  const addingItem = async (data: TCreateDetails) => {
    try {
      if (drama.length > 0) {
        const newItem: EditDramaPage = {
          id: storedData[idx]?.id || "", // Use the existing id or provide a default
          public_id: storedData[idx]?.public_id || "", // Use the existing public_id or provide a default
          service: service[idx]?.logoPath || "", // Ensure logoPath is defined
          service_logo: service[idx]?.logo || "", // Ensure logo is defined
          service_name: service[idx]?.label || "", // Ensure label is defined
          link: data?.services?.link || "", // Ensure link is defined
          service_type: servicesType[idx] || "", // Ensure serviceType is defined
          availability: countries, // Use the selected countries
          subtitles: subtitle, // Use the selected subtitles
          service_url: storedData[idx]?.service_url || "", // Use the existing service_url or provide a default
          logo: storedData[idx]?.logo || "", // Use the existing logo or provide a default
          order: storedData[idx]?.order || 0,
        };

        const updatedItems = [...storedData]; // Copy existing items
        updatedItems[idx] = newItem; // Replace the item at the specified index with the new item
        setStoredData(updatedItems);
        setOpen(false);
      } else {
        const newItem = {
          tv,
          id: storedData[idx]?.id || "", // Use the existing id or provide a default
          public_id: storedData[idx]?.public_id || "", // Use the existing public_id or provide a default
          service: service[idx]?.logoPath || "", // Ensure logoPath is defined
          service_logo: service[idx]?.logo || "", // Ensure logo is defined
          service_name: service[idx]?.label || "", // Ensure label is defined
          link: data?.services?.link || "", // Ensure link is defined
          service_type: servicesType[idx] || "", // Ensure serviceType is defined
          availability: countries, // Use the selected countries
          subtitles: subtitle, // Use the selected subtitles
          service_url: storedData[idx]?.service_url || "", // Use the existing service_url or provide a default
          logo: storedData[idx]?.logo || "", // Use the existing logo or provide a default
          order: storedData[idx]?.order || 0,
        };

        const updatedItems = [...storedData]; // Copy existing items
        updatedItems[idx] = newItem; // Replace the item at the specified index with the new item
        setStoredData(updatedItems);
        setOpen(false);
      }
    } catch (error: any) {
      console.log("Bad Request");
      throw new Error(error);
    }
  };

  return (
    <div className="relative z-10">
      <div className="fixed inset-0 z-10 w-screen bg-black bg-opacity-10">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative w-[550px] transform rounded-lg bg-white text-left  transition-all my-2">
            <div className="bg-white dark:bg-[#242526] px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded-md">
              <div className="sm:flex sm:items-center justify-between">
                <div className="flex items-center justify-between">
                  <h1>Add Item</h1>
                </div>
                <button onClick={() => setOpen(false)}>
                  <IoClose />
                </button>
              </div>
              <div className="text-[#ffffff99] text-md break-words px-5 py-7">
                <form action="">
                  <div className="mb-5">
                    <label
                      htmlFor="service"
                      className="w-[150px] inline-block text-right float-left align-middle leading-[44px] pr-3"
                    >
                      <span className="text-red-500 pr-1">*</span>Service
                    </label>
                    <div className="relative ml-[150px]">
                      <div className="relative">
                        <input
                          {...register("services.service")}
                          type="text"
                          name="services.service"
                          readOnly
                          autoComplete="off"
                          className="w-full bg-[#3a3b3c] detail_placeholder border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-1 cursor-pointer"
                          placeholder={
                            service[idx]?.label
                              ? service[idx]?.label
                              : "Select a service provider"
                          }
                          onClick={() => handleDropdownToggle("service", idx)}
                        />

                        <IoIosArrowDown className="absolute bottom-3 right-2" />
                      </div>
                      {/* {errors.services?.service && (
                        <p className="text-xs italic text-red-500 mt-2">
                          {errors.services?.service.message}
                        </p>
                      )} */}
                      {openDropdown === `service-${idx}` && (
                        <ul
                          className={`w-full h-[250px] absolute bg-[#242424] border-2 border-[#242424] py-1 mt-2 rounded-md z-10 custom-scroll`}
                        >
                          {serviceLogo?.map((items, index) => {
                            const scrollIntoViewIfNeeded = (element: any) => {
                              const rect = element?.getBoundingClientRect();
                              const isVisible =
                                rect?.top >= 0 &&
                                rect?.left >= 0 &&
                                rect?.bottom <=
                                  (window?.innerHeight ||
                                    document?.documentElement?.clientHeight) &&
                                rect?.right <=
                                  (window?.innerWidth ||
                                    document?.documentElement.clientWidth);

                              if (!isVisible) {
                                element?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "nearest",
                                  inline: "nearest",
                                });
                              }
                            };
                            const isContentRating =
                              service[idx]?.label === items?.label;
                            return (
                              <li
                                ref={(el) => {
                                  if (isContentRating && el) {
                                    scrollIntoViewIfNeeded(el);
                                  }
                                }}
                                className={`text-sm hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                                  isContentRating
                                    ? "text-[#409eff] bg-[#2a2b2c]"
                                    : ""
                                } `}
                                onClick={() => {
                                  handleDropdownToggle("service", idx);
                                  setServices(idx, {
                                    label: items?.label,
                                    logoPath: items?.logoPath,
                                    logo: items?.logo,
                                  }); // Update the story for this item
                                }}
                                key={index}
                              >
                                <div className="flex items-center">
                                  <Image
                                    src={`/channel${items?.logo}`}
                                    alt={items?.label}
                                    width={200}
                                    height={200}
                                    className="w-10 h-10 bg-center bg-cover object-cover rounded-full"
                                  />
                                  <span className="font-semibold pl-2">
                                    {items?.label}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="service_type"
                      className="w-[150px] inline-block text-right float-left align-middle leading-[44px] pr-3"
                    >
                      <span className="text-red-500 pr-1">*</span>Service Type
                    </label>
                    <div className="relative ml-[150px]">
                      <div className="relative">
                        <input
                          {...register("services.service_type")}
                          type="text"
                          name="services.service_type"
                          readOnly
                          autoComplete="off"
                          className="w-full bg-[#3a3b3c] detail_placeholder border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-1 cursor-pointer"
                          placeholder={
                            servicesType[idx]
                              ? servicesType[idx]
                              : "Select a service provider"
                          }
                          onClick={() =>
                            handleDropdownToggle("service_type", idx)
                          }
                        />

                        <IoIosArrowDown className="absolute bottom-3 right-2" />
                      </div>
                      {/* {errors.services?.service_type && (
                        <p className="text-xs italic text-red-500 mt-2">
                          {errors.services?.service_type.message}
                        </p>
                      )} */}
                      {openDropdown === `service_type-${idx}` && (
                        <ul
                          className={`w-full h-[250px] absolute bg-[#242424] border-2 border-[#242424] py-1 mt-2 rounded-md z-10`}
                          style={{ height: "160px" }}
                        >
                          {serviceType?.map((items, index) => {
                            const scrollIntoViewIfNeeded = (element: any) => {
                              const rect = element?.getBoundingClientRect();
                              const isVisible =
                                rect?.top >= 0 &&
                                rect?.left >= 0 &&
                                rect?.bottom <=
                                  (window?.innerHeight ||
                                    document?.documentElement?.clientHeight) &&
                                rect?.right <=
                                  (window?.innerWidth ||
                                    document?.documentElement.clientWidth);

                              if (!isVisible) {
                                element?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "nearest",
                                  inline: "nearest",
                                });
                              }
                            };
                            const isContentRating =
                              servicesType[idx] === items?.value;
                            return (
                              <li
                                ref={(el) => {
                                  if (isContentRating && el) {
                                    scrollIntoViewIfNeeded(el);
                                  }
                                }}
                                className={`text-sm hover:bg-[#2a2b2c] hover:bg-opacity-85 transform duration-300 px-5 py-2 cursor-pointer ${
                                  isContentRating
                                    ? "text-[#409eff] bg-[#2a2b2c]"
                                    : ""
                                } `}
                                onClick={() => {
                                  handleDropdownToggle("service_type", idx);
                                  setServiceType(idx, items?.value); // Update the story for this item
                                }}
                                key={index}
                              >
                                {items?.label}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="page_link"
                      className="w-[150px] inline-block text-right float-left align-middle leading-[44px] pr-3"
                    >
                      <span className="text-red-500 pr-1">*</span>Page Link
                    </label>

                    <div className="relative ml-[150px]">
                      <input
                        {...register("services.link")}
                        type="text"
                        name="services.link"
                        autoComplete="off"
                        className="w-full bg-[#3a3b3c] detail_placeholder border-2 border-[#3a3b3c] rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3 mt-1"
                      />
                      {errors.services?.link && (
                        <p className="text-xs italic text-red-500 mt-2">
                          {errors.services?.link.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="country"
                      className="w-[150px] inline-block text-right float-left align-middle leading-[44px] pr-3"
                    >
                      <span className="text-red-500 pr-1">*</span>Country
                    </label>
                    <div className="relative ml-[150px]">
                      <Select
                        isMulti
                        options={options}
                        value={countries}
                        onChange={changeHandler}
                        styles={customStyles}
                        closeMenuOnSelect={false}
                        classNamePrefix="react-select"
                        placeholder="Type to add more countries"
                        className="w-full"
                      />
                      <p className="mb-1 text-muted-foreground opacity-60">
                        Leave blank for no restrictions
                      </p>
                    </div>
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="country"
                      className="w-[150px] inline-block text-right float-left align-middle leading-[44px] pr-3"
                    >
                      <span className="text-red-500 pr-1">*</span>Subtitles
                    </label>
                    <div className="relative ml-[150px]">
                      <Select
                        isMulti
                        options={tvSubtitle.map((sub) => ({
                          label: sub.label,
                          value: sub.value,
                        }))}
                        value={subtitle}
                        onChange={subtitleChangeHandler}
                        styles={customStyles}
                        closeMenuOnSelect={false}
                        classNamePrefix="react-select"
                        className="w-full"
                        placeholder="Type to add more translation languages"
                      />
                      <p className="mb-1 text-muted-foreground opacity-60">
                        Leave blank for no subtitles available.
                      </p>
                    </div>
                  </div>
                </form>
              </div>

              <div className="flex items-end justify-end">
                <button
                  className="bg-[#409eff] text-sm text-white border-2 border-[#409eff] rounded-sm px-5 py-3"
                  onClick={handleSubmit(addingItem)}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvAddModal;

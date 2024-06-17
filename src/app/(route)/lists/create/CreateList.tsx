"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaLock, FaRegEye } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { IoTvSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import EditList from "../[listId]/edit/EditList";
import { createList, TCreateList } from "@/app/helper/zod";

const CreateList = () => {
  const [selectType, setSelectType] = useState<string>("");
  const [selectPrivacy, setSelectPrivacy] = useState<string>("");
  const [submittedData, setSubmittedData] = useState<TCreateList | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<TCreateList>({
    resolver: zodResolver(createList),
  });

  const onSubmit = async (data: TCreateList) => {
    try {
      const res = await fetch("/api/list", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: selectType,
          listTitle: data.listTitle,
          privacy: selectPrivacy,
        }),
      });
      if (res.status === 200) {
        setSubmittedData(data);
        toast.success("List created successfully");
        reset();
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  return (
    <>
      {isSubmitSuccessful ? (
        <EditList
          submittedData={submittedData}
          list={null}
          yourRating={[]}
          findSpecificRating={[]}
        />
      ) : (
        <div className="max-w-2xl mx-auto py-3 px-4 md:px-6 my-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[#272727] border-2 border-[#272727] rounded-md"
          >
            <div className="py-2 px-5">
              <div className="flex items-center justify-between">
                <h1 className="text-black dark:text-white text-xl py-5">
                  Create a new list
                </h1>
                <IoMdClose />
              </div>
              <div className="py-8">
                <h1 className="text-md md:text-lg font-bold">
                  What&apos;s your list for?
                </h1>
                <div className="flex items-center">
                  <div
                    className={`bg-white rounded-md mt-2 mb-5 ${
                      selectType
                        ? "border-2 border-[#00619d] bg-white text-[#00619d]"
                        : "border-2 border-slate-100 "
                    }`}
                  >
                    <div
                      {...register("type")}
                      className={`${
                        selectType
                          ? "text-[#00619d] flex flex-col items-center p-8"
                          : "flex flex-col items-center p-8"
                      }`}
                      onClick={() => setSelectType("shows")}
                    >
                      <IoTvSharp
                        size={25}
                        className={`${
                          selectType ? "text-[#00619d]" : "text-[#616f79]"
                        }`}
                      />
                      <h1
                        className={`${
                          selectType
                            ? "text-[#00619d] text-xl"
                            : "text-[#616f79] text-xl"
                        }`}
                      >
                        Shows
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <h2 className="text-md md:text-lg font-bold">List Title</h2>
                  <input
                    {...register("listTitle")}
                    name="listTitle"
                    type="text"
                    className="w-full bg-[#272727] border-2 border-[#3b3b3b] rounded-md p-3 outline-none focus:ring-blue-500 focus:border-blue-500 mt-2"
                  />
                </div>
                <h1 className="text-md md:text-lg font-bold">
                  What type of list are you creating?
                </h1>
                <div className="flex items-center">
                  <div
                    className={`bg-white rounded-md mt-2 mb-5 ${
                      selectPrivacy === "Public list"
                        ? "border-2 border-[#00619d] bg-white text-[#00619d] mr-2 md:mr-5"
                        : "border-2 border-slate-100 mr-2 md:mr-5"
                    }`}
                  >
                    <div
                      {...register("privacy")}
                      className={`${
                        selectPrivacy === "Public list"
                          ? "text-[#00619d] flex flex-col items-center p-8"
                          : "flex flex-col items-center p-8"
                      }`}
                      onClick={() => setSelectPrivacy("Public list")}
                    >
                      <FaRegEye
                        size={25}
                        className={`${
                          selectPrivacy === "Public list"
                            ? "text-[#00619d]"
                            : "text-[#616f79]"
                        }`}
                      />
                      <h1
                        className={`${
                          selectPrivacy === "Public list"
                            ? "text-[#00619d] text-xl"
                            : "text-[#616f79] text-xl"
                        }`}
                      >
                        Public list
                      </h1>
                    </div>
                  </div>
                  <div
                    className={`bg-white rounded-md mt-2 mb-5 ${
                      selectPrivacy === "Private list"
                        ? "border-2 border-[#00619d] bg-white text-[#00619d] mr:2 md:mr-5"
                        : "border-2 border-slate-100 mr:2 md:mr-5"
                    }`}
                  >
                    <div
                      {...register("privacy")}
                      className={`${
                        selectPrivacy === "Private list"
                          ? "text-[#00619d] flex flex-col items-center p-8"
                          : "flex flex-col items-center p-8"
                      }`}
                      onClick={() => setSelectPrivacy("Private list")}
                    >
                      <FaLock
                        size={25}
                        className={`${
                          selectPrivacy === "Private list"
                            ? "text-[#00619d]"
                            : "text-[#616f79]"
                        }`}
                      />
                      <h1
                        className={`${
                          selectPrivacy === "Private list"
                            ? "text-[#00619d] text-xl"
                            : "text-[#616f79] text-xl"
                        }`}
                      >
                        Private list
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full text-center mb-4">
                <button
                  className=" bg-[#a0cfff4d] border-2 border-[#a0cfff4d] rounded-md px-4 py-2"
                  type="submit"
                >
                  Create list
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CreateList;

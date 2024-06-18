"use client";

import { profileSetting, TProfileSetting } from "@/helper/zod";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bounce, toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import Tiptap from "@/app/component/ui/TextEditor/TipTap";
import UploadAvatar from "./UploadAvatar";

const ProfileSetting = ({ user }: any) => {
  const { data: session } = useSession();
  const [avatar, setAvatar] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, control } = useForm<TProfileSetting>({
    resolver: zodResolver(profileSetting),
    defaultValues: {
      displayName: user?.displayName,
      country: user?.country,
      gender: user?.gender || "",
      biography: user?.biography,
    },
  });

  const onSubmit = async (data: TProfileSetting) => {
    setLoading(true);
    try {
      const response = await fetch("/api/setting/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: data?.displayName,
          country: data?.country,
          gender: data?.gender,
          dateOfBirth: data?.dateOfBirth,
          biography: data?.biography,
        }),
      });

      if (response.status === 200) {
        reset();
        location.reload();
        toast.success("Profile saved successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        reset();
        location.reload();
        toast.error("Failed to save profile", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-[1520px] flex flex-wrap justify-between mx-auto py-3 px-4 md:px-6">
      <div className="w-full h-auto border-2 border-gray-400 dark:border-[#272727]">
        <h1 className="text-2xl text-black dark:text-white p-5 border-b-2 border-b-slate-400 dark:border-b-[#272727]">
          Setting
        </h1>
        <div className="p-5">
          <div className="flex flex-col md:flex-row my-10">
            <label className="w-full md:w-[20%] lg:w-[15%]">
              Profile Picture:
            </label>
            <div className="flex flex-col md:flex-row md:items-center relative">
              <UploadAvatar
                loading={loading}
                setLoading={setLoading}
                avatar={avatar}
                setAvatar={setAvatar}
                user={user}
                handleSubmit={handleSubmit}
                register={register}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row my-10">
            <label className="w-full md:w-[20%] lg:w-[15%]">
              Display Name:
            </label>
            <input
              {...register("displayName")}
              type="text"
              placeholder={user?.displayName || ""}
              name="displayName"
              className="w-full md:w-[35%] lg:w-[25%] rounded-md mt-3 md:mt-0 md:ml-5 py-3 px-6"
            />
          </div>
          <div className="flex flex-col md:flex-row my-10">
            <label className="w-full md:w-[20%] lg:w-[15%] ">Username:</label>
            <input
              type="text"
              placeholder={session?.user?.name || ""}
              className="w-full md:w-[35%] lg:w-[25%] rounded-md mt-3 md:mt-0 md:ml-5 py-3 px-6 cursor-not-allowed"
              disabled
            />
          </div>
          <div className="flex flex-col md:flex-row my-10">
            <label className="w-full md:w-[20%] lg:w-[15%]">Email:</label>
            <input
              type="text"
              placeholder={session?.user?.email || ""}
              className="w-full md:w-[35%] lg:w-[25%] rounded-md mt-3 md:mt-0 md:ml-5 py-3 px-6 cursor-not-allowed"
              disabled
            />
          </div>
          <div className="flex flex-col md:flex-row my-10">
            <label className="w-full md:w-[20%] lg:w-[15%]">Country:</label>
            <input
              {...register("country")}
              type="text"
              name="country"
              placeholder="Enter your country"
              className="w-full md:w-[35%] lg:w-[25%] rounded-md mt-3 md:mt-0 md:ml-5 py-3 px-6"
            />
          </div>
          <div className="flex flex-col md:flex-row my-10">
            <label className="w-full md:w-[20%] lg:w-[15%]">Gender:</label>
            <select
              {...register("gender")}
              name="gender"
              id="gender"
              className="w-[40%] md:w-[15%] rounded-md mt-3 md:mt-0 md:ml-5 py-3 px-6"
            >
              <option value="-">-</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row my-10">
            <label className="w-full md:w-[20%] lg:w-[15%]">
              Date of Birth:
            </label>
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => {
                return (
                  <DatePicker
                    placeholderText={
                      user?.dateOfBirth?.toISOString()?.split("T")[0] ||
                      "YYYY-MM-DD"
                    }
                    onChange={(date) => {
                      // Format the date as YYYY-MM-DD before calling field.onChange()
                      const formattedDate =
                        date instanceof Date
                          ? date.toISOString().split("T")[0]
                          : "";
                      field.onChange(formattedDate);
                    }}
                    selected={field.value}
                    className="w-[100%] rounded-md mt-3 md:mt-0 md:ml-5 py-3 px-6"
                  />
                );
              }}
            />
          </div>

          <div className="my-10">
            <div className="flex flex-col md:flex-row">
              <label className="w-full md:w-[20%] lg:w-[15%]">Biography:</label>
              <Controller
                control={control}
                name="biography"
                render={({ field }) => {
                  return (
                    <Tiptap
                      description={user?.biography as string}
                      onChange={field.onChange}
                    />
                  );
                }}
              />
            </div>
            <div className="flex flex-col md:flex-row">
              <span className="w-full md:w-[20%] lg:w-[15%]"></span>
              <p className="text-sm text-[#818a91] ml-5">
                Describe yourself in a sentence or two.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t-2 border-t-[#272727] p-4">
          <button
            type="submit"
            onClick={() => {
              setLoading(!loading), handleSubmit(onSubmit);
            }}
            className="border-2 border-[#409eff] bg-[#409eff] rounded-md py-2 px-4 flex items-center"
          >
            <ClipLoader color="#272727" size={25} loading={loading} />
            <span className={`${loading && "ml-2"}`}>Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;

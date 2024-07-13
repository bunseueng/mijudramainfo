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
      <div className="w-full h-auto bg-[#fff] dark:bg-[#242526] border-2 border-[#00000024] dark:border-[#272727] rounded-md">
        <h1 className="text-2xl text-black dark:text-white p-5 border-b-2 border-b-[#78828c21] dark:border-b-[#272727]">
          Settings
        </h1>
        <div className="p-5">
          <div className="flex flex-col md:flex-row my-10">
            <label className="float-left md:w-[16.66667%]">
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
            <label className="float-left md:w-[16.66667%]">Display Name:</label>
            <div className="float-left md:w-[33.33333%] md:px-3">
              <input
                {...register("displayName")}
                type="text"
                placeholder={user?.displayName || ""}
                name="displayName"
                className="w-full bg-[#fff] dark:bg-[#3a3b3c] border-2 border-[#dcdfe6] dark:border-[#46494a] focus:border-[#409eff] rounded-md mt-3 md:mt-0 py-2 px-6 outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row my-10">
            <label className="float-left md:w-[16.66667%]">Username:</label>
            <div className="flex flex-col float-left md:w-[33.33333%] md:px-3">
              <input
                type="text"
                placeholder={session?.user?.name || ""}
                className="w-full bg-[#f5f7fa] dark:bg-[#1f1f1f] border-2 border-[#dcdfe6] dark:border-[#46494a] focus:border-[#409eff] rounded-md mt-3 md:mt-0 py-2 px-6 outline-none cursor-not-allowed"
                disabled
              />
              <div className="text-muted-foreground dark:opacity-80">
                <small>
                  http://mijudramainfo.vercel.app/profile/ImPossiBle
                </small>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row my-10">
            <label className="float-left md:w-[16.66667%]">Email:</label>
            <div className="float-left md:w-[33.33333%] md:px-3">
              <input
                type="text"
                placeholder={session?.user?.email || ""}
                className="w-full bg-[#f5f7fa] dark:bg-[#1f1f1f] border-2 border-[#dcdfe6] dark:border-[#46494a] focus:border-[#409eff] rounded-md mt-3 md:mt-0 py-2 px-6 outline-none cursor-not-allowed"
                disabled
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row my-10">
            <label className="float-left md:w-[16.66667%]">Country:</label>
            <div className="float-left md:w-[33.33333%] md:px-3">
              <input
                {...register("country")}
                type="text"
                name="country"
                placeholder="Enter your country"
                className="w-full bg-[#fff] dark:bg-[#3a3b3c] border-2 border-[#dcdfe6] dark:border-[#46494a] focus:border-[#409eff] rounded-md mt-3 md:mt-0 py-3 px-6 outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row my-10">
            <label className="float-left md:w-[16.66667%]">Gender:</label>
            <div className="float-left md:w-[33.33333%] md:px-3">
              <select
                {...register("gender")}
                name="gender"
                id="gender"
                className="w-full bg-[#fff] dark:bg-[#3a3b3c] border-2 border-[#dcdfe6] dark:border-[#46494a] focus:border-[#409eff] rounded-md mt-3 md:mt-0 py-3 px-6 outline-none"
              >
                <option value="-">-</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row my-10">
            <label className="float-left md:w-[16.66667%]">
              Date of Birth:
            </label>
            <div className="float-left md:w-[33.33333%] md:px-3">
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
                      className="w-full bg-[#fff] dark:bg-[#3a3b3c] border-2 border-[#dcdfe6] dark:border-[#46494a] focus:border-[#409eff] rounded-md mt-3 md:mt-0 py-3 px-6 outline-none"
                    />
                  );
                }}
              />
            </div>
          </div>

          <div className="my-10">
            <div className="flex flex-col md:flex-row">
              <label className="float-left md:w-[16.66667%]">Biography:</label>
              <div className="float-left w-full md:px-3">
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
            </div>
            <div className="flex flex-col md:flex-row">
              <span className="w-full md:w-[20%] lg:w-[15%]"></span>
              <p className="text-sm text-[#818a91] ml-5">
                Describe yourself in a sentence or two.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t-2 border-t-[#78828c21] dark:border-t-[#272727] p-4">
          <button
            type="submit"
            onClick={() => {
              setLoading(!loading), handleSubmit(onSubmit);
            }}
            className="text-white border-2 border-[#409eff] bg-[#409eff] rounded-md py-2 px-4 flex items-center"
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

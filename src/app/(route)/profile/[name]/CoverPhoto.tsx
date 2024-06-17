"use client";

import React, { useState } from "react";
import { IoCamera } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { User } from "./ProfileItem";
import { currentUserProps } from "@/app/helper/type";
import { coverPhoto, TCoverPhoto } from "@/app/helper/zod";

interface currentUser {
  currentUser: currentUserProps | null;
}

const CoverPhoto: React.FC<User & currentUser> = ({ user, currentUser }) => {
  const [cover, setCover] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, reset } = useForm<TCoverPhoto>({
    resolver: zodResolver(coverPhoto),
    defaultValues: {
      coverPhoto: "",
    },
  });
  const handleProductImage = (e: any) => {
    const file = e.target.files[0];

    transformFile(file);
  };

  const transformFile = (file: any) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setCover(reader.result as string);
      };
    } else {
      setCover("");
    }
  };

  const onSubmit = async (data: TCoverPhoto) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/coverphoto/${user?.name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coverPhoto: cover,
        }),
      });
      if (response.ok) {
        toast.success("Cover photo added successfully");
        reset();
        location.reload();
      } else {
        toast.error("Failed to add cover photo");
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full">
      <div
        className="w-full h-[400px] relative bg-cover bg-center object-cover bg-no-repeat"
        style={{
          backgroundImage: cover
            ? `url(${cover})`
            : `url(${user?.coverPhoto || "/default-cover.png"})`,
        }}
      >
        <div className="absolute right-5 -bottom-4">
          {currentUser?.id === user?.id && (
            <div className="overflow-hidden relative">
              {cover ? (
                <div className="flex items-center">
                  <button className="flex items-center bg-white border text-black border-slate-200 rounded-md py-2 px-3 mr-2">
                    <IoCamera />{" "}
                    <span className="pl-2">Change Cover Photo</span>
                  </button>

                  <input
                    {...register("coverPhoto")}
                    className="w-[169px] h-10 absolute top-0 left-0 block cursor-pointer opacity-0"
                    type="file"
                    name="coverPhoto"
                    onChange={handleProductImage}
                  />
                  <button
                    type="submit"
                    className="flex items-center bg-white border text-black border-slate-200 rounded-md py-2 px-3"
                  >
                    <ClipLoader color="#272727" size={25} loading={loading} />
                    <span className={`${loading && "ml-2"}`}>
                      {loading ? "Submitting" : "Submit"}
                    </span>
                  </button>
                </div>
              ) : (
                <>
                  <button className="flex items-center bg-white border text-black border-slate-200 rounded-md py-2 px-3">
                    <IoCamera /> <span className="pl-2">Edit Cover Photo</span>
                  </button>

                  <input
                    {...register("coverPhoto")}
                    className="w-[169px] h-10 absolute top-0 left-0 block cursor-pointer opacity-0"
                    type="file"
                    name="coverPhoto"
                    onChange={handleProductImage}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default CoverPhoto;

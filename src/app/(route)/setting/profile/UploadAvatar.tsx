import { UploadAvatarProps } from "@/app/helper/type";
import { TProfileSetting } from "@/app/helper/zod";
import Image from "next/image";
import React from "react";
import { IoCamera } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

const UploadAvatar: React.FC<UploadAvatarProps> = ({
  loading,
  setLoading,
  avatar,
  setAvatar,
  user,
  register,
  handleSubmit,
}) => {
  const submitAvatar = async (data: TProfileSetting) => {
    setLoading(true);
    try {
      const response = await fetch("/api/setting/avatar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileAvatar: avatar,
        }),
      });
      if (response.ok) {
        toast.success("Profile avatar added successfully");
        location.reload();
      } else {
        toast.error("Failed to add profile avatar");
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductImage = (e: any) => {
    const file = e.target.files[0];

    transformFile(file);
  };

  const transformFile = (file: any) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
    } else {
      setAvatar("");
    }
  };
  return (
    <>
      <div className="w-[100px] h-[100px]">
        <Image
          src={
            user?.profileAvatar !== null
              ? user?.profileAvatar
              : (user?.image as any)
          }
          alt="profile image"
          width={200}
          height={200}
          quality={100}
          className="w-full h-full bg-center bg-cover object-cover md:ml-5"
        />
      </div>
      {avatar ? (
        <div className="flex flex-col md:flex-row md:items-center relative">
          <button className="w-[210px] md:w-auto flex items-center bg-white border text-black border-slate-200 rounded-md py-2 px-3 mr-2 my-5 md:my-0 md:ml-10">
            <IoCamera /> <span className="pl-2">Change Profile Avatar</span>
          </button>

          <input
            {...register("profileAvatar")}
            className="w-[209px] h-10 absolute top-5 md:top-0 left-0 md:left-10 block cursor-pointer opacity-0"
            type="file"
            name="profileAvatar"
            onChange={handleProductImage}
          />
          <button
            onClick={handleSubmit(submitAvatar)}
            className="w-[100px] md:w-autoflex items-center bg-white border text-black border-slate-200 rounded-md py-2 px-3"
          >
            <ClipLoader color="#272727" size={25} loading={loading} />
            <span className={`${loading && "ml-2"}`}>
              {loading ? "Submitting" : "Submit"}
            </span>
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            className="w-[100px] md:w-auto flex items-center bg-white border text-black border-slate-200 rounded-md py-2 px-3 mt-4 md:mt-0 md:ml-10"
          >
            <IoCamera /> <span className="pl-2">Upload</span>
          </button>
          <input
            {...register("profileAvatar")}
            className="block w-[104px] h-10 absolute md:right-0 bottom-0 md:bottom-8 smleft-0 cursor-pointer opacity-0"
            type="file"
            name="profileAvatar"
            onChange={handleProductImage}
          />
        </>
      )}
    </>
  );
};

export default UploadAvatar;

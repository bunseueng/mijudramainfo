import { TCreateList } from "@/helper/zod";
import Image from "next/image";
import React, { useState } from "react";
import { IoCamera } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { SlCloudUpload } from "react-icons/sl";
import { ListThumbnailProps } from "@/helper/type";

const ListThumbnail: React.FC<ListThumbnailProps> = ({
  list,
  register,
  reset,
  handleSubmit,
}) => {
  const [thumbnail, setThumbnail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleProductImage = (e: any) => {
    const file = e.target.files[0];

    transformFile(file);
  };

  const transformFile = (file: any) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
    } else {
      setThumbnail("");
    }
  };

  const onUpload = async (data: TCreateList) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/list/${list?.listId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          thumbnail: thumbnail,
        }),
      });
      if (res.status === 200) {
        toast.success("Thumbnail updated successfully");
        reset();
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false); // Set loading to false when the request is completed
    }
  };

  return (
    <div className="mt-5">
      <label htmlFor="type">List Thumbnail*</label>
      <div className="flex flex-col md:flex-row md:items-center relative">
        {thumbnail ? (
          <>
            {!loading ? (
              <button
                type="button"
                className="w-[100px] md:w-auto flex items-center bg-white border text-black border-slate-200 rounded-md py-2 px-3 mt-4 md:my-5"
                onClick={() => handleSubmit(onUpload)}
              >
                <SlCloudUpload />
                <span className="pl-2 pt-[2px]">Submit</span>
              </button>
            ) : (
              <button
                type="button"
                className="w-[100px] md:w-auto flex items-center bg-white border text-black border-slate-200 rounded-md py-2 px-3 mt-4 md:my-5"
              >
                <ClipLoader color="#272727" size={25} loading={loading} />
                <span className="pl-2 pt-[2px]">Submitting...</span>
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            className="w-[100px] md:w-auto flex items-center bg-white border text-black border-slate-200 rounded-md py-2 px-3 mt-4 md:my-5"
          >
            <IoCamera /> <span className="pl-2">Upload</span>
          </button>
        )}
        {!thumbnail && (
          <input
            {...register("thumbnail")}
            className="block w-[104px] h-[43px] absolute bottom-5 left-0 cursor-pointer opacity-0 rounded-md"
            type="file"
            name="thumbnail"
            onChange={handleProductImage}
          />
        )}
      </div>
      <Image
        src={
          thumbnail
            ? thumbnail || (list?.thumbnail as string)
            : "/empty-img.jpg"
        }
        alt="List thumbnail"
        width={200}
        height={200}
        quality={100}
      />
    </div>
  );
};

export default ListThumbnail;

"use client";

import { fetchTv } from "@/app/actions/fetchMovieApi";
import LazyImage from "@/components/ui/lazyimage";
import { Drama, tvId } from "@/helper/type";
import { createDetails, TCreateDetails } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

const TvCover: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const [cover, setCover] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { handleSubmit, reset } = useForm<TCreateDetails>({
    resolver: zodResolver(createDetails),
  });
  const { data: tv } = useQuery({
    queryKey: ["tvEdit", tv_id],
    queryFn: () => fetchTv(tv_id),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch on mount to get the latest data
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

  const onSubmit = async (data: TCreateDetails) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tv/${tv?.id}/cover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tv_id: tv?.id.toString(),
          cover: cover,
        }),
      });
      if (res.status === 200) {
        reset();
        router.refresh();
        toast.success("Success");
      } else if (res.status === 400) {
        toast.error("Invalid User");
      } else if (res.status === 500) {
        console.log("Bad Request");
      }
    } catch (error: any) {
      console.log("Bad Request");
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="py-3 px-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">
        Cover Image
      </h1>
      <div className="-mx-3">
        <div className="relative float-left w-full md:w-[50%] px-3">
          <div className="block text-left overflow-hidden mb-2">
            <div>
              <div className="w-[250px] h-[350px] float-left mr-3 mb-3">
                <LazyImage
                  src={
                    cover ||
                    tvDetails?.cover ||
                    `https://image.tmdb.org/t/p/${
                      tv?.backdrop_path ? "w300" : "w154"
                    }/${tv?.backdrop_path || tv?.poster_path}`
                  }
                  alt={`${tv?.name}'s Backdrop`}
                  width={500}
                  height={500}
                  quality={100}
                  priority
                  className="inline-block w-full h-full bg-[#eee] bg-cover bg-center object-cover border-2 border-[#fff] p-1"
                />
              </div>
              <div className="float-left w-[84px] h-[120px]">
                <LazyImage
                  src={
                    cover ||
                    tvDetails?.cover ||
                    `https://image.tmdb.org/t/p/${
                      tv?.backdrop_path ? "w300" : "w154"
                    }/${tv?.backdrop_path || tv?.poster_path}`
                  }
                  alt={`${tv?.name}'s Backdrop`}
                  width={500}
                  height={500}
                  quality={100}
                  priority
                  className="inline-block w-full h-full bg-cover bg-center object-cover align-middle"
                />
              </div>
            </div>
          </div>
          <button
            name="Submit"
            type="submit"
            className={`flex items-center text-white bg-[#5cb85c] border-2 border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
              cover
                ? "cursor-pointer"
                : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
            }`}
            disabled={cover ? false : true}
          >
            <span className="mr-1 pt-1">
              <ClipLoader color="#c3c3c3" loading={loading} size={19} />
            </span>
            Submit
          </button>
        </div>
        <div className="float-left w-full md:w-[50%] px-3">
          <p className="bg-[#fcf8e3] border-2 border-[#faf2cc] text-[#8a6d3b] text-sm p-4 rounded-md">
            Remember only one picture will show up on the profile, so do not
            submit a picture if there is already a better one up. Minimum
            acceptable dimensions are 300 x 300 pixels.
          </p>
          <div className="relative mt-5">
            <button className="flex items-center bg-[#409eff] border text-white border-[#409eff] rounded-md py-2 px-3">
              Choose File
            </button>

            <input
              className="w-[110px] h-10 absolute top-0 left-0 block cursor-pointer opacity-0"
              type="file"
              name="coverPhoto"
              onChange={handleProductImage}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default TvCover;

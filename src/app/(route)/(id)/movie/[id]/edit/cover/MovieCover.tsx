"use client";

import { fetchMovie } from "@/app/actions/fetchMovieApi";
import { createDetails, TCreateDetails } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import ReusedImage from "@/components/ui/allreusedimage";
import { Movie, movieId } from "@/helper/type";
import { Loader2 } from "lucide-react";

const MovieCover: React.FC<movieId & Movie> = ({ movie_id, movieDetails }) => {
  const [cover, setCover] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { handleSubmit, reset } = useForm<TCreateDetails>({
    resolver: zodResolver(createDetails),
  });

  const { data: movie } = useQuery({
    queryKey: ["movieEdit", movie_id],
    queryFn: () => fetchMovie(movie_id),
    staleTime: 3600000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const resizeAndConvertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, 300, 300);
        const base64String = canvas.toDataURL("image/jpeg", 0.95);
        resolve(base64String);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleProductImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const img = new Image();
        img.onload = async () => {
          if (img.width < 300 || img.height < 300) {
            toast.error("Image dimensions must be at least 300x300 pixels");
            setCover(undefined);
          } else {
            try {
              const base64String = await resizeAndConvertToBase64(file);
              setCover(base64String);
            } catch (resizeError) {
              console.error("Error resizing image:", resizeError);
              toast.error("Failed to resize image");
              setCover(undefined);
            }
          }
        };
        img.onerror = () => {
          toast.error("Failed to load image");
          setCover(undefined);
        };
        img.src = URL.createObjectURL(file);
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Failed to process image");
        setCover(undefined);
      }
    } else {
      setCover(undefined);
    }
  };

  const onSubmit = async () => {
    if (!cover) {
      toast.error("Please select an image first");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/movie/${movie?.id}/cover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movie?.id.toString(),
          cover: cover,
        }),
      });

      if (res.status === 200) {
        reset();
        router.refresh();
        toast.success("Cover image updated successfully");
      } else if (res.status === 400) {
        toast.error("Invalid request");
      } else {
        toast.error("An error occurred");
      }
    } catch (error: any) {
      console.error("Error updating cover image:", error);
      toast.error("Failed to update cover image");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <form className="py-3 px-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-[#1675b6] text-xl font-bold mb-6">Cover Image</h1>
      <div className="-mx-3">
        <div className="relative float-left w-full md:w-[50%] px-3">
          <div className="block text-left overflow-hidden mb-2">
            <div>
              <div className="w-[250px] h-[350px] float-left mr-3 mb-3">
                <ReusedImage
                  src={
                    cover ||
                    movieDetails?.cover ||
                    `https://image.tmdb.org/t/p/${
                      movie?.backdrop_path ? "w780" : "h632"
                    }/${movie?.backdrop_path || movie?.poster_path}`
                  }
                  alt={`${movie?.name}'s Backdrop`}
                  width={300}
                  height={300}
                  quality={100}
                  priority
                  className="inline-block w-full h-full bg-[#eee] bg-cover bg-center object-cover border-2 border-[#fff] p-1"
                />
              </div>
              <div className="float-left w-[84px] h-[120px]">
                <ReusedImage
                  src={
                    cover ||
                    movieDetails?.cover ||
                    `https://image.tmdb.org/t/p/${
                      movie?.backdrop_path ? "w780" : "w154"
                    }/${movie?.backdrop_path || movie?.poster_path}`
                  }
                  alt={`${movie?.name}'s Backdrop`}
                  width={300}
                  height={300}
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
            disabled={!cover}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
          </button>
        </div>
        <div className="float-left w-full md:w-[50%] px-3">
          <p className="bg-[#fcf8e3] border-2 border-[#faf2cc] text-[#8a6d3b] text-sm p-4 rounded-md">
            Please upload an image with dimensions of at least 300x300 pixels.
            The image will be automatically resized to 300x300 pixels and
            converted to base64 format.
          </p>
          <div className="relative mt-5">
            <button
              type="button"
              onClick={triggerFileInput}
              className="flex items-center bg-[#409eff] border text-white border-[#409eff] rounded-md py-2 px-3"
            >
              Choose File
            </button>

            <input
              ref={fileInputRef}
              className="hidden"
              type="file"
              name="coverPhoto"
              onChange={handleProductImage}
              accept="image/*"
            />
          </div>
          {cover && (
            <p className="mt-2 text-sm text-green-600">
              Image selected, resized to 300x300 pixels
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default MovieCover;

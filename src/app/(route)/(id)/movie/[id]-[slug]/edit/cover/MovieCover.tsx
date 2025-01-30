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
import { useMovieData } from "@/hooks/useMovieData";

const MovieCover: React.FC<movieId & Movie> = ({ movie_id, movieDetails }) => {
  const [cover, setCover] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { movie } = useMovieData(movie_id);

  const { handleSubmit, reset } = useForm<TCreateDetails>({
    resolver: zodResolver(createDetails),
  });

  const resizeAndConvertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Target dimensions maintaining 2:3 aspect ratio
        const targetWidth = 500;
        const targetHeight = 750;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Calculate scaling to maintain aspect ratio
        const scale = Math.max(
          targetWidth / img.width,
          targetHeight / img.height
        );

        // Calculate dimensions after scaling
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        // Calculate cropping coordinates to center the image
        const x = (scaledWidth - targetWidth) / 2;
        const y = (scaledHeight - targetHeight) / 2;

        // Draw the image with proper scaling and cropping
        ctx.drawImage(
          img,
          -x,
          -y, // Destination x, y
          scaledWidth,
          scaledHeight // Destination width, height
        );

        const base64String = canvas.toDataURL("image/jpeg", 0.95);
        resolve(base64String);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const validateImageDimensions = (width: number, height: number): boolean => {
    // Check minimum dimensions
    if (width < 500 || height < 750) {
      toast.error("Image must be at least 500x750 pixels");
      return false;
    }

    // Check maximum dimensions
    if (width > 2000 || height > 3000) {
      toast.error("Image must not exceed 2000x3000 pixels");
      return false;
    }

    // Check aspect ratio (allowing for small rounding differences)
    const aspectRatio = width / height;
    const targetRatio = 2 / 3;
    const tolerance = 0.1; // 10% tolerance

    if (Math.abs(aspectRatio - targetRatio) > tolerance) {
      toast.error("Image must have an aspect ratio of 2:3");
      return false;
    }

    return true;
  };

  const handleProductImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const img = new Image();
        img.onload = async () => {
          if (!validateImageDimensions(img.width, img.height)) {
            setCover(undefined);
            return;
          }

          try {
            const base64String = await resizeAndConvertToBase64(file);
            setCover(base64String);
          } catch (resizeError) {
            console.error("Error resizing image:", resizeError);
            toast.error("Failed to resize image");
            setCover(undefined);
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
              <div className="w-[250px] h-[375px] float-left mr-3 mb-3">
                <ReusedImage
                  src={
                    cover ||
                    movieDetails?.cover ||
                    `https://image.tmdb.org/t/p/${
                      movie?.backdrop_path ? "w780" : "h632"
                    }/${movie?.backdrop_path || movie?.poster_path}`
                  }
                  alt={`${movie?.name}'s Poster`}
                  width={500}
                  height={750}
                  quality={100}
                  priority
                  className="inline-block w-full h-full bg-[#eee] bg-cover bg-center object-cover border-2 border-[#fff] p-1"
                />
              </div>
              <div className="float-left w-[84px] h-[126px]">
                <ReusedImage
                  src={
                    cover ||
                    movieDetails?.cover ||
                    `https://image.tmdb.org/t/p/${
                      movie?.backdrop_path ? "w780" : "w154"
                    }/${movie?.backdrop_path || movie?.poster_path}`
                  }
                  alt={`${movie?.name}'s Poster`}
                  width={500}
                  height={750}
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
          <div className="bg-[#fcf8e3] border-2 border-[#faf2cc] text-[#8a6d3b] text-sm p-4 rounded-md">
            <h3 className="font-semibold mb-2">Image Requirements:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Maximum resolution: 2000x3000 pixels</li>
              <li>Minimum resolution: 500x750 pixels</li>
              <li>Required aspect ratio: 2:3</li>
            </ul>
            <p className="mt-2">
              Images will be automatically resized to 500x750 pixels while
              maintaining the aspect ratio.
            </p>
          </div>
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
              Image selected and resized to 500x750 pixels
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default MovieCover;

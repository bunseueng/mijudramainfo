"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import dynamic from "next/dynamic";
import Images from "next/image";
import type { DramaDB, MovieDB } from "@/helper/type";
import ReusedImage from "@/components/ui/allreusedimage";
import { SearchPagination } from "@/app/component/ui/Pagination/SearchPagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import { useColorFromImage } from "@/hooks/useColorFromImage";
import { useDramaData } from "@/hooks/useDramaData";
import { useMovieData } from "@/hooks/useMovieData";

const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

type DramaDatabase = {
  movie_id: string;
  getAllMovie: MovieDB[] | [];
};

const MoviePoster = ({ getAllMovie, movie_id }: DramaDatabase) => {
  const searchParams = useSearchParams();
  const route = useRouter();
  const { movie, isLoading } = useMovieData(movie_id);
  const getColorFromImage = useColorFromImage();
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const currentBackdrops = movie?.images?.posters?.map((item: any) => item);
  const currentPosters = getAllMovie
    ?.filter((data: any) => data.movie_id === movie_id)
    ?.map((item: any) => item?.photo);
  const combinedItems = currentPosters
    ?.concat(currentBackdrops)
    ?.reduce((acc: any, val: any) => acc.concat(val), []);
  const per_page = searchParams?.get("per_page") || (20 as any);
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);
  const totalItems = combinedItems?.length;
  const currentItems = combinedItems?.slice(start, end) || combinedItems;
  const coverFromDB = getAllMovie?.find((g: any) =>
    g?.movie_id?.includes(movie?.id)
  );
  const extractColor = useCallback(async () => {
    if (imgRef.current) {
      const imageUrl =
        (coverFromDB?.cover as string) ||
        `https://image.tmdb.org/t/p/${movie?.poster_path ? "w92" : "w300"}/${
          movie?.poster_path || movie?.backdrop_path
        }`;
      const [r, g, b] = await getColorFromImage(imageUrl);
      const rgbaColor = `rgb(${r}, ${g}, ${b})`; // Full opacity
      setDominantColor(rgbaColor);
    } else {
      console.error("Image url undefined");
    }
  }, [
    coverFromDB,
    movie?.backdrop_path,
    movie?.poster_path,
    getColorFromImage,
  ]);

  useEffect(() => {
    if (imgRef.current) {
      const imgElement = imgRef.current;
      imgElement.addEventListener("load", extractColor);

      return () => {
        imgElement.removeEventListener("load", extractColor);
      };
    }
  }, [extractColor]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const checkImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        // Allow a small tolerance for aspect ratio (e.g., 0.05)
        resolve(Math.abs(aspectRatio - 2 / 3) < 0.05);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const isPosterSize = await checkImageDimensions(file);

      if (!isPosterSize) {
        toast.error(
          "Please upload an image with a poster aspect ratio (approximately 2:3)"
        );
        // Clear the input
        event.target.value = "";
        setSelectedFile(null);
        setPreviewUrl(null);
        setBase64Image(null);
        return;
      }

      // Remove previous image
      if (selectedFile) {
        URL.revokeObjectURL(previewUrl as string);
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      try {
        const base64 = await convertToBase64(file);
        setBase64Image(base64);
      } catch (error) {
        console.error("Error converting image to base64:", error);
        toast.error("Failed to process the image");
      }
    }
  };

  const handleUpload = async () => {
    if (!base64Image) {
      toast.error("Please select an image to upload");
      return;
    }
    setIsUploading(true);
    try {
      const response = await fetch(`/api/movie/${movie_id}/photo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id,
          photo: base64Image,
          title,
          description,
        }),
      });

      if (response.ok) {
        toast.success("Image uploaded successfully");
        setIsModalOpen(false);
        setPreviewUrl(null);
        setBase64Image(null);
        setSelectedFile(null);
        setTitle("");
        setDescription("");
        route.refresh();
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An error occurred while uploading the image");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (isLoading) {
    return <SearchLoading />;
  }
  return (
    <div>
      <div
        className="bg-cyan-600 dark:bg-[#242424]"
        style={{ backgroundColor: dominantColor as string | undefined }}
      >
        <div className="max-w-6xl mx-auto flex items-center mt-0 px-4 py-2">
          <div className="flex items-center lg:items-start px-2 cursor-default">
            <Images
              ref={imgRef}
              src={
                coverFromDB?.cover ||
                `https://image.tmdb.org/t/p/${
                  movie?.poster_path ? "w154" : "w300"
                }/${movie?.poster_path || movie?.backdrop_path}`
              }
              alt={`${movie?.name || movie?.title}'s Poster` || "Drama Poster"}
              width={80}
              height={90}
              quality={100}
              priority
              onLoad={extractColor}
              className="w-[80px] h-[90px] bg-center object-cover rounded-md"
            />
            <div className="flex flex-col pl-5 py-2">
              <h1 className="text-white text-xl font-bold">
                {movie?.title} (
                {getYearFromDate(movie?.first_air_date || movie?.release_date)})
              </h1>
              <Link
                prefetch={false}
                href={`/movie/${movie_id}-${spaceToHyphen(
                  movie?.name || movie?.title
                )}`}
                className="flex items-center text-sm my-1 opacity-75 hover:opacity-90"
              >
                <FaArrowLeft className="text-white" size={20} />
                <p className="text-white font-bold pl-2">Back to main</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="relative max-w-6xl mx-auto md:py-8 mt-5 px-4 overflow-hidden">
        <div className="border-[1px] rounded-lg bg-white dark:bg-[#242424] dark:border-[#272727] px-2">
          <div className="flex justify-between items-center p-5 border-b-[1px] border-b-slate-200 dark:border-[#2f2f2f]">
            <h1 className="text-2xl font-bold dark:text-[#2196f3]">
              {movie?.name}
            </h1>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FaUpload /> Upload Photo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Upload New Photo</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="picture" className="text-right">
                      Picture
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="picture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedFile
                          ? `Selected: ${selectedFile.name}`
                          : "Please upload an image with a poster aspect ratio (approximately 2:3)"}
                      </p>
                    </div>
                  </div>
                  {previewUrl && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Preview</Label>
                      <div className="col-span-3">
                        <Images
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          width={200}
                          height={300}
                          className="rounded-md object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <Button onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {currentItems?.map((img: any, idx: number) => {
              return (
                <div
                  key={idx}
                  className="aspect-[2/3] overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <ReusedImage
                    src={
                      img?.url ||
                      `https://image.tmdb.org/t/p/original/${img?.file_path}`
                    }
                    alt={
                      `${movie?.name || movie?.title}'s Poster` ||
                      "Drama Poster"
                    }
                    width={300}
                    height={450}
                    quality={100}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4">
          <SearchPagination
            setPage={setPage}
            totalItems={totalItems}
            per_page={per_page as string}
          />
        </div>
      </div>
    </div>
  );
};

export default MoviePoster;

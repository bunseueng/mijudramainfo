"use client";

import { fetchMovie, fetchMovieImages } from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";
import { getYearFromDate } from "@/app/actions/getYearFromDate";
import dynamic from "next/dynamic";
import Image from "next/image";
import { MovieDB } from "@/helper/type";
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

const SearchLoading = dynamic(
  () => import("@/app/component/ui/Loading/SearchLoading"),
  { ssr: false }
);

type MovieDatabase = {
  getMovie: MovieDB[] | any;
};

const MoviePhotoAlbum = ({ getMovie }: MovieDatabase) => {
  const searchParams = useSearchParams();
  const pathParts =
    typeof window !== "undefined" ? window.location.pathname.split("/") : [];
  const movie_id = pathParts[2];
  const route = useRouter();

  const {
    data: getImage,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getMovieImage", movie_id],
    queryFn: () => fetchMovieImages(movie_id),
    staleTime: 3600000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const { data: movie } = useQuery({
    queryKey: ["movie", movie_id],
    queryFn: () => fetchMovie(movie_id),
    staleTime: 3600000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const currentBackdrops = getImage?.backdrops?.map((item: any) => item);
  const currentPosters = getMovie?.map((item: any) => item?.photo);
  const combinedItems = currentPosters
    ?.concat(currentBackdrops)
    ?.reduce((acc: any, val: any) => acc.concat(val), []);
  const per_page = searchParams?.get("per_page") || (20 as any);
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);
  const totalItems = combinedItems?.length;
  const currentItems = combinedItems?.slice(start, end) || combinedItems;
  const coverFromDB = getMovie?.find((g: any) =>
    g?.movie_id?.includes(movie?.id)
  );

  const getColorFromImage = async (imageUrl: string) => {
    const response = await fetch("/api/extracting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(data.error || "Failed to get color");
    }

    return data.averageColor;
  };

  const extractColor = useCallback(async () => {
    if (imgRef.current) {
      const color = await getColorFromImage(
        coverFromDB
          ? (coverFromDB?.cover as string)
          : `https://image.tmdb.org/t/p/${
              movie?.poster_path ? "w154" : "w300"
            }/${movie?.poster_path || movie?.backdrop_path}`
      );
      setDominantColor(color);
    }
  }, [movie, coverFromDB]);

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

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setUploadedImage(file);
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
        setUploadedImage(null);
        setPreviewUrl(null);
        setBase64Image(null);
        setTitle("");
        setDescription("");
        refetch();
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
            <Image
              ref={imgRef}
              src={
                coverFromDB?.cover ||
                `https://image.tmdb.org/t/p/${
                  movie?.poster_path ? "w154" : "w300"
                }/${movie?.poster_path || movie?.backdrop_path}`
              }
              alt={`${movie?.name || movie?.title}'s Poster`}
              width={60}
              height={90}
              quality={100}
              priority
              className="w-[60px] h-[90px] bg-center object-center rounded-md"
            />
            <div className="flex flex-col pl-5 py-2">
              <h1 className="text-white text-xl font-bold">
                {movie?.title} (
                {getYearFromDate(movie?.first_air_date || movie?.release_date)})
              </h1>
              <Link
                prefetch={false}
                href={`/movie/${movie_id}`}
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
                    <Input
                      id="picture"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="col-span-3"
                    />
                  </div>
                  {previewUrl && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Preview</Label>
                      <div className="col-span-3">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          width={200}
                          height={200}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {currentItems.map((img: any, idx: number) => {
              return (
                <div
                  key={idx}
                  className="aspect-square overflow-hidden rounded-lg"
                >
                  <ReusedImage
                    src={
                      img?.url ||
                      `https://image.tmdb.org/t/p/original/${img?.file_path}`
                    }
                    alt={`${movie?.name || movie?.title}'s Poster/Backdrop`}
                    width={300}
                    height={300}
                    quality={100}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 cursor-grab"
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

export default MoviePhotoAlbum;

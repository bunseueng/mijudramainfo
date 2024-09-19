"use client";

import React, { useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FiTrash } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { fetchMovie, fetchTv } from "@/app/actions/fetchMovieApi";
import ClipLoader from "react-spinners/ClipLoader";
import { MovieResultProps } from "@/helper/type";
import dynamic from "next/dynamic";
import DramaListRating from "./DramaListRating";
const CommentModal = dynamic(
  () => import("@/app/component/ui/Modal/CommentModal"),
  { ssr: false }
);

const MovieResult: React.FC<MovieResultProps> = ({
  setMovieId,
  movieId,
  setTvId,
  tvId,
  list,
  reset,
  handleSubmit,
  loading,
  findSpecificRating,
  yourRating,
  register,
}) => {
  const dragPerson = useRef<number>(0);
  const draggedOverPerson = useRef<number>(0);
  const [modal, setModal] = useState<boolean>(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [comments, setComments] = useState<{ [key: string]: string }>({}); // State for comments

  function handleSort() {
    const peopleClone = [...movieId, ...tvId];
    const temp = peopleClone[dragPerson.current];
    peopleClone[dragPerson.current] = peopleClone[draggedOverPerson.current];
    peopleClone[draggedOverPerson.current] = temp;
    setMovieId(peopleClone.filter((id: number) => movieId.includes(id)));
    setTvId(peopleClone.filter((id: number) => tvId.includes(id)));
  }

  const {
    data: tvAndMovieResult = [],
    refetch: refetchData,
    isLoading,
  } = useQuery({
    queryKey: ["tvAndMovieResult"],
    queryFn: async () => {
      const tvDetails = await Promise.all(
        tvId.map(async (id: number) => await fetchTv(id))
      );
      const movieDetails = await Promise.all(
        movieId.map(async (id: number) => await fetchMovie(id))
      );
      return [...tvDetails, ...movieDetails];
    },
    enabled: true, // Ensures the query runs immediately
  });
  useEffect(() => {
    refetchData();
  }, [movieId, tvId, refetchData]);

  const [isDeleting, setIsDeleting] = useState(false); // Add this state

  const onDeleteMovie = async (id: string) => {
    try {
      setIsDeleting(true);

      const mediaType = tvAndMovieResult.find(
        (item: any) => item.id === id && item.runtime !== undefined
      );

      const res = await fetch(`/api/list/${list?.listId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [mediaType ? "movieId" : "tvId"]: id,
        }),
      });

      if (res.status === 200) {
        toast.success("List updated successfully");
        reset();
      } else {
        toast.error("Failed to update list");
      }
    } catch (error: any) {
      toast.error("Failed to update list");
      console.error("Error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="absolute bottom-[50%] left-[50%]">
        <ClipLoader color="#fff" size={25} loading={loading} />
      </div>
    );
  }

  return (
    <>
      {tvAndMovieResult.length > 0 && (
        <div className="w-full border-t-[1px] border-t-[#78828c] pt-10 relative">
          {tvAndMovieResult &&
            tvAndMovieResult.length > 0 &&
            tvAndMovieResult.map((item: any, idx: number) => (
              <div
                className="flex items-start justify-between"
                key={idx}
                draggable
                onDragStart={() => (dragPerson.current = idx)}
                onDragEnter={() => (draggedOverPerson.current = idx)}
                onDragEnd={handleSort}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="flex items-start mx-4 mb-3">
                  <div className="flex flex-col items-center pr-5">
                    <GiHamburgerMenu
                      size={20}
                      className="text-black dark:text-[#ffffffde]"
                    />
                    <p className="text-md">{idx + 1}</p>
                  </div>
                  {(item?.poster_path || item?.backdrop_path) && (
                    <Image
                      src={`${
                        item?.poster_path || item?.backdrop_path === null
                          ? `https://image.tmdb.org/t/p/original/${
                              item?.poster_path || item?.backdrop_path
                            }`
                          : "/empty-img.jpg"
                      }`}
                      alt={`${item?.name || item?.title} image`}
                      width={65}
                      height={65}
                      quality={100}
                      className="w-[65px] h-[90px] bg-cover bg-center"
                    />
                  )}
                  <div className="pl-4">
                    <p className="text-[#2490da] text-md md:text-lg font-bold truncate-title">
                      {item?.name || item?.title}
                    </p>
                    <p>
                      <DramaListRating
                        item={item}
                        findSpecificRating={findSpecificRating}
                        yourRating={yourRating}
                      />
                    </p>
                    <p className="text-sm  mt-2 overflow-hidden">
                      {list?.dramaComment
                        ?.filter((list: any) => list?.tvId === item?.id)
                        ?.map((comment: any) => comment?.comment)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start mr-5">
                  <p className="text-[#606266] mr-5">#{idx + 1}</p>
                  <div className="flex-flex-col">
                    <span
                      className="flex items-center text-sm bg-white dark:bg-[#3a3b3c] border-[1px] border-[#00000011] dark:border-[#3a3b3c] rounded-md px-2 py-1 cursor-pointer"
                      onClick={() => {
                        setActiveItemId(item.id), setModal(!modal);
                      }}
                    >
                      <CiEdit className="mr-1" />{" "}
                      {list?.dramaComment?.find(
                        (comment: any) => comment?.tvId === item?.id
                      )?.comment === null ||
                      list?.dramaComment?.find(
                        (comment: any) => comment?.tvId === item?.id
                      )?.comment === ""
                        ? "Add Comments"
                        : "Edit Comments"}
                    </span>
                    {modal && (
                      <>
                        {activeItemId === item?.id && (
                          <CommentModal
                            register={register}
                            handleSubmit={handleSubmit}
                            item={item}
                            modal={modal}
                            list={list}
                            setModal={setModal}
                            activeItemId={activeItemId}
                            comments={comments} // Pass comments state
                            setComments={setComments} // Pass setter for comments state
                          />
                        )}
                      </>
                    )}
                    <button
                      className="flex items-center text-sm bg-white dark:bg-[#3a3b3c] border-[1px] border-[#00000011] dark:border-[#3a3b3c] rounded-md px-2 py-1 mt-3"
                      onClick={() => handleSubmit(onDeleteMovie(item.id))}
                      disabled={isDeleting}
                    >
                      <FiTrash className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default MovieResult;

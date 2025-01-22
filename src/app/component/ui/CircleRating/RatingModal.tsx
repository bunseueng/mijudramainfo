"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Box, Slider } from "@mui/material";
import { starLabels } from "@/helper/item-list";
import Image from "next/image";
import {
  afraidIcon,
  angryIcon,
  disgustedIcon,
  happyIcon,
  interestedIcon,
  sadIcon,
  suprisedIcon,
} from "@/helper/RatingIcon";
import { createRating, TCreateRating } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import { ITmdbDrama, UserProps } from "@/helper/type";

type RatingModalProps = {
  setModal: Dispatch<SetStateAction<boolean>>;
  modal: boolean;
  id: string;
  user: UserProps | null;
  userRating: any;
  tv: ITmdbDrama;
  tvName: string;
  tvItems: any;
};
const RatingModal = ({
  setModal,
  modal,
  id,
  user,
  userRating,
  tv,
  tvName,
  tvItems,
}: RatingModalProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<number>(
    pathname === `/tv/${id}`
      ? userRating[0]?.rating
        ? userRating[0]?.rating
        : 0
      : userRating?.find((item: any) => item?.tvId === id)?.rating || 0
  );

  const [emoji, setEmoji] = useState<string>(
    pathname === `/tv/${id}`
      ? userRating[0]?.mood
        ? userRating[0]?.mood
        : 0
      : userRating?.find((item: any) => item?.tvId === id)?.mood || ""
  );
  const [emojiImg, setEmojiImg] = useState<string>(
    pathname === `/tv/${id}`
      ? userRating[0]?.emojiImg
        ? userRating[0]?.emojiImg
        : 0
      : userRating?.find((item: any) => item?.tvId === id)?.emojiImg || ""
  );
  const [status, setStatus] = useState<string>(
    pathname === `/tv/${id}`
      ? userRating[0]?.status || ""
      : userRating?.find((item: any) => item?.tvId === id)?.status || ""
  );
  const [episode, setEpisode] = useState<number>(() => {
    if (status === "Completed") {
      return tvItems?.number_of_episodes || 0;
    } else {
      return userRating?.find((item: any) => item?.tvId === id)?.episode || 0;
    }
  });
  const [notes, setNotes] = useState<string>(
    pathname === `/tv/${id}`
      ? userRating[0]?.notes || ""
      : userRating?.find((item: any) => item?.tvId === id)?.notes || ""
  );

  useEffect(() => {
    if (status === "Completed") {
      setEpisode(tvItems?.number_of_episodes || 0);
    } else {
      setEpisode(
        userRating?.find((item: any) => item?.tvId === id)?.episode || 0
      );
    }
  }, [status, tvItems, userRating, id]);

  const {
    register,
    handleSubmit,
    reset,
    formState: {},
  } = useForm<TCreateRating>({
    resolver: zodResolver(createRating),
  });

  const handleChangeRating = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setSelectedRating(newValue);
    }
  };

  const valueLabelFormat = (value: number) => {
    if (value === 1) return "Absolute Trash";
    if (value === 1.5) return "Absolute Trash";
    if (value === 2) return "Garbage";
    if (value === 2.5) return "Garbage";
    if (value === 3) return "Truly Bad";
    if (value === 3.5) return "Truly Bad";
    if (value === 4) return "Not Good";
    if (value === 4.5) return "Not Good";
    if (value === 5) return "Passable";
    if (value === 5.5) return "Passable";
    if (value === 6) return "It's Alright";
    if (value === 6.5) return "It's Alright";
    if (value === 7) return "Pretty Decent";
    if (value === 7.5) return "Pretty Decent";
    if (value === 8) return "Really Good";
    if (value === 8.5) return "Really Good";
    if (value === 9) return "Greatness";
    if (value === 9.5) return "Greatness";
    return "Champion";
  };

  const backgroundImage = (value: number) => {
    if (value >= 1 && value <= 3) {
      return `linear-gradient(90deg, rgba(255,89,144, ${
        value * 1
      }) 0%, rgba(255, 0, 85, ${value - 1}) ${
        value * 1
      }%, rgba(255, 255, 255, 0) ${value * 10}% )`;
    } else if (value >= 3 && value <= 5) {
      return `linear-gradient(90deg, rgb(253 255 148) ${
        value * 1
      }%, rgb(250 255 0) ${value * 6.5}%, rgba(255, 255, 255, 0) ${
        value * 10
      }%);`;
    } else if (value >= 5 && value < 8) {
      return `linear-gradient(90deg, rgb(184 255 220) ${
        value * 1
      }%, rgb(0 255 130) ${value * 9.5}%, rgb(8 255 0 / 0%) ${value * 1}%);`;
    } else if (value >= 8) {
      return `linear-gradient(90deg, rgb(184 255 220) ${
        value * 1
      }%, rgb(0 255 130) ${value * 10}%, rgb(8 255 0 / 0%) ${value * 1}%);`;
    }
    return "";
  };
  const iconSets = [
    { name: "Happy", icons: happyIcon },
    { name: "Interested", icons: interestedIcon },
    { name: "Suprised", icons: suprisedIcon },
    { name: "Sad", icons: sadIcon },
    { name: "Disgusted", icons: disgustedIcon },
    { name: "Afraid", icons: afraidIcon },
    { name: "Angry", icons: angryIcon },
  ];

  const onSubmit = async (data: TCreateRating) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rating/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          rating: selectedRating,
          mood: emoji,
          emojiImg: emojiImg,
          movieId: data?.movieId,
          tvId: id,
          status: status,
          episode: episode,
          notes: notes,
        }),
      });
      if (res.status == 200) {
        setModal(false);
        toast.success("Successfully rating");
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Failed to rate");
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const allPagesSubmit = async (data: TCreateRating) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rating`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          rating: selectedRating,
          mood: emoji,
          emojiImg: emojiImg,
          movieId: data?.movieId,
          tvId: id,
          status: status,
          episode: episode.toString(),
          notes: notes,
        }),
      });
      if (res.status == 200) {
        setModal(false);
        toast.success("Successfully rating");
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Failed to rate");
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImDoneClick = async (data: TCreateRating) => {
    if (pathname === `/tv/${id}`) {
      await onSubmit(data);
    } else {
      await allPagesSubmit(data);
    }
  };

  const deleteRating = async (data: TCreateRating) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rating/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          rating: selectedRating,
          mood: emoji,
          emojiImg: emojiImg,
          movieId: data?.movieId,
          tvId: id,
          status: data?.status,
          episode: data?.episode,
          notes: data?.notes,
        }),
      });
      if (res.status == 200) {
        setModal(false);
        toast.success("Successfully deleted");
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Failed to delete rating");
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRatingAllPages = async (data: TCreateRating) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rating`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          rating: selectedRating,
          mood: emoji,
          emojiImg: emojiImg,
          movieId: data?.movieId,
          tvId: id,
          status: data?.status,
          episode: data?.episode,
          notes: data?.notes,
        }),
      });
      if (res.status == 200) {
        toast.success("Successfully deleted");
        router.refresh();
      } else if (res.status === 500) {
        toast.error("Failed to delete rating");
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (data: TCreateRating) => {
    if (pathname === `/tv/${id}`) {
      await deleteRating(data);
    } else {
      await deleteRatingAllPages(data);
    }
  };

  const handleEpisodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value);
    if (value > tvItems?.number_of_episodes) {
      value = tvItems?.number_of_episodes;
    }
    setEpisode(value);
  };

  return (
    <form className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div
          className="inline-block align-bottom md:align-middle overflow-hidden k-widget k-window k-window-titleless border border-neutral-800/15 rounded-3xl bg-[#F4F4F5] k-display-inline-flex mt-20"
          style={{
            minWidth: "90px",
            minHeight: "50px",
            width: "700px",
            height: "85vh",
            top: "58.2px",
            left: "414px",
            zIndex: "10004",
            transform: "translateY(0px)",
            paddingTop: "0px",
          }}
        >
          <div className="vertical_scroller_wrap should_fade h-full rounded-3xl before:rounded-3xl after:rounded-3xl bg-[#F4F4F5] is_fading_before hide_after">
            <div className="flex sticky z-50">
              <button
                className="absolute right-0 mx-2 my-3 md:mx-5 md:my-5 text-3xl text-[#032541]"
                onClick={() => setModal(!modal)}
              >
                <span className="bg-menu-close glyphicons_v2 flex mr-1 align-text-top text-4xl"></span>
              </button>
            </div>
            <div className="absolute right-0 top-1/3 z-40 flex flex-col gap-y-3 md:gap-y-1 mr-2 md:mr-6">
              <a
                href="#rating"
                className="scrollspy_item group relative flex items-center justify-center p-2 rounded-full bg-transparent before:absolute before:whitespace-nowrap before:right-6 before:rounded-lg before:text-[#032541] before:text-sm before:font-semibold before:pointer-events-none cursor-pointer"
              >
                <span
                  className={`h-2 w-2 rounded-full transition ease-in-out group-hover:bg-[#032541] group-hover:h-6 duration-300 bg-[#032541] ${"#rating"}`}
                ></span>
              </a>
              <a
                href="#mood"
                className="scrollspy_item group relative flex items-center justify-center p-2 rounded-full bg-transparent before:absolute before:whitespace-nowrap before:right-6 before:rounded-lg before:text-[#032541] before:text-sm before:font-semibold before:pointer-events-none cursor-pointer"
              >
                <span className="h-2 w-2 rounded-full transition ease-in-out group-hover:bg-[#032541] group-hover:h-6 duration-300 bg-cyan-700/30"></span>
              </a>
            </div>
            <div className="vertical_scroller no-scrollbar flex flex-col h-full pl-4 pr-8 md:pl-8 md:pr-16 overflow-y-auto overflow-smooth overflow-x-hidden">
              <section id="rating" className="py-6 border-b border-slate-300">
                <div className="w-full">
                  <div>
                    <h3 className="mb-3 font-sans font-bold leading-10 text-[#032541] text-3xl not-italic text-start">
                      Rating
                    </h3>
                    <div className="flex w-full items-end justify-between h-8">
                      <p className="flex italic text-[#032541] text-sm font-semibold">
                        What did you think of {tv?.name || tv?.title || tvName}?
                      </p>
                      <div className="hidden md:flex text-base font-normal items-end align-bottom">
                        <div>
                          <span className="font-bold text-black">
                            User score
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`md:mr-4 my-4 ${
                        status === "Plan to watch" && "cursor-not-allowed"
                      } ${status === "Not interested" && "cursor-not-allowed"}`}
                    >
                      <Box>
                        <Slider
                          {...register("rating")}
                          className="w-[300px] md:w-[620px]"
                          sx={{
                            left: "0px",
                            ".MuiSlider-rail": {
                              backgroundImage: backgroundImage(selectedRating),
                              backgroundColor: "#FFFFFF",
                            },
                          }}
                          value={selectedRating}
                          onChange={handleChangeRating}
                          getAriaValueText={valueLabelFormat}
                          marks={starLabels}
                          step={0.5}
                          min={1}
                          max={10}
                          valueLabelDisplay="on"
                          valueLabelFormat={valueLabelFormat}
                          disabled={
                            status === "Plan to watch" ||
                            status === "Not interested"
                          }
                        />
                      </Box>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between md:justify-end items-center">
                  <p
                    className="inline-flex items-center text-sm italic font-bold text-cyan-600 hover:cursor-pointer"
                    onClick={handleSubmit(handleDelete)}
                  >
                    Clear my rating
                  </p>
                </div>
              </section>
              <section
                id="mood"
                className="flex items-center border-b border-slate-300 text-start"
              >
                <div className="w-full">
                  <div className="pt-6 w-full">
                    <h3 className="mb-3 font-sans font-bold leading-10 text-[#032541] text-3xl not-italic">
                      Mood
                    </h3>
                    <p className="mb-4 italic text-[#032541] text-sm font-semibold">
                      How did {tv?.name || tv?.title || tvName} make you feel?
                    </p>
                    <div>
                      {iconSets?.map((set: any, idx: number) => (
                        <div className="flex flex-col" key={idx}>
                          <div className="flex items-start md:items-center border-b border-slate-500/30 last:border-none mt-3">
                            <span className="text-[#032541] min-w-24 md:min-w-28 font-bold">
                              {set?.name}
                            </span>
                            <ul className="grid grid-cols-[repeat(4,2.5rem)] md:grid-cols-[repeat(6,3.5rem)] gap-b-2 md:gap-y-4 justify-between items-start md:items-center w-full min-h-20 pb-2 md:py-4">
                              {set?.icons?.map((icon: any, idx2: number) => (
                                <li
                                  className="h-[2.5rem] md:h-[3.5rem]"
                                  key={idx2}
                                >
                                  <input
                                    type="text"
                                    className="hidden peer"
                                    id={`icon-${idx}-${idx2}`}
                                    name={`icon-${idx}`}
                                  />
                                  <label
                                    htmlFor={`icon-${idx}-${idx2}`}
                                    className={`group relative inline-flex justify-center items-center whitespace-nowrap px-1 py-1 rounded-full peer-checked:bg-white peer-checked:scale-110 peer-checked:md:scale-125 transform hover:bg-white hover:scale-110 hover:md:scale-125 duration-150 transition ease-in-out hover:drop-shadow-xl peer-checked:drop-shadow-xl cursor-pointer ${
                                      icon?.value === userRating[0]?.mood &&
                                      "transform bg-white scale-110 md:scale-125 duration-150 transition ease-in-out drop-shadow-xl"
                                    } ${
                                      emoji === icon?.value &&
                                      "transform bg-white scale-110 md:scale-125 duration-150 transition ease-in-out drop-shadow-xl"
                                    } ${
                                      icon?.value ===
                                        userRating?.find(
                                          (item: any) => item?.tvId === id
                                        )?.mood &&
                                      "transform bg-white scale-110 md:scale-125 duration-150 transition ease-in-out drop-shadow-xl"
                                    }`}
                                  >
                                    <Image
                                      src={icon?.img}
                                      alt={`icon-${idx}-${idx2}`}
                                      width={100}
                                      height={100}
                                      quality={100}
                                      className="w-8 h-8 md:w-12 md:h-12"
                                      onClick={() => {
                                        if (emoji === icon?.value) {
                                          setEmoji("");
                                          setEmojiImg("");
                                        } else {
                                          setEmoji(icon?.value);
                                          setEmojiImg(icon?.img);
                                        }
                                      }}
                                    />
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
              <section className="flex items-center border-b border-slate-300 text-start">
                <div className="w-full">
                  <div className="pt-6 w-full">
                    <h3 className="mb-3 font-sans font-bold leading-10 text-[#032541] text-3xl not-italic">
                      Details
                    </h3>
                    <p className="mb-4 italic text-[#032541] text-sm font-semibold">
                      Adding Status, Episodes Watched and Notes to{" "}
                      {tv?.name || tv?.title || tvName}.
                    </p>
                    <div className="flex flex-col my-5">
                      <div className="flex items-start my-5">
                        <span className="text-[#032541] min-w-24 md:min-w-28 font-bold">
                          Status
                        </span>
                        <select
                          {...register("status")}
                          name="status"
                          id="status"
                          className="w-[50%] bg-white text-[#46494a] border-2 border-slate-200 outline-none py-2 px-4"
                          defaultValue={
                            userRating?.find((item: any) => item?.tvId === id)
                              ?.status
                          }
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="Currently Watching">
                            Currently Watching
                          </option>
                          <option value="Completed">Completed</option>
                          <option value="Plan to watch">Plan to watch</option>
                          <option value="On-hold">On-hold</option>
                          <option value="Dropped">Dropped</option>
                          <option value="Not interested">Not interested</option>
                        </select>
                      </div>

                      <div className="flex items-start my-5">
                        <span
                          className={`text-[#032541] min-w-24 md:min-w-28 font-bold pr-10 ${
                            status === "Completed" &&
                            "text-[#00000099] transform duration-300 opacity-50"
                          } ${
                            status === "Plan to watch" &&
                            "text-[#00000099] transform duration-300 opacity-50"
                          } ${
                            status === "Not interested" &&
                            "text-[#00000099] transform duration-300 opacity-50"
                          }`}
                        >
                          Episodes Watched
                        </span>
                        <div className="flex items-center">
                          <input
                            {...register("episode")}
                            type="number"
                            max={tvItems?.number_of_episodes}
                            value={episode}
                            onChange={handleEpisodeChange}
                            className={`appearance-none w-20 bg-white text-black border-2 border-slate-300 outline-none py-2 px-4 focus:ring-blue-500 focus:border-blue-500 block dark:focus:ring-blue-500 dark:focus:border-blue-500 transform duration-300 ${
                              status === "Completed" &&
                              "text-[#00000099] opacity-50 bg-[#f5f7fa] border-[#dcdfe6] cursor-not-allowed"
                            } ${
                              status === "Plan to watch" &&
                              "text-[#00000099] opacity-50 bg-[#f5f7fa] border-[#dcdfe6] cursor-not-allowed"
                            } ${
                              status === "Not interested" &&
                              "text-[#00000099] opacity-50 bg-[#f5f7fa] border-[#dcdfe6] cursor-not-allowed"
                            }`}
                            disabled={
                              status === "Completed" ||
                              status === "Plan to watch" ||
                              status === "Not interested"
                            }
                          />
                          <div className="ml-2 cursor-default">
                            <span
                              className={`text-[#373a3c] font-bold ${
                                status === "Completed" &&
                                "text-[#00000099] transform duration-300 opacity-50 font-semibold"
                              } ${
                                status === "Plan to watch" &&
                                "text-[#00000099] transform duration-300 opacity-50 font-semibold"
                              } ${
                                status === "Not interested" &&
                                "text-[#00000099] transform duration-300 opacity-50 font-semibold"
                              }`}
                            >
                              +
                            </span>
                            <span
                              className={`text-[#373a3c] font-bold ${
                                status === "Completed" &&
                                "text-[#00000099] transform duration-300 opacity-50 font-semibold"
                              } ${
                                status === "Plan to watch" &&
                                "text-[#00000099] transform duration-300 opacity-50 font-semibold"
                              } ${
                                status === "Not interested" &&
                                "text-[#00000099] transform duration-300 opacity-50 font-semibold"
                              }`}
                            >
                              {" "}
                              / {tvItems?.number_of_episodes}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start my-5">
                        <span className="text-[#032541] min-w-24 md:min-w-28 font-bold pr-10">
                          Notes
                        </span>
                        <textarea
                          {...register("notes")}
                          name="notes"
                          id="notes"
                          className="w-full bg-white text-[#46494a] border-2 border-slate-200 outline-none focus:ring-blue-500 focus:border-blue-500 block dark:focus:ring-blue-500 dark:focus:border-blue-500 transform duration-300 px-4 py-2"
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder={
                            userRating?.find((item: any) => item?.tvId === id)
                              ?.notes
                          }
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <button
              className="flex absolute right-0 bottom-0 z-50 w-fit my-4 mx-4 px-4 md:px-5 py-1 md:py-2 justify-center items-center shadow-2xl rounded-full bg-gradient-to-r from-emerald-900 to-[#032541] cursor-pointer"
              onClick={handleSubmit(handleImDoneClick)}
            >
              <span className="bg-glyphicons_v2 glyphicons_v2 md:flex mr-1 align-text-top text-xl"></span>
              <span className="text-white font-sans text-lg md:text-xl font-semibold md:font-bold">
                {!loading ? "Im Done" : "Submitting..."}
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RatingModal;

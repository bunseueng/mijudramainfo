"use client";

import React, { useEffect, useState } from "react";
import { PersonEditList } from "../details/PersonEditList";
import {
  FaCircleQuestion,
  FaFacebook,
  FaSquareShareNodes,
  FaTwitter,
  FaWeibo,
  FaYoutube,
} from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { PiInstagramLogoBold } from "react-icons/pi";
import { BiLogoTiktok } from "react-icons/bi";
import { AiFillTikTok } from "react-icons/ai";
import { IoIosUnlock } from "react-icons/io";
import { FaImdb, FaRegTrashAlt } from "react-icons/fa";
import { SiTrakt, SiWikidata } from "react-icons/si";
import Image from "next/image";
import {
  fetchPerson,
  fetchPersonExternalID,
  fetchPersonSearch,
} from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { CreatePersonDetails, TCreatePersonDetails } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { PersonExternalID } from "@/helper/type";
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter } from "next/navigation";

const PersonExternalLink: React.FC<PersonEditList> = ({
  person_id,
  personDB,
}) => {
  const { data: person } = useQuery({
    queryKey: ["personEdit", person_id],
    queryFn: () => fetchPerson(person_id),
  });
  const { data: getFullDetails } = useQuery({
    queryKey: ["getFullDetails", person?.name],
    queryFn: () => fetchPersonSearch(person?.name),
  });
  const { data: personExternalID } = useQuery({
    queryKey: ["personExternalID", person_id],
    queryFn: () => fetchPersonExternalID(person_id),
  });
  const { register, handleSubmit, reset, control } =
    useForm<TCreatePersonDetails>({
      resolver: zodResolver(CreatePersonDetails),
    });
  const router = useRouter();
  const [detailDB]: PersonExternalID[] = (personDB?.external_links ||
    []) as unknown as PersonExternalID[];
  const [loading, setLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const initialFacebook =
    detailDB?.facebook_id || personExternalID?.facebook_id;
  const initialInstagram =
    detailDB?.instagram_id || personExternalID?.instagram_id;
  const initialTiktok = detailDB?.tiktok_id || personExternalID?.tiktok_id;
  const initialDouyin = detailDB?.douyin_id;
  const initialTwitter = detailDB?.twitter_id || personExternalID?.twitter_id;
  const initialWeibo = detailDB?.weibo_id;
  const initialYoutube = detailDB?.youtube_id || personExternalID?.youtube_id;
  const initialIMDB = detailDB?.imdb_id || personExternalID?.imdb_id;
  const initialWikidata =
    detailDB?.wikidata_id || personExternalID?.wikidata_id;
  const initialTrakt = detailDB?.trakt_id;
  const initialMdl = detailDB?.mdl_id;
  const [currentFacebook, setCurrentFacebook] = useState(initialFacebook);
  const [currentInstagram, setCurrentInstagram] = useState(initialInstagram);
  const [currentTiktok, setCurrentTiktok] = useState(initialTiktok);
  const [currentDouyin, setCurrentDouyin] = useState(initialDouyin);
  const [currentTwitter, setCurrentTwitter] = useState(initialTwitter);
  const [currentWeibo, setCurrentWeibo] = useState(initialWeibo);
  const [currentYoutube, setCurrentYoutube] = useState(initialYoutube);
  const [currentIMDB, setCurrentIMDB] = useState(initialIMDB);
  const [currentWikidata, setCurrentWikidata] = useState(initialWikidata);
  const [currentTrakt, setCurrentTrakt] = useState(initialTrakt);
  const [currentMdl, setCurrentMdl] = useState(initialMdl);
  const originalFacebook = initialFacebook;
  const originalInstagram = initialInstagram;
  const originalTiktok = initialTiktok;
  const originalDouyin = initialDouyin;
  const originalTwitter = initialTwitter;
  const originalWeibo = initialWeibo;
  const originalYoutube = initialYoutube;
  const originalIMDB = initialIMDB;
  const originalWikidata = initialWikidata;
  const originalTrakt = initialTrakt;
  const originalMdl = initialMdl;
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  useEffect(() => {
    const hasChanged =
      (currentFacebook || null) !== (originalFacebook || null) ||
      (currentInstagram || null) !== (originalInstagram || null) ||
      (currentTiktok || null) !== (originalTiktok || null) ||
      (currentDouyin || null) !== (originalDouyin || null) ||
      (currentTwitter || null) !== (originalTwitter || null) ||
      (currentWeibo || null) !== (originalWeibo || null) ||
      (currentYoutube || null) !== (originalYoutube || null) ||
      (currentIMDB || null) !== (originalIMDB || null) ||
      (currentWikidata || null) !== (originalWikidata || null) ||
      (currentTrakt || null) !== (originalTrakt || null) ||
      (currentMdl || null) !== (originalMdl || null);

    setIsSubmitEnabled(hasChanged);
  }, [
    currentFacebook,
    currentInstagram,
    currentTiktok,
    currentDouyin,
    currentTwitter,
    currentWeibo,
    currentYoutube,
    currentIMDB,
    currentWikidata,
    currentTrakt,
    currentMdl,
    originalFacebook,
    originalInstagram,
    originalTiktok,
    originalDouyin,
    originalTwitter,
    originalWeibo,
    originalYoutube,
    originalIMDB,
    originalWikidata,
    originalTrakt,
    originalMdl,
  ]);

  useEffect(() => {
    setCurrentFacebook(initialFacebook);
    setCurrentInstagram(initialInstagram);
    setCurrentTiktok(initialTiktok);
    setCurrentDouyin(initialDouyin);
    setCurrentTwitter(initialTwitter);
    setCurrentWeibo(initialWeibo);
    setCurrentYoutube(initialYoutube);
    setCurrentIMDB(initialIMDB);
    setCurrentWikidata(initialWikidata);
    setCurrentTrakt(initialTrakt);
    setCurrentMdl(initialMdl);
  }, [
    initialFacebook,
    initialInstagram,
    initialTiktok,
    initialDouyin,
    initialTwitter,
    initialWeibo,
    initialYoutube,
    initialIMDB,
    initialWikidata,
    initialTrakt,
    initialMdl,
  ]);

  const onSubmit = async (data: TCreatePersonDetails) => {
    try {
      setLoading(true);
      // Flatten and ensure all items are strings
      const res = await fetch(`/api/person/${person_id}/external_links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personId: person_id.toString(),
          external_links: [
            {
              facebook_id:
                currentFacebook === ""
                  ? null
                  : initialFacebook || data?.external_links?.facebook,
              instagram_id:
                currentInstagram === ""
                  ? null
                  : initialInstagram || data?.external_links?.instagram,
              tiktok_id:
                currentTiktok === ""
                  ? null
                  : initialTiktok || data?.external_links?.tiktok,
              douyin_id:
                currentDouyin === ""
                  ? null
                  : initialDouyin || data?.external_links?.douyin,
              twitter_id:
                currentTwitter === ""
                  ? null
                  : initialTwitter || data?.external_links?.twitter,
              weibo_id:
                currentWeibo === ""
                  ? null
                  : initialWeibo || data?.external_links?.weibo,
              youtube_id:
                currentYoutube === ""
                  ? null
                  : initialYoutube || data?.external_links?.youtube,
              IMDB_id:
                currentIMDB === ""
                  ? null
                  : initialIMDB || data?.external_links?.IMDB,
              wikidata_id:
                currentWikidata === ""
                  ? null
                  : initialWikidata || data?.external_links?.wikidata,
              trakt_id:
                currentTrakt === ""
                  ? null
                  : initialTrakt || data?.external_links?.trakt,
              mdl_id:
                currentMdl === ""
                  ? null
                  : initialMdl || data?.external_links?.mdl,
            },
          ],
        }),
      });
      if (res.status === 200) {
        router?.refresh();
        reset();
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

  const handleReset = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      setResetLoading(true);
      // Simulate a delay for the reset operation
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // reset logic here
      reset();
      setCurrentFacebook(originalFacebook);
      setCurrentInstagram(originalInstagram);
      setCurrentTiktok(originalTiktok);
      setCurrentDouyin(originalDouyin);
      setCurrentTwitter(originalTwitter);
      setCurrentWeibo(originalWeibo);
      setCurrentYoutube(originalYoutube);
      setCurrentIMDB(originalIMDB);
      setCurrentWikidata(originalWikidata);
      setCurrentTrakt(originalTrakt);
      setCurrentMdl(originalMdl);
    } catch (error) {
      console.error("Error resetting:", error);
    } finally {
      setResetLoading(false);
    }
  };

  console.log(initialDouyin);
  return (
    <form className="py-3 px-2 md:px-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="inline-flex">
        <h1 className="text-[#1675b6] text-xl font-bold mb-6 pl-3 pr-1">
          Social
        </h1>
        <FaCircleQuestion size={15} className="mt-1.5" />
      </div>
      <div className="w-full inline-flex">
        <div className="w-[50%] mb-5 px-1 md:px-3">
          <label htmlFor="facebook">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center">
                <FaFacebook />
                <span className="font-bold px-2">Facebook</span>
                {initialFacebook !== null ? (
                  <a
                    href={`https://www.facebook.com/${initialFacebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaSquareShareNodes />
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/search?q=${getFullDetails?.results[0]?.original_name}+Facebook`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IoSearch />
                  </a>
                )}
              </div>
              <div>
                <IoIosUnlock />
              </div>
            </div>
          </label>
          <div className="inline-block relative w-full mt-1">
            <input
              {...register("external_links.facebook")}
              name="external_links.facebook"
              type="text"
              className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none focus:border-[#01b4e4] transform duration-300 py-2 px-4"
              onChange={(e) => setCurrentFacebook(e.target.value)}
              defaultValue={initialFacebook}
            />
          </div>
          <small className="text-xs md:text-sm text-muted-foreground opacity-80">
            e.g. https://facebook.com/USERNAME
          </small>
        </div>

        <div className="w-[50%] mb-5 px-1 md:px-3">
          <label htmlFor="instagram">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center">
                <PiInstagramLogoBold />
                <span className="font-bold px-2">Instagram</span>
                {initialInstagram !== null ? (
                  <a
                    href={`https://www.instagram.com/${initialInstagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaSquareShareNodes />
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/search?q=${getFullDetails?.results[0]?.original_name}+Instagram`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IoSearch />
                  </a>
                )}
              </div>
              <div>
                <IoIosUnlock />
              </div>
            </div>
          </label>
          <div className="inline-block relative w-full mt-1">
            <input
              {...register("external_links.instagram")}
              name="external_links.instagram"
              type="text"
              className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none focus:border-[#01b4e4] transform duration-300 py-2 px-4"
              onChange={(e) => setCurrentInstagram(e.target.value)}
              defaultValue={initialInstagram}
            />
          </div>
          <small className="text-xs md:text-sm text-muted-foreground opacity-80">
            e.g. https://www.instagram.com/USERNAME
          </small>
        </div>
      </div>
      <div className="w-full inline-flex">
        <div className="w-[50%] mb-5 px-1 md:px-3">
          <label htmlFor="tiktok">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center">
                <BiLogoTiktok />
                <span className="font-bold px-2">Tiktok</span>
                {initialTiktok !== null ? (
                  <a
                    href={`https://www.tiktok.com/@${initialTiktok}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaSquareShareNodes />
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/search?q=${getFullDetails?.results[0]?.original_name}+Tiktok`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IoSearch />
                  </a>
                )}
              </div>
              <div>
                <IoIosUnlock />
              </div>
            </div>
          </label>
          <div className="inline-block relative w-full mt-1">
            <input
              {...register("external_links.tiktok")}
              name="external_links.tiktok"
              type="text"
              className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none focus:border-[#01b4e4] transform duration-300 py-2 px-4"
              onChange={(e) => setCurrentTiktok(e.target.value)}
              defaultValue={initialTiktok}
            />
          </div>

          <small className="text-xs md:text-sm text-muted-foreground opacity-80">
            e.g. https://www.tiktok.com/USERNAME (No need to add @)
          </small>
        </div>

        <div className="w-[50%] mb-5 px-1 md:px-3">
          <label htmlFor="douyin">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center">
                <AiFillTikTok />
                <span className="font-bold px-2">Douyin</span>
                {initialDouyin !== null &&
                initialDouyin !== "" &&
                initialDouyin !== undefined ? (
                  <a
                    href={`https://www.douyin.com/user/${initialDouyin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaSquareShareNodes />
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/search?q=${getFullDetails?.results[0]?.original_name}+Douyin`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IoSearch />
                  </a>
                )}
              </div>
              <div>
                <IoIosUnlock />
              </div>
            </div>
          </label>
          <div className="inline-block relative w-full mt-1">
            <input
              {...register("external_links.douyin")}
              name="external_links.douyin"
              type="text"
              className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none focus:border-[#01b4e4] transform duration-300 py-2 px-4"
              onChange={(e) => setCurrentDouyin(e.target.value)}
              defaultValue={initialDouyin as string | number}
            />
          </div>
          <small className="text-xs md:text-sm text-muted-foreground opacity-80">
            e.g. https://www.douyin.com/user/ID
          </small>
        </div>
      </div>
      <div className="w-full inline-flex">
        <div className="w-[50%] mb-5 px-1 md:px-3">
          <label htmlFor="twitter">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center">
                <FaTwitter />
                <span className="font-bold px-2">Twitter</span>
                {initialTwitter !== null ? (
                  <a
                    href={`https://x.com/"${initialTwitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaSquareShareNodes />
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/search?q=${getFullDetails?.results[0]?.original_name}+Twitter`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IoSearch />
                  </a>
                )}
              </div>
              <div>
                <IoIosUnlock />
              </div>
            </div>
          </label>
          <div className="inline-block relative w-full mt-1">
            <input
              {...register("external_links.twitter")}
              name="external_links.twitter"
              type="text"
              className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none focus:border-[#01b4e4] transform duration-300 py-2 px-4"
              onChange={(e) => setCurrentTwitter(e.target.value)}
              defaultValue={initialTwitter}
            />
          </div>
          <small className="text-xs md:text-sm text-muted-foreground opacity-80">
            e.g. https://twitter.com/USERNAME
          </small>
        </div>

        <div className="w-[50%] mb-5 px-1 md:px-3">
          <label htmlFor="weibo">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center">
                <FaWeibo />
                <span className="font-bold px-2">Weibo</span>
                {initialWeibo !== null &&
                initialWeibo !== "" &&
                initialWeibo !== undefined ? (
                  <a
                    href={`https://m.weibo.cn/u/${initialWeibo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaSquareShareNodes />
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/search?q=${getFullDetails?.results[0]?.original_name}+Weibo`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IoSearch />
                  </a>
                )}
              </div>
              <div>
                <IoIosUnlock />
              </div>
            </div>
          </label>
          <div className="inline-block relative w-full mt-1">
            <input
              {...register("external_links.weibo")}
              name="external_links.weibo"
              type="text"
              className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none focus:border-[#01b4e4] transform duration-300 py-2 px-4"
              onChange={(e) => setCurrentWeibo(e.target.value)}
              defaultValue={initialWeibo as string | number}
            />
          </div>
          <small className="text-xs md:text-sm text-muted-foreground opacity-80">
            e.g. https://m.weibo.cn/u/ID
          </small>
        </div>
      </div>
      <div className="w-[50%] mb-5 px-1 md:px-3">
        <label htmlFor="youtube">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center">
              <FaYoutube />
              <span className="font-bold px-2">Youtube</span>
              {initialYoutube !== null ? (
                <a
                  href={`https://www.youtube.com/${initialYoutube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaSquareShareNodes />
                </a>
              ) : (
                <a
                  href={`https://www.google.com/search?q=${getFullDetails?.results[0]?.original_name}+Youtube`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IoSearch />
                </a>
              )}
            </div>
            <div>
              <IoIosUnlock />
            </div>
          </div>
        </label>
        <div className="inline-block relative w-full mt-1">
          <input
            {...register("external_links.youtube")}
            name="external_links.youtube"
            type="text"
            className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none focus:border-[#01b4e4] transform duration-300 py-2 px-4"
          />
        </div>
        <small className="text-xs md:text-sm text-muted-foreground opacity-80">
          e.g. https://www.youtube.com/ID
        </small>
      </div>
      <h1 className="text-[#1675b6] text-xl font-bold border-b-[1px] border-stone-300 mb-6 mt-8 pl-3 pr-1">
        Other Database
      </h1>
      <div className="w-full inline-flex mb-5">
        <div className="w-[50%] mb-5 px-1 md:px-3">
          <label htmlFor="IMDB">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center">
                <FaImdb />
                <span className="font-bold px-2">IMDB ID</span>
                {initialIMDB !== null ? (
                  <a
                    href={`https://www.imdb.com/name/${initialIMDB}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaSquareShareNodes />
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/search?q=${getFullDetails?.results[0]?.original_name}+IMDB`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IoSearch />
                  </a>
                )}
              </div>
              <div>
                <IoIosUnlock />
              </div>
            </div>
          </label>
          <div className="inline-block relative w-full mt-1">
            <input
              {...register("external_links.IMDB")}
              name="external_links.IMDB"
              type="text"
              className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none focus:border-[#01b4e4] transform duration-300 py-2 px-4"
              onChange={(e) => setCurrentIMDB(e.target.value)}
              defaultValue={initialIMDB}
            />
          </div>
          <small className="text-xs md:text-sm text-muted-foreground opacity-80">
            e.g. https://www.imdb.com/name/ID
          </small>
        </div>

        <div className="w-[50%] mb-5 px-1 md:px-3">
          <label htmlFor="instagram">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center">
                <SiWikidata />
                <span className="font-bold px-2">Wikidata ID</span>
                {initialWikidata !== null ? (
                  <a
                    href={`https://www.wikidata.org/wiki/${initialWikidata}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaSquareShareNodes />
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/search?q=${getFullDetails?.results[0]?.original_name}+Wikidata`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IoSearch />
                  </a>
                )}
              </div>
              <div>
                <IoIosUnlock />
              </div>
            </div>
          </label>
          <div className="inline-block relative w-full mt-1">
            <input
              {...register("external_links.wikidata")}
              name="external_links.wikidata"
              type="text"
              className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none focus:border-[#01b4e4] transform duration-300 py-2 px-4"
              onChange={(e) => setCurrentWikidata(e.target.value)}
              defaultValue={initialWikidata}
            />
          </div>
          <small className="text-xs md:text-sm text-muted-foreground opacity-80">
            e.g. https://www.wikidata.org/wiki/ID
          </small>
        </div>
      </div>
      <div className="w-full inline-flex">
        <div className="w-[50%] mb-5 px-1 md:px-3">
          <label htmlFor="trakt">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center">
                <SiTrakt />
                <span className="font-bold px-2">TRAKT</span>
                {initialTrakt !== null &&
                initialTrakt !== "" &&
                initialTrakt !== undefined ? (
                  <a
                    href={`https://trakt.tv/shows/${initialTrakt}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaSquareShareNodes />
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/search?q=${getFullDetails?.results[0]?.original_name}+TRAKT`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IoSearch />
                  </a>
                )}
              </div>
              <div>
                <IoIosUnlock />
              </div>
            </div>
          </label>
          <div className="inline-block relative w-full mt-1">
            <input
              {...register("external_links.trakt")}
              name="external_links.trakt"
              type="text"
              className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none focus:border-[#01b4e4] transform duration-300 py-2 px-4"
              onChange={(e) => setCurrentTrakt(e.target.value)}
              defaultValue={initialTrakt as string | number}
            />
          </div>
          <small className="text-xs md:text-sm text-muted-foreground opacity-80">
            e.g. https://trakt.tv/shows/ID
          </small>
        </div>

        <div className="w-[50%] mb-5 px-1 md:px-3">
          <label htmlFor="mdl">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center">
                <Image
                  src="/mdl.webp"
                  alt="mdl image"
                  width={100}
                  height={100}
                  className="w-4 h-4"
                />
                <span className="font-bold px-2">MyDramaList</span>
                {initialMdl !== null &&
                initialMdl !== "" &&
                initialMdl !== undefined ? (
                  <a
                    href={`https://mydramalist.com/people/${initialMdl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaSquareShareNodes />
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/search?q=${getFullDetails?.results[0]?.original_name}+MyDramaList`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IoSearch />
                  </a>
                )}
              </div>
              <div>
                <IoIosUnlock />
              </div>
            </div>
          </label>
          <div className="inline-block relative w-full mt-1">
            <input
              {...register("external_links.mdl")}
              name="external_links.mdl"
              type="text"
              className="w-full bg-white text-black dark:text-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] rounded-md outline-none focus:border-[#01b4e4] transform duration-300 py-2 px-4"
              onChange={(e) => setCurrentMdl(e.target.value)}
              defaultValue={initialMdl as string | number}
            />
          </div>
          <small className="text-xs md:text-sm text-muted-foreground opacity-80">
            e.g. https://mydramalist.com/people/ID
          </small>
        </div>
      </div>
      <div className="inline-flex mt-5">
        <button
          type="submit"
          className={`flex items-center text-white bg-[#5cb85c] border-[1px] border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 mr-5 ${
            isSubmitEnabled
              ? "cursor-pointer"
              : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
          }`}
          disabled={isSubmitEnabled ? false : true}
        >
          <span className="mr-1 pt-1">
            <ClipLoader color="#fff" loading={loading} size={19} />
          </span>
          Submit
        </button>
        <button
          className={`flex items-center text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
            isSubmitEnabled
              ? "cursor-pointer"
              : "hover:text-[#c0c4cc] border-[#ebeef5] cursor-not-allowed"
          }`}
          onClick={(e) => handleReset(e)}
          disabled={isSubmitEnabled ? false : true}
        >
          {resetLoading ? (
            <span className="pt-1 mr-1">
              <ClipLoader color="#dcdfe6" loading={!loading} size={19} />
            </span>
          ) : (
            <span className="mr-1">
              <FaRegTrashAlt />
            </span>
          )}
          Reset
        </button>
      </div>
    </form>
  );
};

export default PersonExternalLink;

//adn-259

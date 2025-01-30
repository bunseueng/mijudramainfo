"use client";

import {
  EditDramaPage,
  EditPageDefaultvalue,
  Movie,
  movieId,
} from "@/helper/type";
import { createDetails, TCreateDetails } from "@/helper/zod";
import { useMovieData } from "@/hooks/useMovieData";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, Reorder } from "framer-motion";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { toast } from "react-toastify";
const TvAddModal = dynamic(
  () => import("@/app/component/ui/Modal/TvAddModal"),
  { ssr: false }
);
const TvEditModal = dynamic(
  () => import("@/app/component/ui/Modal/TvEditModal"),
  { ssr: false }
);
interface Provider {
  display_priority: number;
  provider_name: string;
  provider_id: number;
  logo_path: string;
}

interface ProviderWithServiceType extends Provider {
  service_type: string;
}
const MovieServices: React.FC<movieId & Movie> = ({
  movie_id,
  movieDetails,
}) => {
  const { movie } = useMovieData(movie_id);
  const watchProvider = useMemo(
    () => movie["watch/providers"]?.results || [],
    [movie]
  );
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const combinedProviders: ProviderWithServiceType[] = useMemo(() => {
    return [
      ...(selectedProvider?.free?.map((provider: Provider) => ({
        ...provider,
        service_type: "Free",
      })) || []),
      ...(selectedProvider?.rent?.map((provider: Provider) => ({
        ...provider,
        service_type: "Pay Per View",
      })) || []),
      ...(selectedProvider?.ads?.map((provider: Provider) => ({
        ...provider,
        service_type: "Advertisement",
      })) || []),
      ...(selectedProvider?.buy?.map((provider: Provider) => ({
        ...provider,
        service_type: "Purchase",
      })) || []),
      ...(selectedProvider?.flatrate?.map((provider: Provider) => ({
        ...provider,
        service_type: "Subscription",
      })) || []),
    ];
  }, [selectedProvider]);
  const [storedData, setStoredData] = useState<EditDramaPage[]>([]);
  const [tvDatabase, setTvDatabase] = useState<any>(
    (movieDetails?.services?.length || 0) > 0
      ? movieDetails?.services
      : combinedProviders
  );

  const [drama, setDrama] = useState<EditDramaPage[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [defaultValues, setDefaultValues] = useState<EditPageDefaultvalue>();
  const [isItemDataChanged, setIsItemDataChanged] = useState<boolean[]>(
    Array(movieDetails?.services?.length || 0).fill(false)
  );
  const [markedForDeletion, setMarkedForDeletion] = useState<boolean[]>(
    Array(movieDetails?.services?.length || 0).fill(false)
  );
  const [originalValue, setOriginalValue] = useState(null);
  const [isDragging, setIsDragging] = useState(false); // Track drag state
  const [hasReordered, setHasReordered] = useState(false); // Track if order has been changed
  const { handleSubmit, reset } = useForm<TCreateDetails>({
    resolver: zodResolver(createDetails),
  });
  const router = useRouter();
  useEffect(() => {
    // Check if both movieDetails.services and combinedProviders have values before updating tvDatabase
    if ((movieDetails?.services?.length || 0) > 0) {
      setTvDatabase(movieDetails?.services || []);
    } else {
      setTvDatabase(combinedProviders);
    }
  }, [movieDetails?.services, combinedProviders]);

  useEffect(() => {
    if ((movieDetails?.services?.length || 0) < 0) {
      const combinedData = [
        ...(tvDatabase || []),
        ...storedData.filter((data) => data !== undefined),
      ];
      setDrama(combinedData);
    } else {
      if (!movie) return;
      const combinedData = [
        ...(tvDatabase || []),
        ...storedData.filter((data) => data !== undefined),
      ];
      setDrama(combinedData);
    }
  }, [movie, movieDetails?.services, storedData, tvDatabase, selectedProvider]);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const requestData = {
        movie_id: movie_id.toString(),
        services: markedForDeletion.includes(true)
          ? selectedProvider?.ads?.filter(
              (item: any, idx: number) =>
                !markedForDeletion[idx] &&
                item?.provider_name !== defaultValues?.provider_name
            )
          : drama?.map((item) => ({
              ...item,
            })),
      };

      const res = await fetch(`/api/movie/${movie_id}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (res.status === 200) {
        router.refresh();
        setStoredData([]);
        setMarkedForDeletion(Array(drama?.length || 0).fill(false));
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

  const handleOpenModal = (idx: number) => {
    setDeleteIndex(idx);
    setOpenEditModal(true);
    setDefaultValues({
      provider_name: drama[idx]?.provider_name,
      service_type: drama[idx]?.service_type,
      link: drama[idx]?.link || selectedProvider?.link,
      availability: drama[idx]?.availability,
      subtitles: drama[idx]?.subtitles || "English",
    });
  };

  useEffect(() => {
    if (tvDatabase?.length > 0) {
      setOriginalValue(tvDatabase);
    } else if (storedData?.length > 0) {
      setOriginalValue(storedData as any);
    }
  }, [tvDatabase, combinedProviders, storedData]);
  const handleResetItem = (idx: number) => {
    setMarkedForDeletion((prev) =>
      prev.map((marked, index) => (index === idx ? false : marked))
    );
    setIsItemDataChanged((prev) =>
      prev.map((changed, index) => (index === idx ? false : changed))
    );
    setDrama(originalValue as any);
  };
  // Function to get user country based on IP
  const getUserCountry = async () => {
    try {
      const res = await fetch("https://ipinfo.io/json?token=80e3bb75bb316a", {
        method: "GET",
      });
      const data = await res.json();
      return data.country; // e.g., "US"
    } catch (error) {
      console.error("Error fetching user location:", error);
      return null;
    }
  };

  const handleReorder = (newOrder: any) => {
    setDrama(newOrder); // Update the reordered items
  };

  const handleDragStart = () => {
    setIsDragging(true); // Set dragging state to true when any item starts dragging
  };

  const handleDragEnd = () => {
    setIsDragging(false); // Set dragging state to false after dragging ends
    // Check if the current order is different from the original order
    if (JSON.stringify(drama) !== JSON.stringify(originalValue)) {
      setHasReordered(true); // Set to true if items have been reordered
    }
  };

  const handleResetChanges = async (idx: number) => {
    try {
      setResetLoading(true);
      // Simulate a delay for the reset operation
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setMarkedForDeletion((prev) =>
        prev.map((marked, index) => (index === idx ? false : marked))
      );
      setIsItemDataChanged((prev) =>
        prev.map((changed, index) => (index === idx ? false : changed))
      );
      setHasReordered(false);
      setDrama(originalValue as any);
    } catch (error) {
      console.error(error);
    } finally {
      setResetLoading(false);
    }
  };

  // Fetch user location and set the watch provider
  useEffect(() => {
    const fetchCountryAndSetProvider = async () => {
      const country = await getUserCountry();
      if (country && watchProvider && watchProvider[country]) {
        setSelectedProvider(watchProvider[country]);
      } else {
        setSelectedProvider(watchProvider?.US); // Default to US if no match
      }
    };

    fetchCountryAndSetProvider();
  }, [watchProvider]);

  return (
    <form className="py-3 px-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-[#1675b6] text-xl font-bold mb-6 px-3">Services</h1>
      <div className="text-left">
        <table
          className="w-full max-w-full border-collapse bg-transparent mb-4"
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr>
              <th
                className="border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-2 border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4"
                style={{ width: "200px" }}
              >
                Service
              </th>
              <th
                className="border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-2 border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4"
                style={{ width: "150px" }}
              >
                Page Link
              </th>
              <th
                className="border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-2 border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4"
                style={{ width: "150px" }}
              >
                Service Type
              </th>
              <th
                className="border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-2 border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4"
                style={{ width: "250px" }}
              >
                Availability
              </th>
              <th className="border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] border-[#06090c21] dark:border-[#3e4042] border-b-2 border-b-[#06090c21] dark:border-b-[#3e4042] align-bottom text-left py-2 px-4"></th>
            </tr>
          </thead>
          <Reorder.Group as="tbody" values={drama} onReorder={handleReorder}>
            <AnimatePresence>
              {drama?.map((show: any, idx: number) => {
                const subtitle =
                  Array.isArray(show?.subtitles) &&
                  show?.subtitles?.map((sub: any) => sub?.label);
                const getServiceImage = () => {
                  if (show?.service_logo) {
                    return `/channel${show.service_logo}`; // Use service_logo if available
                  } else if (show?.logo_path) {
                    return `https://image.tmdb.org/t/p/w154/${show.logo_path}`; // Fallback to TMDB logo
                  } else {
                    return show?.service_url; // Last resort
                  }
                };
                const serviceImage = getServiceImage();
                return (
                  <Reorder.Item
                    as="tr"
                    value={show}
                    key={
                      (movieDetails?.services?.length || 0) > 0
                        ? show?.id
                        : show?.service_type + show?.provider_name
                    }
                    className="relative w-full h-auto overflow-hidden"
                    whileDrag={{
                      scale: 1.0,
                      boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
                      backgroundColor: "#c2e7b0",
                    }}
                    style={{ display: "table-row" }}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <td className="border-[#78828c0b] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3">
                      <div className="flex items-start">
                        <Image
                          src={serviceImage}
                          alt={show?.provider_name}
                          width={40}
                          height={40}
                          quality={100}
                          priority
                          className="w-10 h-10 bg-cover bg-center object-cover rounded-full pointer-events-none"
                        />
                        <p
                          className={`pl-2 font-semibold ${
                            storedData.some((item) => item === show)
                              ? "text-[#5cb85c]"
                              : ""
                          } ${isItemDataChanged[idx] ? "text-[#2196f3]" : ""} ${
                            markedForDeletion[idx] ? "text-red-500" : ""
                          }`}
                        >
                          {show?.provider_name}
                        </p>
                      </div>
                    </td>
                    <td className="border-[#78828c0b] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3">
                      <p
                        className={`break-words h-auto ${
                          storedData.some((item) => item === show)
                            ? "text-[#5cb85c]"
                            : ""
                        } ${isItemDataChanged[idx] ? "text-[#2196f3]" : ""} ${
                          markedForDeletion[idx] ? "text-red-500" : ""
                        }`}
                      >
                        {show?.link ? show?.link : selectedProvider?.link}
                      </p>
                    </td>
                    <td
                      className={`border-[#78828c0b] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3 ${
                        storedData.some((item) => item === show)
                          ? "text-[#5cb85c]"
                          : ""
                      } ${isItemDataChanged[idx] ? "text-[#2196f3]" : ""} ${
                        markedForDeletion[idx] ? "text-red-500" : ""
                      }`}
                    >
                      {show?.service_type}
                    </td>
                    <td
                      className={`border-[#78828c0b] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3 ${
                        storedData.some((item) => item === show)
                          ? "text-[#5cb85c]"
                          : ""
                      } ${isItemDataChanged[idx] ? "text-[#2196f3]" : ""} ${
                        markedForDeletion[idx] ? "text-red-500" : ""
                      }`}
                    >
                      <div className="font-semibold">Availability</div>
                      {show?.availability?.length > 0 ? (
                        show?.availability?.map((avail: any) => (
                          <span
                            className="text-sm bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] inline-block rounded-sm m-1 p-1"
                            key={avail?.value}
                          >
                            {avail?.availability
                              ? avail?.availability
                              : avail?.label}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] inline-block rounded-sm m-1 p-1">
                          No country restrictions
                        </span>
                      )}
                      <div className="font-semibold">Subtitles</div>
                      {subtitle ? (
                        show?.subtitles?.length > 0 ? (
                          show?.subtitles?.map((sub: any) => (
                            <span
                              className="text-sm bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] inline-block rounded-sm m-1 p-1"
                              key={sub?.value}
                            >
                              {sub?.subtitles
                                ? sub?.subtitles
                                : sub?.label
                                ? sub?.label
                                : "No subtitle available"}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] inline-block rounded-sm m-1 p-1">
                            No subtitle available
                          </span>
                        )
                      ) : (
                        <span className="text-sm bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] inline-block rounded-sm m-1 p-1">
                          English
                        </span>
                      )}
                    </td>
                    <td className="border-[#78828c0b] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] align-top py-3">
                      <div>
                        {(markedForDeletion[idx] || isItemDataChanged[idx]) && (
                          <button
                            type="button"
                            className="min-w-5 text-sm text-black dark:text-white bg-white dark:bg-[#3a3b3c] hover:bg-[#cdcdcd] dark:hover:bg-[#3e4042] text-[#ffffffde] border-[1px] border-[#cdcdcd] dark:border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-2 mr-2"
                            onClick={() => handleResetItem(idx)}
                          >
                            <GrPowerReset />
                          </button>
                        )}
                        <button
                          className="min-w-5 text-sm text-black dark:text-white bg-white dark:bg-[#3a3b3c] hover:bg-[#cdcdcd] dark:hover:bg-[#3e4042] text-[#ffffffde] border-[1px] border-[#cdcdcd] dark:border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-2"
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpenModal(idx);
                          }}
                        >
                          <CiEdit />
                        </button>
                        {openEditModal && deleteIndex === idx && (
                          <TvEditModal
                            setOpenEditModal={setOpenEditModal}
                            openEditModal={openEditModal}
                            show={[drama[deleteIndex]]}
                            setTvDatabase={setTvDatabase}
                            tvDatabase={tvDatabase}
                            idx={deleteIndex}
                            setStoredData={setStoredData}
                            storedData={storedData}
                            defaultValue={defaultValues}
                            setIsItemDataChanged={setIsItemDataChanged}
                            isItemDataChanged={isItemDataChanged}
                            markedForDeletion={markedForDeletion}
                            setMarkedForDeletion={setMarkedForDeletion}
                          />
                        )}
                      </div>
                    </td>
                  </Reorder.Item>
                );
              })}
            </AnimatePresence>
          </Reorder.Group>
        </table>
        <button
          className="bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] px-5 py-2 cursor-pointer hover:opacity-80 transform duration-300 rounded-md my-5"
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          Add Service
        </button>
      </div>
      {open && (
        <div>
          <TvAddModal
            tv={movie}
            setOpen={setOpen}
            open={open}
            setDeleteIndex={setDeleteIndex}
            drama={drama}
            idx={drama.length}
            setStoredData={setStoredData}
            storedData={storedData}
          />
        </div>
      )}
      <div className="flex items-start">
        <button
          name="Submit"
          type="submit"
          className={`flex items-center text-white bg-[#5cb85c] border-[1px] border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
            storedData?.length > 0 ||
            markedForDeletion?.includes(true) ||
            isItemDataChanged?.includes(true) ||
            hasReordered
              ? "cursor-pointer"
              : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
          }`}
          disabled={
            storedData?.length > 0 ||
            markedForDeletion?.includes(true) ||
            isItemDataChanged?.includes(true) ||
            hasReordered
              ? false
              : true
          }
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
        </button>
        <button
          type="button"
          className={`flex items-center text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#3e4042] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ml-4 ${
            hasReordered
              ? "cursor-pointer"
              : "hover:text-[#c0c4cc] border-[#ebeef5] cursor-not-allowed"
          }`}
          onClick={() => handleResetChanges(0)}
          disabled={hasReordered ? false : true}
        >
          {resetLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

export default MovieServices;

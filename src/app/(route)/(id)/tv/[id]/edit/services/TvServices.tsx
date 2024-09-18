"use client";

import { fetchTv } from "@/app/actions/fetchMovieApi";
import { getNetworkLogo } from "@/app/actions/getNetworkLogo";
import {
  Drama,
  EditDramaPage,
  EditPageDefaultvalue,
  tvId,
} from "@/helper/type";
import { createDetails, TCreateDetails } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, Reorder } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import { GrPowerReset } from "react-icons/gr";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
const TvAddModal = dynamic(
  () => import("@/app/component/ui/Modal/TvAddModal"),
  { ssr: false }
);
const TvEditModal = dynamic(
  () => import("@/app/component/ui/Modal/TvEditModal"),
  { ssr: false }
);

const TvServices: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const { data: tv, refetch } = useQuery({
    queryKey: ["tvEdit", tv_id],
    queryFn: () => fetchTv(tv_id),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const extraData =
    tv?.networks?.map((net: any, idx: number) => ({
      ...tv,
      service_name: net?.name,
      service_url: `https://image.tmdb.org/t/p/original/${net?.logo_path}`,
      page_link: tv?.homepage,
      service_type: "Unknown",
      availability: "",
      subtitles: "English",
    })) || [];

  const [storedData, setStoredData] = useState<EditDramaPage[]>([]);
  const [tvDatabase, setTvDatabase] = useState<EditDramaPage[]>(extraData);
  const [drama, setDrama] = useState<EditDramaPage[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [defaultValues, setDefaultValues] = useState<EditPageDefaultvalue>();
  const [isItemDataChanged, setIsItemDataChanged] = useState<boolean[]>(
    Array(tvDetails?.services?.length || 0).fill(false)
  );
  const [markedForDeletion, setMarkedForDeletion] = useState<boolean[]>(
    Array(tvDetails?.services?.length || 0).fill(false)
  );

  const { handleSubmit, reset } = useForm<TCreateDetails>({
    resolver: zodResolver(createDetails),
  });
  const router = useRouter();

  useEffect(() => {
    if ((tvDetails?.services?.length || 0) < 0) {
      const combinedData = [
        ...(tvDetails?.services || []),
        ...storedData.filter((data) => data !== undefined),
      ];
      const uniqueData = combinedData.reduce((acc: any, current: any) => {
        const x = acc?.find(
          (item: any) => item?.service_name === current?.service_name
        );
        if (!x) {
          acc?.push(current);
        }
        return acc;
      }, []);
      setDrama(uniqueData);
    } else {
      if (!tv) return;

      const combinedData = [
        ...(tvDetails?.services || []),
        ...tvDatabase,
        ...storedData.filter((data) => data !== undefined),
      ];

      const uniqueData = combinedData.reduce((acc: any, current: any) => {
        const x = acc?.find(
          (item: any) => item?.service_name === current?.service_name
        );
        if (!x) {
          acc?.push(current);
        }
        return acc;
      }, []);

      setDrama(uniqueData);
    }
  }, [tv, tvDetails?.services, storedData, tvDatabase]);

  const onSubmit = async (data: TCreateDetails) => {
    try {
      setLoading(true);
      const requestData = {
        tv_id: tv_id.toString(),
        services: markedForDeletion.includes(true)
          ? tvDetails?.services?.filter(
              (item: any, idx: number) =>
                !markedForDeletion[idx] &&
                item?.service_name !== defaultValues?.service_name
            )
          : drama?.map((item) => ({
              ...item,
            })),
      };

      const res = await fetch(`/api/tv/${tv_id}/services`, {
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
    const item = drama[idx];

    const filteredNetworks = item?.networks?.filter((network: any) =>
      drama[idx]?.page_link
        ?.toLowerCase()
        ?.includes(network?.name?.toLowerCase())
    );

    const shouldRenderP = filteredNetworks?.some(
      (item: any) => item?.name === drama[idx]?.service_name
    );
    setDeleteIndex(idx);
    setOpenEditModal(true);
    setDefaultValues({
      service_name: drama[idx]?.service_name,
      service_type: drama[idx]?.service_type,
      link: shouldRenderP && (drama[idx]?.page_link as any),
      availability: drama[idx]?.availability,
      subtitles: drama[idx]?.subtitles,
    });
  };

  const handleResetItem = (idx: number) => {
    setMarkedForDeletion((prev) =>
      prev.map((marked, index) => (index === idx ? false : marked))
    );
    setIsItemDataChanged((prev) =>
      prev.map((changed, index) => (index === idx ? false : changed))
    );
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

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
          <Reorder.Group as="tbody" values={drama} onReorder={setDrama}>
            <AnimatePresence>
              {drama?.map((show: any, idx: number) => {
                const subtitle =
                  Array.isArray(show?.subtitles) &&
                  show?.subtitles?.map((sub: any) => sub?.label);
                const filteredNetworks = show?.networks?.filter(
                  (network: any) =>
                    show?.page_link
                      ?.toLowerCase()
                      ?.includes(network?.name?.toLowerCase())
                );
                const shouldRenderP = filteredNetworks?.some(
                  (item: any) => item?.name === show?.service_name
                );
                const networkId = show?.networks
                  ?.filter((net: any) => net?.name !== show?.service_name)
                  ?.map((item: any) => item.id);

                const serviceImage = show?.service_logo
                  ? `/channel${show?.service_logo}`
                  : getNetworkLogo[show?.service_name] ||
                    show?.service_url ||
                    (show?.networks?.find(
                      (net: any) => getNetworkLogo[net?.name]
                    )?.name
                      ? getNetworkLogo[
                          show?.networks.find(
                            (net: any) => getNetworkLogo[net?.name]
                          )?.name
                        ]
                      : `/channel${show?.service_logo}`) ||
                    `https://image.tmdb.org/t/p/w154/${show?.logo_path}`;
                const tencent = show?.homepage;
                return (
                  <Reorder.Item
                    as="tr"
                    value={show}
                    key={networkId}
                    className="relative w-full h-auto overflow-hidden"
                    whileDrag={{
                      scale: 1.0,
                      boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
                      backgroundColor: "#c2e7b0",
                    }}
                    style={{ display: "table-row" }}
                  >
                    <td className="border-[#78828c0b] border-t-2 border-t-[#06090c21] dark:border-t-[#3e4042] align-top px-4 p-3">
                      <div className="flex items-start">
                        <Image
                          src={serviceImage}
                          alt={
                            show?.service_name ? show?.service_name : show?.name
                          }
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
                          {show?.service_name ? show?.service_name : show?.name}
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
                        {" "}
                        {shouldRenderP ? (
                          <span>
                            {show?.page_link
                              ? show?.page_link
                              : show?.link
                              ? show?.link
                              : show?.homepage}
                          </span>
                        ) : (
                          <span>
                            {show?.networks?.map(
                              (net: any) =>
                                show?.link?.includes(net?.name) ||
                                (net?.name === "Tencent Video" && tencent)
                            )}
                          </span>
                        )}
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
                      {show?.service_type ? show?.service_type : "Unknown"}
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
                            tv={tv}
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
            tv={tv}
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
      <button
        name="Submit"
        type="submit"
        className={`flex items-center text-white bg-[#5cb85c] border-[1px] border-[#5cb85c] px-5 py-2 hover:opacity-80 transform duration-300 rounded-md mb-10 ${
          storedData?.length > 0 ||
          markedForDeletion?.length > 0 ||
          isItemDataChanged?.length > 0
            ? "cursor-pointer"
            : "bg-[#b3e19d] border-[#b3e19d] hover:bg-[#5cb85c] hover:border-[#5cb85c] cursor-not-allowed"
        }`}
        disabled={
          storedData?.length > 0 ||
          markedForDeletion?.length > 0 ||
          isItemDataChanged?.length > 0
            ? false
            : true
        }
      >
        <span className="mr-1 pt-1">
          <ClipLoader color="#c3c3c3" loading={loading} size={19} />
        </span>
        Submit
      </button>
    </form>
  );
};

export default TvServices;

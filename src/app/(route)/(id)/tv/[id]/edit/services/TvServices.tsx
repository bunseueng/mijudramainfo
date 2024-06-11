"use client";

import { fetchTv } from "@/app/actions/fetchMovieApi";
import TvAddModal from "@/app/component/ui/Modal/TvAddModal";
import TvEditModal from "@/app/component/ui/Modal/TvEditModal";
import { Drama, tvId } from "@/helper/type";
import { createDetails, TCreateDetails } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, Reorder } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";

const TvServices: React.FC<tvId & Drama> = ({ tv_id, tvDetails }) => {
  const { data: tv } = useQuery({
    queryKey: ["tvEdit", tv_id],
    queryFn: () => fetchTv(tv_id),
  });
  const [storedData, setStoredData] = useState<any[]>([]);
  const [tvDatabase, setTvDatabase] = useState(tvDetails?.services);
  const [drama, setDrama] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [defaultValues, setDefaultValues] = useState<any>({});
  const [isItemDataChanged, setIsItemDataChanged] = useState<boolean[]>(
    Array(drama.length).fill(false)
  );

  const { register, handleSubmit, reset } = useForm<TCreateDetails>({
    resolver: zodResolver(createDetails),
  });
  const router = useRouter();
  console.log(tvDatabase);
  useEffect(() => {
    setDrama([
      ...(tv ? [tv] : []),
      ...(tvDatabase || []),
      ...storedData.filter((data) => data !== undefined),
    ]);
  }, [tv, tvDatabase, storedData]);

  const onSubmit = async (data: TCreateDetails, e: any) => {
    try {
      // Combine tvDatabase and storedData, filter out null values
      const combinedData = [
        ...(tvDatabase || []),
        ...storedData.filter((item) => item !== null),
      ];

      // Prepare data for submission
      const requestData = {
        tv_id: tv_id.toString(),
        services: combinedData.filter((item) => item !== null), // Filter out null values
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
    }
  };

  const handleOpenModal = (idx: number) => {
    setDeleteIndex(idx);
    setOpenEditModal(true);
    // Set default values for the clicked item
    setDefaultValues({
      service_name: drama[idx]?.service_name,
      service_type: drama[idx]?.service_type,
      link: drama[idx]?.link,
      availability: drama[idx]?.availability,
      subtitles: drama[idx]?.subtitles,
    });
  };
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
                className="border-t-2 border-t-[#3e4042] border-[#3e4042] border-b-2 border-b-[#3e4042] align-bottom text-left py-2 px-4"
                style={{ width: "200px" }}
              >
                Service
              </th>
              <th
                className="border-t-2 border-t-[#3e4042] border-[#3e4042] border-b-2 border-b-[#3e4042] align-bottom text-left py-2 px-4"
                style={{ width: "150px" }}
              >
                Page Link
              </th>
              <th
                className="border-t-2 border-t-[#3e4042] border-[#3e4042] border-b-2 border-b-[#3e4042] align-bottom text-left py-2 px-4"
                style={{ width: "150px" }}
              >
                Service Type
              </th>
              <th
                className="border-t-2 border-t-[#3e4042] border-[#3e4042] border-b-2 border-b-[#3e4042] align-bottom text-left py-2 px-4"
                style={{ width: "250px" }}
              >
                Availability
              </th>
              <th className="border-t-2 border-t-[#3e4042] border-[#3e4042] border-b-2 border-b-[#3e4042] align-bottom text-left py-2 px-4"></th>
            </tr>
          </thead>
          <Reorder.Group as="tbody" values={drama} onReorder={setDrama}>
            <AnimatePresence>
              {drama?.map((show: any, idx: number) => {
                const network = show?.networks?.[0];
                const subtitle = show?.subtitles?.map((sub: any) => sub?.label);
                return (
                  <Reorder.Item
                    as="tr"
                    value={show}
                    key={show?.id ? show.id : `${tvDetails?.id}-${idx}`}
                    className="relative w-full h-auto overflow-hidden"
                    whileDrag={{
                      scale: 1.0,
                      boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
                      backgroundColor: "#c2e7b0",
                    }}
                    style={{ display: "table-row" }}
                  >
                    <td className="border-[#78828c0b] border-t-2 border-t-[#3e4042] align-top px-4 p-3">
                      <div className="flex items-start">
                        <Image
                          src={
                            show?.service_logo
                              ? `/channel${show?.service_logo}`
                              : show?.service_url
                              ? show?.service_url || "/default-image.jpg"
                              : `https://image.tmdb.org/t/p/original/${network?.logo_path}`
                          }
                          alt={
                            show?.service_name
                              ? show?.service_name
                              : network?.name
                          }
                          width={200}
                          height={200}
                          quality={100}
                          className="w-10 h-10 bg-cover bg-center object-cover rounded-full pointer-events-none"
                        />
                        <p
                          className={`pl-2 font-semibold ${
                            storedData.some((item) => item === show)
                              ? "text-[#5cb85c]"
                              : ""
                          } ${
                            isItemDataChanged[idx - 1] ? "text-[#2196f3]" : ""
                          }`}
                        >
                          {show?.service_name
                            ? show?.service_name
                            : network?.name}
                        </p>
                      </div>
                    </td>
                    <td className="border-[#78828c0b] border-t-2 border-t-[#3e4042] align-top px-4 p-3">
                      <Link
                        href={`${show?.link ? show?.link : show?.homepage}`}
                        className={`break-words h-auto ${
                          storedData.some((item) => item === show)
                            ? "text-[#5cb85c]"
                            : ""
                        } ${
                          isItemDataChanged[idx - 1] ? "text-[#2196f3]" : ""
                        }`}
                      >
                        {show?.link ? show?.link : show?.homepage}
                      </Link>
                    </td>
                    <td
                      className={`border-[#78828c0b] border-t-2 border-t-[#3e4042] align-top px-4 p-3 ${
                        storedData.some((item) => item === show)
                          ? "text-[#5cb85c]"
                          : ""
                      } ${isItemDataChanged[idx - 1] ? "text-[#2196f3]" : ""}`}
                    >
                      {show?.service_type ? show?.service_type : "Unknown"}
                    </td>
                    <td
                      className={`border-[#78828c0b] border-t-2 border-t-[#3e4042] align-top px-4 p-3 ${
                        storedData.some((item) => item === show)
                          ? "text-[#5cb85c]"
                          : ""
                      } ${isItemDataChanged[idx - 1] ? "text-[#2196f3]" : ""}`}
                    >
                      <div className="font-semibold">Availability</div>
                      {show?.availability?.length > 0 ? (
                        show?.availability?.map((avail: any) => (
                          <span
                            className="text-sm bg-[#3a3b3c] border-2 border-[#3e4042] inline-block rounded-sm m-1 p-1"
                            key={avail?.value}
                          >
                            {avail?.label}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm bg-[#3a3b3c] border-2 border-[#3e4042] inline-block rounded-sm m-1 p-1">
                          No country restrictions
                        </span>
                      )}
                      <div className="font-semibold">Subtitles</div>
                      {subtitle ? (
                        show?.subtitles?.length > 0 ? (
                          show?.subtitles?.map((sub: any) => (
                            <span
                              className="text-sm bg-[#3a3b3c] border-2 border-[#3e4042] inline-block rounded-sm m-1 p-1"
                              key={sub?.value}
                            >
                              {sub?.label
                                ? sub?.label
                                : "No subtitle available"}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm bg-[#3a3b3c] border-2 border-[#3e4042] inline-block rounded-sm m-1 p-1">
                            No subtitle available
                          </span>
                        )
                      ) : (
                        <span className="text-sm bg-[#3a3b3c] border-2 border-[#3e4042] inline-block rounded-sm m-1 p-1">
                          English
                        </span>
                      )}
                    </td>
                    <td className="border-[#78828c0b] border-t-2 border-t-[#3e4042] align-top px-4 p-3">
                      <button
                        className="min-w-10 bg-[#3a3b3c] text-[#ffffffde] border-2 border-[#3e4042] shadow-sm rounded-sm hover:bg-opacity-70 transform duration-300 p-3"
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenModal(idx);
                        }}
                      >
                        <CiEdit />
                      </button>
                      {openEditModal && (
                        <TvEditModal
                          setOpenEditModal={setOpenEditModal}
                          openEditModal={openEditModal}
                          setDeleteIndex={setDeleteIndex}
                          show={drama[idx]}
                          setTvDatabase={setTvDatabase}
                          tvDatabase={tvDatabase}
                          tv_id={tv_id}
                          idx={idx}
                          setStoredData={setStoredData}
                          storedData={storedData}
                          defaultValue={defaultValues}
                          setIsItemDataChanged={setIsItemDataChanged}
                          isItemDataChanged={isItemDataChanged}
                        />
                      )}
                    </td>
                  </Reorder.Item>
                );
              })}
            </AnimatePresence>
          </Reorder.Group>
        </table>
        <button
          className="bg-[#3a3b3c] border-2 border-[#3e4042] px-5 py-2 cursor-pointer hover:opacity-80 transform duration-300 rounded-md my-5"
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          Add Service
        </button>
      </div>
      {open &&
        drama.map((item, idx) => (
          <div key={idx}>
            <TvAddModal
              setOpen={setOpen}
              open={open}
              setDeleteIndex={setDeleteIndex}
              drama={drama}
              tv_id={tv_id}
              idx={idx}
              setStoredData={setStoredData}
              storedData={storedData}
            />
          </div>
        ))}
      <button
        className="bg-[#5cb85c] border-2 border-[#5cb85c] px-5 py-2 cursor-pointer hover:opacity-80 transform duration-300 rounded-md my-5"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default TvServices;

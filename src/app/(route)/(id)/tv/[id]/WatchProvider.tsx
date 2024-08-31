import Image from "next/image";
import Link from "next/link";
import React from "react";

const WatchProvider = ({ getDrama, tv }: any) => {
  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .replace(/\s+/g, "") // Remove all whitespace
      .replace(/[^\w\s]/g, ""); // Remove punctuation
  };

  const isNetworkNameInHomepage = (homepage: string, networkName: string) => {
    const normalizedHomepage = normalizeString(homepage);
    const normalizedNetworkName = normalizeString(networkName);

    return normalizedHomepage.includes(normalizedNetworkName);
  };

  return (
    <div className="grid grid-cols-1 min-[649px]:grid-cols-2 min-[1350px]:grid-cols-3 ml-5 md:ml-0">
      {getDrama?.services?.length > 0
        ? getDrama?.services?.map((show: any) => {
            const youku =
              show?.service_name === "Youku" &&
              "https://img.alicdn.com/imgextra/i2/O1CN01BeAcgL1ywY0G5nSn8_!!6000000006643-2-tps-195-195.png";
            const tencent =
              show?.name === "Tencent Video" && "https://v.qq.com/favicon.ico";
            const hunan =
              show?.name === "Hunan Television" &&
              "https://v.qq.com/favicon.ico";
            const mangotv =
              show?.name === "Mango TV" &&
              "https://static.hitv.com/pc/icons/icon_64x64.1b7ca7.png";
            const dragontv =
              show?.name === "Dragon TV" &&
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpOLHAymBfsArd22dQi3LEHjbii-1G6SoZtA&s";
            const iqiyi =
              show?.name === "iQiyi" && "https://www.iq.com/favicon.ico";
            return (
              <div
                className="flex flex-col justify-between lg:flow-row items-start mt-2"
                key={show?.id}
              >
                <div className="flex flex-row items-center justify-between">
                  {show?.profile_path !== null ? (
                    <Link href={`${show?.homepage || show?.link}`}>
                      <Image
                        src={
                          show?.service_logo
                            ? `/channel${show?.service_logo}`
                            : show?.service_url
                            ? youku ||
                              tencent ||
                              mangotv ||
                              iqiyi ||
                              hunan ||
                              dragontv ||
                              show?.service_url
                            : `https://image.tmdb.org/t/p/original/${show?.logo_path}`
                        }
                        alt={`${show?.service_name}'s Logo`}
                        width={200}
                        height={200}
                        quality={100}
                        className="inline-block size-[60px] object-cover rounded-full hover:opacity-75 transform duration-300 cursor-pointer"
                      />
                    </Link>
                  ) : (
                    <Link href={`${show?.homepage || show?.link}`}>
                      <Image
                        src="/empty-pf.jpg"
                        alt="Provider Logo"
                        width={200}
                        height={200}
                        quality={100}
                        className="inline-block size-[60px] object-cover rounded-full hover:opacity-75 transform duration-300 cursor-pointer"
                      />
                    </Link>
                  )}
                  <div className="flex flex-col items-start ml-2">
                    <Link
                      href={`${show?.homepage || show?.link}`}
                      className="text-md md:text-lg font-bold truncate text-[#2196f3] hover:opacity-75 transform duration-300 cursor-pointer"
                    >
                      {show?.service_name}
                    </Link>

                    <p className="dark:text-[#818a91]">{show?.service_type}</p>
                  </div>
                </div>
              </div>
            );
          })
        : tv?.networks
            ?.filter(
              (net: any) =>
                isNetworkNameInHomepage(tv?.homepage, net?.name) ||
                (net?.name === "Tencent Video" && tv?.homepage)
            )
            ?.map((show: any) => {
              const youku =
                show?.name === "Youku" &&
                "https://img.alicdn.com/imgextra/i2/O1CN01BeAcgL1ywY0G5nSn8_!!6000000006643-2-tps-195-195.png";
              const tencent =
                show?.name === "Tencent Video" &&
                "https://v.qq.com/favicon.ico";
              const hunan =
                show?.name === "Hunan Television" &&
                "https://v.qq.com/favicon.ico";
              const mangotv =
                show?.name === "Mango TV" &&
                "https://static.hitv.com/pc/icons/icon_64x64.1b7ca7.png";
              const dragontv =
                show?.name === "Dragon TV" &&
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpOLHAymBfsArd22dQi3LEHjbii-1G6SoZtA&s";
              const iqiyi =
                show?.name === "iQiyi" && "https://www.iq.com/favicon.ico";
              return (
                <div
                  className="flex flex-col justify-between lg:flow-row items-start mt-2"
                  key={show?.id}
                >
                  <div className="flex flex-row items-center justify-between">
                    {tv?.profile_path !== null ? (
                      <Link href={`${tv?.homepage}`}>
                        <Image
                          src={
                            youku ||
                            tencent ||
                            mangotv ||
                            iqiyi ||
                            hunan ||
                            (dragontv as string)
                              ? youku ||
                                tencent ||
                                mangotv ||
                                iqiyi ||
                                hunan ||
                                (dragontv as string)
                              : `https://image.tmdb.org/t/p/original/${show?.logo_path}`
                          }
                          alt={`${show?.service_name}'s Logo`}
                          width={200}
                          height={200}
                          quality={100}
                          priority
                          className="inline-block size-[60px] object-cover rounded-full hover:opacity-75 transform duration-300 cursor-pointer"
                        />
                      </Link>
                    ) : (
                      <Link href={`${tv?.homepage}`}>
                        <Image
                          src="/empty-pf.jpg"
                          alt="Provider Logo"
                          width={200}
                          height={200}
                          quality={100}
                          className="inline-block size-[60px] object-cover rounded-full hover:opacity-75 transform duration-300 cursor-pointer"
                        />
                      </Link>
                    )}
                    <div className="flex flex-col items-start ml-2">
                      <Link
                        href={tv?.homepage}
                        className="text-md md:text-lg font-bold truncate text-[#2196f3] hover:opacity-75 transform duration-300 cursor-pointer"
                      >
                        {show?.name}
                      </Link>

                      <p className="dark:text-[#818a91]">Unknown</p>
                    </div>
                  </div>
                </div>
              );
            })}
    </div>
  );
};

export default WatchProvider;

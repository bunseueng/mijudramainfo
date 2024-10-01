import ReusedImage from "@/components/ui/allreusedimage";
import Link from "next/link";
import React from "react";
import ProviderBlock from "./ProviderProps";

const WatchProvider = ({ getDrama, tv, selectedProvider }: any) => {
  return (
    <div className="grid grid-cols-1 min-[649px]:grid-cols-2 min-[1350px]:grid-cols-3 ml-5 md:ml-0">
      {getDrama?.services?.length > 0 ? (
        getDrama?.services?.map((show: any) => {
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
            <div
              className="flex flex-col justify-between lg:flow-row items-start my-2"
              key={show?.id}
            >
              <div className="flex flex-row items-center justify-between">
                <Link href={`${show?.link}`}>
                  <ReusedImage
                    src={serviceImage}
                    alt={`${show?.provider_name}`}
                    width={200}
                    height={200}
                    quality={100}
                    priority
                    className="inline-block size-[60px] object-cover rounded-full hover:opacity-75 transform duration-300 cursor-pointer"
                  />
                </Link>
                <div className="flex flex-col items-start ml-2">
                  <Link
                    href={`${show?.link}`}
                    className="text-md md:text-lg font-bold truncate text-[#2196f3] hover:opacity-75 transform duration-300 cursor-pointer"
                  >
                    {show?.provider_name}
                  </Link>

                  <p className="dark:text-[#818a91]">{show?.service_type}</p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <React.Fragment>
          <ProviderBlock provider={selectedProvider?.free} label="(Free)" />
          <ProviderBlock
            provider={selectedProvider?.ads}
            label="(Advertisement)"
          />
          <ProviderBlock
            provider={selectedProvider?.flatrate}
            label="(Subscription)"
          />
          <ProviderBlock
            provider={selectedProvider?.rent}
            label="(Pay Per View)"
          />
          <ProviderBlock provider={selectedProvider?.buy} label="(Purchase)" />
        </React.Fragment>
      )}
    </div>
  );
};
export default WatchProvider;

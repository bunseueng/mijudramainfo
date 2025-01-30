"use client";

import { TVShow } from "@/helper/type";
import { useRouter } from "next/navigation";
import ReusedImage from "@/components/ui/allreusedimage";

interface Provider {
  logo_path: string;
  provider_name: string;
}

interface ProviderBlockProps {
  provider: Provider[];
  label: string;
  tv: TVShow;
}

const ProviderBlock: React.FC<ProviderBlockProps> = ({
  provider,
  label,
  tv,
}) => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(
      `/redirect?url=${encodeURIComponent(
        `https://www.themoviedb.org/tv/${tv?.id}/watch`
      )}&message=${encodeURIComponent("The Movie Database")}`
    );
  };

  return (
    provider?.length > 0 && (
      <div className="flex flex-col justify-between lg:flow-row items-start mt-2">
        <div className="flex flex-row items-center justify-between">
          <button
            type="button"
            name="Redirect"
            aria-label="Redirect to..."
            onClick={handleRedirect}
          >
            <ReusedImage
              src={`https://image.tmdb.org/t/p/original/${provider[0]?.logo_path}`}
              alt={`${provider[0]?.provider_name}'s Logo` || "Provider Logo"}
              width={200}
              height={200}
              quality={100}
              priority
              className="inline-block size-[60px] object-cover rounded-full hover:opacity-75 transform duration-300 cursor-pointer"
            />
          </button>
          <div className="flex flex-col items-start ml-2">
            <button
              type="button"
              name="Redirect"
              aria-label="Redirect to..."
              onClick={handleRedirect}
              className="text-sm md:text-md font-bold truncate text-[#2196f3] hover:opacity-75 transform duration-300 cursor-pointer"
            >
              {provider[0]?.provider_name}
            </button>
            <p className="text-xs dark:text-[#818a91]">{label}</p>
          </div>
        </div>
      </div>
    )
  );
};

export default ProviderBlock;

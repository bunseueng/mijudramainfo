import Link from "next/link";
import ReusedImage from "@/components/ui/allreusedimage";

const ProviderBlock = ({ provider, type, label }: any) => {
  return (
    provider?.length > 0 && (
      <div className="flex flex-col justify-between lg:flow-row items-start mt-2">
        <div className="flex flex-row items-center justify-between">
          <Link href={`${provider[0]?.link}`}>
            <ReusedImage
              src={`https://image.tmdb.org/t/p/original/${provider[0]?.logo_path}`}
              alt={`${provider[0]?.provider_name}'s Logo`}
              width={200}
              height={200}
              quality={100}
              priority
              className="inline-block size-[60px] object-cover rounded-full hover:opacity-75 transform duration-300 cursor-pointer"
            />
          </Link>
          <div className="flex flex-col items-start ml-2">
            <Link
              href={`${provider[0]?.link}`}
              className="text-md md:text-lg font-bold truncate text-[#2196f3] hover:opacity-75 transform duration-300 cursor-pointer"
            >
              {provider[0]?.provider_name}
            </Link>
            <p className="dark:text-[#818a91]">{label}</p>
          </div>
        </div>
      </div>
    )
  );
};

export default ProviderBlock;

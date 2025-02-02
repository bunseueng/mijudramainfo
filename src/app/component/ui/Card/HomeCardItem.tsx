import type React from "react";
import Link from "next/link";
import LazyImage from "@/components/ui/lazyimage";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
import type { DramaDetails, DramaReleasedInfo } from "@/helper/type";

interface HomeCardItemProps {
  result: any;
  getDrama: any;
  path: string;
  dominantColor: string;
  linearColor: string;
  isLastItem: boolean;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

const HomeCardItem: React.FC<HomeCardItemProps> = ({
  result,
  getDrama,
  path,
  dominantColor,
  linearColor,
  isLastItem,
  onMouseEnter,
  onMouseLeave,
}) => {
  const drama_db = getDrama?.find((d: any) => d?.tv_id?.includes(result?.id));
  const [detail]: DramaDetails[] = (drama_db?.details ||
    []) as unknown as DramaDetails[];
  const [info]: DramaReleasedInfo[] = (drama_db?.released_information ||
    []) as unknown as DramaReleasedInfo[];

  return (
    <div
      className={`inline-block w-[150px] sm:w-[180px] md:w-[200px] lg:w-[212px] relative group ${
        isLastItem ? "mr-0" : "mr-3 sm:mr-3 md:mr-4"
      } ${window.innerWidth >= 1888 ? "" : "card-hover-effect"}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link
        aria-label={`Visit ${result?.name || result?.title}?`}
        prefetch={false}
        href={`/${path}/${result?.id}-${spaceToHyphen(
          result?.name || result?.title
        )}`}
        className="block"
      >
        <div className="relative rounded-t-sm overflow-hidden z-[2] image-box aspect-[2/2.7]">
          <LazyImage
            coverFromDB={drama_db?.cover}
            src={
              result?.poster_path ||
              result?.backdrop_path ||
              "/placeholder-image.avif"
            }
            w={result?.poster_path ? "w342" : "w780"}
            alt={
              `Poster for ${detail?.title || result?.name || result?.title}` ||
              "Poster"
            }
            width={500}
            height={750}
            quality={75}
            sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 212px"
            priority
            loading="lazy"
            className="absolute inset-0 box-border p-0 border-0 m-auto block w-full h-full object-cover object-center backface-visibility-hidden"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${btoa(
              `<svg width="212" height="297" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${dominantColor}"/></svg>`
            )}`}
            style={{
              backgroundColor: dominantColor,
              width: "100%",
              height: "auto",
            }}
          />
          <div
            className="absolute left-0 right-0 bottom-0 h-[60px] z-[300]"
            style={{
              backgroundImage: linearColor,
            }}
          />
        </div>
        <div
          className="h-[76px] relative p-[0.1rem_0_0] text-[14px] transition-colors duration-300"
          style={{
            background: dominantColor,
            borderRadius: "0px 0px 6px 6px",
          }}
        >
          <h2 className="mx-[10px] mb-[6px] whitespace-normal overflow-hidden text-ellipsis flex flex-col text-white/80 font-medium text-[12px] sm:text-[14px] md:text-[16px] leading-tight line-clamp-2">
            {detail?.title || result?.name || result?.title}
          </h2>

          <p className="text-[12px] sm:text-[14px] text-white/70 tracking-[0px] font-normal absolute bottom-[10px] overflow-hidden text-ellipsis whitespace-normal flex items-center mx-[10px] line-clamp-1">
            {info ? (
              detail?.status !== "Announced" ? (
                <span className="text-[#2490da]">Upcoming</span>
              ) : (
                info?.release_date?.slice(0, 4)
              )
            ) : result?.first_air_date ? (
              result.first_air_date.split("-")[0]
            ) : (
              <span className="text-[#2490da]">Upcoming</span>
            )}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default HomeCardItem;

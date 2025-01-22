import { memo } from "react";
import Link from "next/link";
import LazyImage from "@/components/ui/lazyimage";
import { spaceToHyphen } from "@/lib/spaceToHyphen";

interface MovieCardProps {
  result: any;
  getDrama: any;
  path: string;
  isLastItem: boolean;
  colorMap: Map<string, string>;
  onHover: (position: { x: number; y: number }) => void;
  onLeave: () => void;
}

export const MovieCard = memo(function MovieCard({
  result,
  getDrama,
  path,
  isLastItem,
  colorMap,
  onHover,
  onLeave,
}: MovieCardProps) {
  const coverFromDB = getDrama?.find((d: any) =>
    d?.tv_id?.includes(result?.id)
  );
  const cardColor = colorMap.get(result.id) || "transparent";

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(rect.left - 37, 0), window.innerWidth - 286);
    const y = rect.top + window.scrollY - 835;
    onHover({ x, y });
  };

  return (
    <div
      className={`shrink-0 w-[150px] sm:w-[180px] md:w-[200px] lg:w-[212px] relative group 
        ${isLastItem ? "mr-0" : "mr-3 sm:mr-3 md:mr-4"}
        ${window.innerWidth >= 1888 ? "" : "card-hover-effect"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
    >
      <Link
        href={`/${path}/${result?.id}-${spaceToHyphen(
          result?.name || result?.title
        )}`}
        className="block"
        prefetch={true}
      >
        <div className="relative rounded-t-sm overflow-hidden">
          <LazyImage
            coverFromDB={coverFromDB?.cover}
            src={result?.poster_path || result?.backdrop_path}
            w={result?.poster_path ? "w500" : "w780"}
            alt={`Poster for ${result?.name || result?.title}`}
            width={212}
            height={318}
            quality={75}
            sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 212px"
            priority
            className="object-cover"
            style={{ backgroundColor: cardColor }}
          />
        </div>
        <div
          className="h-[76px] p-2 rounded-b-lg"
          style={{ backgroundColor: cardColor }}
        >
          <h2 className="text-white/80 font-medium text-[12px] sm:text-[14px] md:text-[16px] line-clamp-2">
            {result?.name || result?.title}
          </h2>
          <p className="text-[12px] sm:text-[14px] text-white/70 mt-1">
            {result?.first_air_date ? (
              result.first_air_date.split("-")[0]
            ) : (
              <span className="text-[#2490da]">Upcoming</span>
            )}
          </p>
        </div>
      </Link>
    </div>
  );
});

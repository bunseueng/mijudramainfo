import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { spaceToHyphen } from "@/lib/spaceToHyphen";

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CastSectionProps {
  cast: CastMember[];
  tv_id: string;
  type: string;
}

const CastSection = ({ cast, tv_id, type }: CastSectionProps) => {
  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Cast</h2>
          <Link
            href={`/${type}/${tv_id}/cast`}
            prefetch={false}
            aria-label="Visit Cast Page"
            className="text-sm sm:text-base transform duration-300 hover:scale-95 hover:border-b hover:border-b-orange-400"
          >
            View All Casts
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {cast.slice(0, 8).map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center text-center"
            >
              <div className="relative w-full pb-[150%] rounded-md overflow-hidden mb-2">
                <Link
                  href={`/person/${member.id}-${spaceToHyphen(member.name)}`}
                >
                  <Image
                    src={
                      member.profile_path
                        ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                        : "/default-pf.webp"
                    }
                    alt={member.name}
                    fill
                    quality={100}
                    className="object-cover"
                  />
                </Link>
              </div>
              <Link href={`/person/${member.id}-${spaceToHyphen(member.name)}`}>
                <h3 className="font-semibold text-sm line-clamp-1">
                  {member.name}
                </h3>
              </Link>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {member.character}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CastSection;

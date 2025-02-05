import { Card, CardContent } from "@/components/ui/card";
import { genres } from "@/helper/item-list";
import type { TVShow } from "@/helper/type";
import Image from "next/image";
import Link from "next/link";

interface RelatedContentProps {
  related_content: TVShow[];
  type: string;
}

const RelatedContent = ({ related_content, type }: RelatedContentProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">You May Also Like</h2>
        <div className="space-y-4">
          {related_content.map((content) => {
            const genreNames = content.genre_ids.map((id) => {
              const genre = genres.find((g) => g.id === id.toString());
              return genre ? genre.value : "Unknown Genre";
            });
            return (
              <Link
                prefetch={false}
                key={content?.id}
                href={`/${type}/${content?.id}/watch/`}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="relative w-16 h-24 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={
                      content?.poster_path
                        ? `https://image.tmdb.org/t/p/w92/${content?.poster_path}`
                        : content?.backdrop_path
                        ? `https://image.tmdb.org/t/p/w300/${content?.backdrop_path}`
                        : "/placeholder-image.avif"
                    }
                    width={100}
                    height={100}
                    alt={`${content?.name}'s Poster` || "Drama/Movie Poster"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-sm line-clamp-2">
                    {content?.name || content?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {genreNames.join(", ")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedContent;

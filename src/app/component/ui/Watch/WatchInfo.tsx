import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Film, Star, Tv, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { spaceToHyphen } from "@/lib/spaceToHyphen";

interface DramaInfoProps {
  id: string;
  title: string;
  description: string;
  genres: string[];
  year: number;
  episodes: number;
  rating: number;
  duration: string;
  type: string;
  imageUrl: string;
  link: string;
}

const WatchInfo = ({
  id,
  title,
  description,
  genres,
  year,
  episodes,
  rating,
  duration,
  type,
  imageUrl,
  link,
}: DramaInfoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Card className="w-full  overflow-hidden bg-card">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-2/5 h-[300px] md:h-auto">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title || "Drama/Movie Poster"}
            fill
            quality={100}
            loading="lazy"
            className="rounded-t-lg md:rounded-l-lg md:rounded-tr-none object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
            {type}
          </Badge>
        </div>
        <CardContent className="flex-1 p-6 md:p-8 bg-gradient-to-br from-background to-background/80">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Link
                href={`/${link}/${id}-${spaceToHyphen(title)}`}
                prefetch={false}
                aria-label={`Visit ${title || "Drma"} Page`}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  {title}
                </h2>
              </Link>

              <div className="flex items-center gap-2 mt-1">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-semibold text-lg">{rating}</span>
              </div>
            </div>
            <Badge variant="outline" className="text-sm font-normal">
              {year}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {genres.map((genre) => (
              <Badge
                key={genre}
                variant="secondary"
                className="bg-secondary hover:bg-secondary/80 transition-colors"
              >
                {genre}
              </Badge>
            ))}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-4">
            {isExpanded ? description : `${description.slice(0, 150)}...`}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-primary" />
              <span>{episodes} Episodes</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-primary" />
              <span>{type}</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full text-primary hover:text-primary-foreground hover:bg-primary transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Show More
              </>
            )}
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default WatchInfo;

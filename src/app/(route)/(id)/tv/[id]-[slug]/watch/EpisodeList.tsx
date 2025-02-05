import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Play } from "lucide-react";

interface Episode {
  id: number;
  title: string;
  duration: string | false;
  thumbnail: string;
}

interface EpisodeListProps {
  episodes: Episode[];
  currentEpisode: number;
  onEpisodeSelect: (episodeId: number) => void;
}

export function EpisodeList({
  episodes,
  currentEpisode,
  onEpisodeSelect,
}: EpisodeListProps) {
  return (
    <Card className="bg-background">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Episodes</h2>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
          {episodes.map((episode, index) => (
            <button
              key={episode.id}
              onClick={() => onEpisodeSelect(episode.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 ease-in-out hover:bg-accent/50 text-left ${
                currentEpisode === episode.id ? "bg-accent" : ""
              }`}
            >
              <div className="relative w-20 aspect-video rounded-md overflow-hidden">
                <Image
                  src={episode.thumbnail || "/placeholder.svg"}
                  alt={episode.title}
                  fill
                  className="object-cover"
                />
                {currentEpisode === episode.id && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Play className="text-white" size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">
                  {episode.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {episode.duration}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

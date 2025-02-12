import {
  FacebookIcon,
  FacebookShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "next-share";
import { GoHeart } from "react-icons/go";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personLove, type TPersonLove } from "@/helper/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LazyImage from "@/components/ui/lazyimage";
import type {
  PersonDBType,
  PersonDetail,
  currentUserProps,
} from "@/helper/type";
import PersonInfo from "./PersonInfo";
import PersonBiography from "./PersonBiography";

interface PersonHeaderProps {
  persons: any;
  currentUser: currentUserProps | null;
  getPersons: PersonDBType | null;
  currentPage: string;
  personFullDetails: any;
}

export default function PersonHeader({
  persons,
  currentUser,
  getPersons,
  currentPage,
  personFullDetails,
}: PersonHeaderProps) {
  const router = useRouter();
  const { handleSubmit } = useForm<TPersonLove>({
    resolver: zodResolver(personLove),
  });
  const [detail]: PersonDetail[] = (getPersons?.details ||
    []) as unknown as PersonDetail[];

  const isCurrentUserLoved = getPersons?.lovedBy.find((item: any) =>
    item.includes(currentUser?.id)
  );

  const handleLove = async (data: TPersonLove) => {
    if (!currentUser) {
      toast.error("Please login to love this person");
      return;
    }

    try {
      const res = await fetch(`/api/person/${persons?.id}/love`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          love: data?.love,
          loveBy: data?.loveBy,
          ...data,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update love status");
      }

      router.refresh();
    } catch (error) {
      toast.error("Failed to love");
    }
  };

  return (
    <div className="bg-white dark:bg-[#242526] rounded-lg shadow-sm overflow-hidden">
      <div className="aspect-square sm:aspect-[4/3] lg:aspect-square relative">
        <LazyImage
          coverFromDB={getPersons?.cover}
          src={`https://image.tmdb.org/t/p/original/${persons?.profile_path}`}
          alt={`${persons?.name}'s Avatar` || "Person Profile"}
          width={600}
          height={600}
          quality={100}
          className="w-full h-full object-cover"
          priority
          fetchPriority="high"
        />
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 text-center mb-6">
          <div>
            <p className="text-xl font-bold text-black dark:text-[#ffffffde]">
              0
            </p>
            <p className="text-sm text-[#818a91]">Followers</p>
          </div>
          <div>
            <p className="text-xl font-bold text-black dark:text-[#ffffffde]">
              {String(getPersons?.love || 0)}
            </p>
            <p className="text-sm text-[#818a91]">Hearts</p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <FacebookShareButton
            url={currentPage}
            quote={persons?.biography}
            hashtag="#drama"
          >
            <FacebookIcon round size={35} />
          </FacebookShareButton>
          <TwitterShareButton url={currentPage} title={persons?.name}>
            <TwitterIcon round size={35} />
          </TwitterShareButton>
          <RedditShareButton url={currentPage} title={persons?.name}>
            <RedditIcon round size={35} />
          </RedditShareButton>
          <PinterestShareButton
            url={currentPage}
            media={persons}
            title="The best site to find your favorite drama"
          >
            <PinterestIcon round size={35} />
          </PinterestShareButton>
        </div>

        <div className="lg:hidden mt-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl text-[#2490da] font-bold px-3 md:px-6">
              {persons?.name}
            </h1>
            <button
              name="Love icon"
              onClick={handleSubmit(handleLove)}
              className="flex items-center space-x-2"
            >
              <GoHeart
                className={`text-2xl ${
                  isCurrentUserLoved ? "text-red-600" : ""
                }`}
              />
              <span>{String(getPersons?.love || 0)}</span>
            </button>
          </div>
          <PersonInfo
            persons={persons}
            personFullDetails={personFullDetails}
            person_db={getPersons}
          />
          <PersonBiography persons={persons} detail={detail} />
        </div>
      </div>
    </div>
  );
}

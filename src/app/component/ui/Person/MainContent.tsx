import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personLove, type TPersonLove } from "@/helper/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import type {
  UserProps,
  PersonDBType,
  currentUserProps,
  CommentProps,
  TVShow,
  Person,
} from "@/helper/type";
import PersonContent from "@/app/(route)/(id)/person/[id]-[slug]/PersonContent";

interface MainContentProps {
  persons: Person;
  currentUser: currentUserProps | null;
  getPersons: PersonDBType | null;
  drama: TVShow;
  movie: TVShow;
  users: UserProps[];
  getComment: CommentProps[];
  tv_id: number;
  personFullDetails: {
    results: Array<{
      known_for_department: string;
      known_for: Array<{
        title?: string | null;
        name?: string | null;
        media_type: string;
        id: number;
        poster_path: string | null;
        backdrop_path: string | null;
        first_air_date: string;
        release_date: string;
      }>;
    }>;
  };
  sortedChanges: {
    userId: string;
    timestamp: string;
    field: string;
    oldValue: string | null;
    newValue: string;
  }[];
}

export default function MainContent({
  persons,
  currentUser,
  getPersons,
  drama,
  movie,
  users,
  getComment,
  tv_id,
  personFullDetails,
  sortedChanges,
}: MainContentProps) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<TPersonLove>({
    resolver: zodResolver(personLove),
  });
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
      console.error("Error:", error);
      toast.error("Failed to love");
    }
  };

  return (
    <PersonContent
      persons={persons}
      currentUser={currentUser}
      getPersons={getPersons}
      drama={drama}
      movie={movie}
      users={users}
      getComment={getComment}
      tv_id={tv_id}
      register={register}
      handleSubmit={handleSubmit}
      isCurrentUserLoved={isCurrentUserLoved}
      handleLove={handleLove}
      personFullDetails={personFullDetails}
      sortedChanges={sortedChanges}
    />
  );
}

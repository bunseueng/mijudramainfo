import { Suspense } from "react";
import { GoHeart } from "react-icons/go";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personLove, type TPersonLove } from "@/helper/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Drama from "@/app/(route)/(id)/person/[id]-[slug]/Drama";
import VarietyShow from "@/app/(route)/(id)/person/[id]-[slug]/VarietyShow";
import PersonMovie from "@/app/(route)/(id)/person/[id]-[slug]/PersonMovie";
import Discuss from "@/app/(route)/(id)/tv/[id]-[slug]/discuss/Discuss";
import type {
  UserProps,
  PersonDBType,
  currentUserProps,
  CommentProps,
} from "@/helper/type";
import PersonBiography from "./PersonBiography";

interface MainContentProps {
  persons: any;
  currentUser: currentUserProps | null;
  getPersons: PersonDBType | null;
  drama: any;
  movie: any;
  users: UserProps[];
  getComment: CommentProps[];
  tv_id: number;
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
}: MainContentProps) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<TPersonLove>({
    resolver: zodResolver(personLove),
  });
  const isCurrentUserLoved = getPersons?.lovedBy.find((item: any) =>
    item.includes(currentUser?.id)
  );
  const getCast = drama?.cast?.sort(
    (a: any, b: any) =>
      new Date(b.first_air_date).getTime() -
      new Date(a.first_air_date).getTime()
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
    <div className="space-y-8">
      <div className="hidden lg:block">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl text-[#2490da] font-bold">
            {persons?.displayName || persons?.name}
          </h1>
          <button
            {...register("love")}
            className="flex items-center space-x-2"
            name="Love icon"
            onClick={handleSubmit(handleLove)}
          >
            <GoHeart
              className={`text-2xl ${isCurrentUserLoved ? "text-red-600" : ""}`}
            />
            <span>{String(getPersons?.love || 0)}</span>
          </button>
        </div>
        <PersonBiography persons={persons} />
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-bold mb-4">Drama</h2>
          {!getCast ? <Drama /> : <Drama data={drama} />}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Movie</h2>
          {!getCast ? <Drama /> : <PersonMovie data={movie} />}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Variety Show</h2>
          {!getCast ? <Drama /> : <VarietyShow data={drama} />}
        </section>

        <section>
          <Suspense
            fallback={<div className="animate-pulse">Loading comments...</div>}
          >
            <Discuss
              user={currentUser as UserProps | any}
              users={users}
              getComment={getComment}
              tv_id={tv_id.toString()}
              type="person"
            />
          </Suspense>
        </section>
      </div>
    </div>
  );
}

import { getCurrentUser } from "@/app/actions/getCurrentUser";
import FetchPerson from "@/app/component/ui/Fetching/FetchPerson";
import prisma from "@/lib/db";
import { Metadata } from "next";
import PersonList from "./PersonList";
import { CommentProps } from "@/helper/type";
import { Prisma } from "@prisma/client";

export const revalidate = 3600;
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const person_id = params.id;
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${person_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&with_original_language=zh&region=CN`
  );
  const personDetails = await response.json();
  const getFullDetails = await fetch(
    `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(
      personDetails?.name
    )}&api_key=${
      process.env.NEXT_PUBLIC_API_KEY
    }&include_adult=false&language=en-US&page=1`
  );
  const person = await getFullDetails.json();
  return {
    title: `${person?.results[0]?.original_name}`,
    description: person?.results[0]?.biography,
    openGraph: {
      type: "website",
      url: "https://mijudramainfo.vercel.app/",
      title: person?.results[0]?.name,
      description: `All information of ${person?.results[0]?.name}`,
      images: [
        {
          url: `https://image.tmdb.org/t/p/original/${person?.results[0]?.profile_path}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

type PopularitySentItem = {
  personId: string;
  starCount: number;
  // Add other properties if they exist
};

export default async function PersonPage({ params }: any) {
  const person_id = params.id;
  const currentUser = await getCurrentUser();
  const users = await prisma.user.findMany({});
  const getPersons = await prisma.person.findUnique({
    where: {
      personId: person_id,
    },
  });
  const getPersonDB = await prisma.person.findMany();
  const getComment = await prisma.comment.findMany({
    where: {
      postId: person_id,
    },
  });
  const findSpecificPerson = users?.filter((user) =>
    user?.totalPopularitySent?.some((sent) => {
      const popularitySentItem = sent as PopularitySentItem;
      return params.id === popularitySentItem.personId;
    })
  );
  const sortedUsers = findSpecificPerson?.sort((a, b) => {
    const totalA = a.totalPopularitySent.reduce(
      (sum: number, item: any) => sum + item.totalPopularity,
      0
    );
    const totalB = b.totalPopularitySent.reduce(
      (sum: number, item: any) => sum + item.totalPopularity,
      0
    );
    return totalB - totalA; // Sort descending by starCount
  });
  // If getPersons is not null, map its changes field
  const mappedPersons = getPersons
    ? {
        ...getPersons,
        changes: (getPersons.changes as Prisma.JsonValue[]).map(
          (change: any) => ({
            userId: change.userId,
            timestamp: change.timestamp,
            field: change.field,
            oldValue: change.oldValue,
            newValue: change.newValue,
          })
        ),
      }
    : null;

  return (
    <>
      <PersonList personId={person_id} />
      <FetchPerson
        tv_id={person_id}
        currentUser={currentUser}
        users={users}
        getComment={getComment as CommentProps | any}
        getPersons={mappedPersons}
        sortedUsers={sortedUsers}
        getPersonDB={getPersonDB}
      />
    </>
  );
}

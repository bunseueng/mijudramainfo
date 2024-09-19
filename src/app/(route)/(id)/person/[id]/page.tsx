import { getCurrentUser } from "@/app/actions/getCurrentUser";
import FetchPerson from "@/app/component/ui/Fetching/FetchPerson";
import prisma from "@/lib/db";
import { Metadata } from "next";
import dynamic from "next/dynamic";
const PersonList = dynamic(() => import("./PersonList"), { ssr: false });

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

  const sortedUsers = findSpecificPerson.sort((a, b) => {
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

  return (
    <>
      <PersonList personId={person_id} />
      <FetchPerson
        tv_id={person_id}
        currentUser={currentUser}
        users={users}
        getComment={getComment}
        getPersons={getPersons}
        sortedUsers={sortedUsers}
      />
    </>
  );
}

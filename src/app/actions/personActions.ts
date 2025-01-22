import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export const getPersonDetails = cache(async (person_id: string) => {
  const personDetailsResponse = await fetch(
    `https://api.themoviedb.org/3/person/${person_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&with_original_language=zh&region=CN`
  );

  if (!personDetailsResponse.ok) {
    throw new Error('Failed to fetch person details');
  }

  const personDetails = await personDetailsResponse.json();

  const personResponse = await fetch(
    `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(
      personDetails?.name
    )}&api_key=${
      process.env.NEXT_PUBLIC_API_KEY
    }&include_adult=false&language=en-US&page=1`
  );

  if (!personResponse.ok) {
    throw new Error('Failed to fetch person search results');
  }

  const person = await personResponse.json();

  return { personDetails, person };
})

type PopularitySentItem = {
  personId: string;
  starCount: number;
  // Add other properties if they exist
};

export const getPersonData = cache(async (person_id: string, userId: string | undefined) => {
  const users = await prisma.user.findMany({});
  const getAllPerson = await prisma.person.findMany();
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
      return person_id === popularitySentItem.personId;
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

  return {
    users,
    getComment,
    getPersons: mappedPersons,
    sortedUsers,
    getPersonDB,
    getAllPerson
  };
})
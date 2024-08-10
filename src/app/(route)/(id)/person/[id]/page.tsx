import { getCurrentUser } from "@/app/actions/getCurrentUser";
import FetchPerson from "../../../../component/ui/Fetching/FetchPerson";
import prisma from "@/lib/db";

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

  return (
    <FetchPerson
      tv_id={person_id}
      currentUser={currentUser}
      users={users}
      getComment={getComment}
      getPersons={getPersons}
    />
  );
}

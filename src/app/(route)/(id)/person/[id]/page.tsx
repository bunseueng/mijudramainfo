import { getCurrentUser } from "@/app/actions/getCurrentUser";
import FetchPerson from "../../../../component/ui/Fetching/FetchPerson";
import prisma from "@/lib/db";

export default async function PersonPage({ params }: any) {
  const tv_id = params.id;
  const currentUser = await getCurrentUser();
  const users = await prisma.user.findMany({});

  const getLoveofPerson = await prisma.person.findUnique({
    where: {
      personId: tv_id,
    },
  });

  const getComment = await prisma.comment.findMany({
    where: {
      postId: tv_id,
    },
  });

  return (
    <FetchPerson
      tv_id={tv_id}
      currentUser={currentUser}
      users={users}
      getComment={getComment}
      getLoveofPerson={getLoveofPerson}
    />
  );
}

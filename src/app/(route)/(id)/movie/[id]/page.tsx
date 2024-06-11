import { getCurrentUser } from "@/app/actions/getCurrentUser";
import MovieMain from "./MovieMain";
import prisma from "@/lib/db";

export default async function tvPage({ params }: any) {
  const movie_id = params.id;
  const user = await getCurrentUser();
  const users = await prisma.user.findMany({});

  const getComment = await prisma.comment.findMany({
    where: {
      postId: movie_id,
    },
  });

  return (
    <MovieMain
      movie_id={movie_id}
      user={user}
      users={users}
      getComment={getComment}
    />
  );
}

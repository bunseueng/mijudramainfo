import React from "react";
import prisma from "@/lib/db";
import PersonHeader from "../details/PersonHeader";
import PersonEditList from "../details/PersonEditList";
import PersonList from "../../PersonList";
import { Metadata } from "next";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const person_id = params.id;
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${person_id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&with_original_language=zh&region=CN`
  );
  const person = await response.json();

  return {
    title: `Edit ${person?.name}`,
    description: person?.biography,
  };
}

const PersonCastPage = async ({ params }: { params: { id: string } }) => {
  const person_id = params.id;
  const personDB = await prisma.person.findUnique({
    where: {
      personId: person_id,
    },
  });
  return (
    <div className="block w-full">
      <PersonList personId={person_id} />
      <PersonHeader person_id={person_id} personDB={personDB} />
      <div className="max-w-6xl mx-auto my-5 md:my-10 flex flex-col w-full h-auto mb-10 px-2 md:px-5">
        <PersonEditList person_id={person_id} personDB={personDB} />
      </div>
    </div>
  );
};

export default PersonCastPage;

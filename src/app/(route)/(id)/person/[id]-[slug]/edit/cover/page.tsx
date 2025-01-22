import React from "react";
import { Metadata } from "next";
import PersonHeader from "../details/PersonHeader";
import PersonEditList from "../details/PersonEditList";
import PersonList from "../../PersonList";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getPersonData, getPersonDetails } from "@/app/actions/personActions";
export async function generateMetadata(props: {
  params: Promise<{ "id]-[slug": string }>;
}): Promise<Metadata> {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("Person ID and slug are missing.");
  }

  const [person_id] = params["id]-[slug"].split("-");
  const data = await getPersonDetails(person_id);

  return {
    title: `${data.person?.results[0]?.original_name}'s Edit`,
    description: data.personDetails?.biography,
    keywords: data.personDetails?.also_known_as,
    openGraph: {
      type: "website",
      url: `https://mijudramainfo.vercel.app/person/${data.person?.results[0]?.id}`,
      title: data.person?.results[0]?.name,
      description: data.personDetails?.biography,
      images: [
        {
          url: `https://image.tmdb.org/t/p/original/${data.person?.results[0]?.profile_path}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const PersonCoverPage = async (props: {
  params: Promise<{ "id]-[slug": string }>;
}) => {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("Person ID and slug are missing.");
  }
  const [person_id] = params["id]-[slug"].split("-");
  const currentUser = await getCurrentUser();
  const { getPersons } = await getPersonData(person_id, currentUser?.id);
  return (
    <div className="block w-full">
      <PersonList personId={person_id} />
      <PersonHeader person_id={person_id} personDB={getPersons} />
      <div className="max-w-6xl mx-auto my-10 flex flex-col w-full h-auto mb-10 px-2 md:px-5">
        <PersonEditList person_id={person_id} personDB={getPersons} />
      </div>
    </div>
  );
};

export default PersonCoverPage;

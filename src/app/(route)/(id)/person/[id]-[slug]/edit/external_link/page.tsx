import React from "react";
import { Metadata } from "next";
import PersonHeader from "../details/PersonHeader";
import PersonEditList from "../details/PersonEditList";
import PersonList from "../../PersonList";
import { getPersonData, getPersonDetails } from "@/app/actions/personActions";
import { spaceToHyphen } from "@/lib/spaceToHyphen";

export async function generateMetadata(props: {
  params: Promise<{ "id]-[slug": string }>;
}): Promise<Metadata> {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("Person ID and slug are missing.");
  }

  const [person_id] = params["id]-[slug"].split("-");
  const data = await getPersonDetails(person_id);
  const url = `${process.env.BASE_URL}/person/${
    data.person?.results[0]?.id
  }-${spaceToHyphen(data.person?.results[0]?.name)}/edit/external_link`;
  const person_detail = data?.person?.results?.find(
    (p: any) => p.id === Number(person_id) // Convert person_id to number
  );
  return {
    title: `${person_detail?.name} (${person_detail?.original_name}) | Edit External Link`,
    description: data.personDetails?.biography,
    keywords: data.personDetails?.also_known_as,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: `${person_detail?.name} (${person_detail?.original_name}) | Edit External Link`,
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

const PersonExternalLinkPage = async (props: {
  params: Promise<{ "id]-[slug": string }>;
}) => {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("Person ID and slug are missing.");
  }
  const [person_id] = params["id]-[slug"].split("-");
  const { getPersons } = await getPersonData(person_id);

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

export default PersonExternalLinkPage;

import React from "react";
import PersonPhotoAlbum from "./PhotoAlbum";
import { getPersonData, getPersonDetails } from "@/app/actions/personActions";
import { Metadata } from "next";
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
  }-${spaceToHyphen(data.person?.results[0]?.name)}/photos`;

  return {
    title: `${data.person?.results[0]?.original_name}'s Photos`,
    description: data.personDetails?.biography,
    keywords: data.personDetails?.also_known_as,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: data?.person?.results[0]?.name,
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
const PhotosPage = async (props: { params: Promise<{ "id]-[slug": any }> }) => {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("Person ID and slug are missing.");
  }
  const [person_id] = params["id]-[slug"].split("-");
  const { getAllPerson } = await getPersonData(person_id);
  return <PersonPhotoAlbum personId={person_id} getPerson={getAllPerson} />;
};

export default PhotosPage;

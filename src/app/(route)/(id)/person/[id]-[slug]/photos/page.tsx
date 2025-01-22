import React from "react";
import PersonPhotoAlbum from "./PhotoAlbum";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getPersonData, getPersonDetails } from "@/app/actions/personActions";
import { Metadata } from "next";
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
    title: `${data.person?.results[0]?.original_name}'s Photos`,
    description: data.personDetails?.biography,
    keywords: data.personDetails?.also_known_as,
    openGraph: {
      type: "website",
      url: `https://mijudramainfo.vercel.app/person/${data.person?.results[0]?.id}`,
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
  const currentUser = await getCurrentUser();
  const { getAllPerson } = await getPersonData(person_id, currentUser?.id);
  return <PersonPhotoAlbum personId={person_id} getPerson={getAllPerson} />;
};

export default PhotosPage;

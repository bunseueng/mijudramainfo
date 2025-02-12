import { getCurrentUser } from "@/app/actions/getCurrentUser";
import FetchPerson from "@/app/component/ui/Fetching/FetchPerson";
import { Metadata } from "next";
import PersonList from "./PersonList";
import { Suspense } from "react";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { getPersonDetails } from "@/app/actions/personActions";
import { notFound } from "next/navigation";
import { spaceToHyphen } from "@/lib/spaceToHyphen";
export const revalidate = 3600;

export async function generateMetadata(props: {
  params: Promise<{ "id]-[slug": string }>;
}): Promise<Metadata> {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    throw new Error("Person ID and slug are missing.");
  }

  const [person_id] = params["id]-[slug"].split("-");
  const data = await getPersonDetails(person_id);
  const person_detail = data?.person?.results?.find(
    (p: any) => p.id === Number(person_id) // Convert person_id to number
  );
  const url = `${process.env.BASE_URL}/person/${
    data.person?.results[0]?.id
  }-${spaceToHyphen(data?.person?.results[0]?.name)}`;

  return {
    title: `${person_detail?.name} (${person_detail?.original_name})`,
    description: data.personDetails?.biography,
    keywords: data.personDetails?.also_known_as,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: data.person?.results[0]?.name,
      description: data.personDetails?.biography,
      images: [
        {
          url: `https://image.tmdb.org/t/p/original/${person_detail?.profile_path}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
export default async function PersonPage(props: {
  params: Promise<{ "id]-[slug": any }>;
}) {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    notFound();
  }
  const [person_id] = params["id]-[slug"].split("-");
  const currentUser = await getCurrentUser();
  // Add an artificial delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <Suspense key={person_id} fallback={<SearchLoading />}>
      <PersonList personId={person_id} />
      <FetchPerson person_id={person_id} currentUser={currentUser} />
    </Suspense>
  );
}

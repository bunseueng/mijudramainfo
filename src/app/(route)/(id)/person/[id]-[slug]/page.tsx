import { getCurrentUser } from "@/app/actions/getCurrentUser";
import FetchPerson from "@/app/component/ui/Fetching/FetchPerson";
import { Metadata } from "next";
import PersonList from "./PersonList";
import { cache, Suspense } from "react";
import SearchLoading from "@/app/component/ui/Loading/SearchLoading";
import { getPersonData, getPersonDetails } from "@/app/actions/personActions";
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

  return {
    title: `${data?.person?.results[0]?.name} (${data.person?.results[0]?.original_name})`,
    description: data.personDetails?.biography,
    keywords: data.personDetails?.also_known_as,
    openGraph: {
      type: "website",
      url: `https://mijudramainfo.vercel.app/person/${
        data.person?.results[0]?.id
      }-${spaceToHyphen(data?.person?.results[0]?.name)}`,
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
export default async function PersonPage(props: {
  params: Promise<{ "id]-[slug": any }>;
}) {
  const params = await props.params;
  if (!params["id]-[slug"]) {
    notFound();
  }
  const [person_id] = params["id]-[slug"].split("-");
  const currentUser = await getCurrentUser();
  const personData = await getPersonData(person_id);
  // Add an artificial delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <Suspense key={person_id} fallback={<SearchLoading />}>
      <PersonList personId={person_id} />
      <FetchPerson
        tv_id={person_id}
        currentUser={currentUser}
        {...personData}
      />
    </Suspense>
  );
}

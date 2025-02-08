"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPersonSearch } from "@/app/actions/fetchMovieApi";
import type { CommentProps, PersonDBType, UserProps } from "@/helper/type";
import PersonHeader from "../Person/PersonHeader";
import PersonInfo from "../Person/PersonInfo";
import TopContributors from "../Person/TopContributors";
import PopularitySection, { Popularity } from "../Person/PopularitySection";
import MainContent from "../Person/MainContent";
import SearchLoading from "../Loading/SearchLoading";
import { usePersonData } from "@/hooks/usePersonData";
import AdBanner from "../Adsense/AdBanner";
import { usePersonDatabase } from "@/hooks/usePersonDatabase";

interface IFetchPerson {
  person_id: number;
  currentUser: UserProps | any;
}

interface PopularityItem {
  personId: string;
  [key: string]: any;
}

const FetchPerson: React.FC<IFetchPerson> = ({ person_id, currentUser }) => {
  const { data } = usePersonDatabase(person_id.toString());
  const { users, getComment, getPersons, sortedUsers } = { ...data };
  const { person } = usePersonData(person_id.toString());
  const drama = person?.tv_credits || [];
  const movie = person?.movie_credits || [];
  const getCredits = person?.combined_credits || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [getPerson, setGetPerson] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);
  const currentPage = `https://mijudramalist.com/person/${person_id}`;

  const { data: personFullDetails } = useQuery({
    queryKey: ["personFullDetails", person?.name],
    queryFn: () => fetchPersonSearch(person?.name),
    staleTime: 3600000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const uniqueChanges = Array.from(
    new Map(
      getPersons?.changes?.map((change) => [change.userId, change])
    ).values()
  );

  const userContributions = useMemo(
    () =>
      getPersons?.changes?.reduce((acc: Record<string, number>, change) => {
        acc[change.userId] = (acc[change.userId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {},
    [getPersons?.changes]
  );

  const sortedChanges = useMemo(
    () =>
      uniqueChanges?.sort((a, b) => {
        const countA = userContributions[a.userId] || 0;
        const countB = userContributions[b.userId] || 0;
        return countB - countA;
      }),
    [uniqueChanges, userContributions]
  );

  const fetchRandomPerson = useCallback(async () => {
    if (isLoading || hasFetched.current) return;
    setIsLoading(true);
    hasFetched.current = true;

    try {
      const response = await fetch(
        `/api/person/${person?.id}/send-popularity`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Error fetching random person");
      }
      const data = await response.json();
      if (data && typeof data === "object") {
        const filteredPopularitySent = data.popularitySent
          ?.filter((array: any) => Array.isArray(array) && array.length > 0)
          ?.map((array: any) =>
            array.filter(
              (item: any) =>
                item && typeof item === "object" && Object.keys(item).length > 0
            )
          );
        const filteredData = {
          ...data,
          popularitySent: filteredPopularitySent,
        };
        setGetPerson(filteredData);
      } else {
        throw new Error("Invalid data structure received");
      }
    } catch (err: any) {
      console.error("Error fetching random person:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, [person?.id, isLoading]);

  useEffect(() => {
    hasFetched.current = false;
  }, [person?.id]);

  useEffect(() => {
    if (person?.id && !hasFetched.current) {
      fetchRandomPerson();
    }
  }, [person?.id, fetchRandomPerson]);

  const sentByIds = useMemo(() => getPerson?.sentBy || [], [getPerson?.sentBy]);
  const getPersonDetail = useMemo(
    () => users?.filter((user: any) => sentByIds.includes(user?.id)) || [],
    [users, sentByIds]
  );

  useEffect(() => {
    const fetchAndUpdatePerson = async () => {
      await fetchRandomPerson();
    };
    fetchAndUpdatePerson();
    const intervalId = setInterval(fetchAndUpdatePerson, 12000);
    return () => clearInterval(intervalId);
  }, [fetchRandomPerson]);

  const currentUsers = getPersonDetail[currentUserIndex];
  const currentPopularityItem = useMemo(
    () => currentUsers?.popularitySent?.flat() || [],
    [currentUsers?.popularitySent]
  );

  const filteredPopularity = useMemo(
    () =>
      (currentPopularityItem as PopularityItem[])?.filter(
        (p): p is PopularityItem =>
          p !== null &&
          typeof p === "object" &&
          "personId" in p &&
          p.personId === getPersons?.personId
      ) || [],
    [currentPopularityItem, getPersons?.personId]
  );

  useEffect(() => {
    if (getPersonDetail?.length > 0) {
      const currentUser = getPersonDetail[currentUserIndex];
      const popularityArray = currentUser?.popularitySent || [];

      if (popularityArray.length > 0) {
        const timer = setTimeout(() => {
          let nextIndex = currentIndex + 1;
          let nextUserIndex = currentUserIndex;

          if (nextIndex >= filteredPopularity.length) {
            nextIndex = 0;
            nextUserIndex = (currentUserIndex + 1) % getPersonDetail.length;
          }

          setCurrentIndex(nextIndex);
          setCurrentUserIndex(nextUserIndex);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [
    currentIndex,
    currentUserIndex,
    getPersonDetail,
    filteredPopularity.length,
  ]);

  useEffect(() => {
    if (!currentPopularityItem?.length) {
      return;
    }

    let validItems: PopularityItem[] = [];
    if (Array.isArray(currentPopularityItem)) {
      validItems = (currentPopularityItem as any[]).filter(
        (item): item is PopularityItem =>
          item !== null &&
          item !== undefined &&
          typeof item === "object" &&
          Object.keys(item).length > 0
      );
    } else if (
      typeof currentPopularityItem === "object" &&
      currentPopularityItem !== null &&
      Object.keys(currentPopularityItem).length > 0
    ) {
      validItems = [currentPopularityItem as PopularityItem];
    }

    if (validItems.length === 0) {
      return;
    }
  }, [currentPopularityItem]);

  if (!person) {
    return <SearchLoading />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="w-full lg:w-1/3">
          <div className="space-y-6">
            <PersonHeader
              persons={person}
              currentUser={currentUser}
              getPersons={getPersons as PersonDBType | null}
              currentPage={currentPage}
              personFullDetails={personFullDetails}
            />

            <div className="hidden lg:block bg-white dark:bg-[#242526] rounded-lg shadow-sm">
              <PersonInfo
                persons={person}
                personFullDetails={personFullDetails}
                getCredits={getCredits}
                person_db={getPersons as PersonDBType | null}
              />
            </div>

            <PopularitySection
              currentUser={currentUser}
              persons={person}
              getPersons={getPersons as PersonDBType | null}
              tv_id={person_id}
              sortedUsers={sortedUsers as UserProps[] | null}
              currentPopularityItem={
                currentPopularityItem as unknown as Popularity
              }
              filteredPopularity={filteredPopularity as Popularity[]}
              currentUsers={currentUsers}
              currentIndex={currentIndex}
            />
            <div className="hidden md:block">
              <TopContributors
                sortedChanges={sortedChanges}
                users={users as UserProps[]}
                getPersons={getPersons as PersonDBType | null}
              />
            </div>
          </div>
          <div className="w-full h-screen bg-gray-200 dark:bg-black my-10">
            <AdBanner dataAdFormat="auto" dataAdSlot="4321696148" />
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-2/3 mb-10">
          <MainContent
            persons={person}
            currentUser={currentUser}
            getPersons={getPersons as PersonDBType | null}
            drama={drama}
            movie={movie}
            users={users as UserProps[]}
            getComment={getComment as CommentProps[]}
            tv_id={person_id}
            personFullDetails={personFullDetails}
            sortedChanges={sortedChanges}
          />
        </div>
      </div>
    </div>
  );
};

export default FetchPerson;

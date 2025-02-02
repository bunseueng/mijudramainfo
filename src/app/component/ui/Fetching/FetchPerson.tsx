"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPersonSearch } from "@/app/actions/fetchMovieApi";
import type { CommentProps, PersonDBType, UserProps } from "@/helper/type";
import PersonHeader from "../Person/PersonHeader";
import PersonInfo from "../Person/PersonInfo";
import TopContributors from "../Person/TopContributors";
import PopularitySection from "../Person/PopularitySection";
import MainContent from "../Person/MainContent";
import SearchLoading from "../Loading/SearchLoading";
import { usePersonData } from "@/hooks/usePersonData";

interface IFetchPerson {
  tv_id: number;
  currentUser: UserProps | any;
  users: UserProps[];
  getComment: CommentProps[] | any;
  getPersons: PersonDBType | null;
  sortedUsers: UserProps[] | null;
}

const FetchPerson: React.FC<IFetchPerson> = ({
  tv_id,
  currentUser,
  users,
  getComment,
  getPersons,
  sortedUsers,
}) => {
  const { person } = usePersonData(tv_id.toString());
  const drama = person?.tv_credits || [];
  const movie = person?.movie_credits || [];
  const getCredits = person?.combined_credits || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [getPerson, setGetPerson] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false); // Track if the request has been made
  const currentPage = `https://mijudramalist.com/person/${tv_id}`;

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

  const userContributions =
    getPersons?.changes?.reduce((acc: Record<string, number>, change) => {
      acc[change.userId] = (acc[change.userId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  const sortedChanges = uniqueChanges?.sort((a, b) => {
    const countA = userContributions[a.userId] || 0;
    const countB = userContributions[b.userId] || 0;
    return countB - countA;
  });

  const fetchRandomPerson = useCallback(async () => {
    if (isLoading || hasFetched.current) return; // Prevent multiple requests
    setIsLoading(true);
    hasFetched.current = true; // Mark that the request has been made

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
      setIsLoading(false); // Reset loading state
    }
  }, [person?.id, isLoading]);

  useEffect(() => {
    hasFetched.current = false; // Reset the flag when persons?.id changes
  }, [person?.id]);

  useEffect(() => {
    if (person?.id && !hasFetched.current) {
      fetchRandomPerson();
    }
  }, [person?.id, fetchRandomPerson]);

  const sentByIds = getPerson?.sentBy || [];
  const getPersonDetail = users?.filter((user: any) =>
    sentByIds.includes(user?.id)
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentPopularityItem = currentUsers?.popularitySent?.flat() || [];
  const filteredPopularity =
    currentPopularityItem?.filter(
      (p: any) => p?.personId === getPersons?.personId
    ) || [];

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
    filteredPopularity?.length,
  ]);

  useEffect(() => {
    if (!currentPopularityItem?.length) {
      return;
    }

    let validItems;
    if (Array.isArray(currentPopularityItem)) {
      validItems = currentPopularityItem.filter(
        (item) => item !== undefined && Object.keys(item).length > 0
      );
    } else if (
      typeof currentPopularityItem === "object" &&
      Object.keys(currentPopularityItem).length > 0
    ) {
      validItems = [currentPopularityItem];
    } else {
      return;
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
              getPersons={getPersons}
              currentPage={currentPage}
              personFullDetails={personFullDetails}
            />

            <div className="hidden lg:block bg-white dark:bg-[#242526] rounded-lg shadow-sm">
              <PersonInfo
                persons={person}
                personFullDetails={personFullDetails}
                getCredits={getCredits}
                person_db={getPersons}
              />
            </div>

            <PopularitySection
              currentUser={currentUser}
              persons={person}
              getPersons={getPersons}
              tv_id={tv_id}
              sortedUsers={sortedUsers}
              currentPopularityItem={currentPopularityItem}
              filteredPopularity={filteredPopularity}
              currentUsers={currentUsers}
              currentIndex={currentIndex}
            />
            <div className="hidden md:block">
              <TopContributors
                sortedChanges={sortedChanges}
                users={users}
                getPersons={getPersons}
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-2/3 mb-10">
          <MainContent
            persons={person}
            currentUser={currentUser}
            getPersons={getPersons}
            drama={drama}
            movie={movie}
            users={users}
            getComment={getComment}
            tv_id={tv_id}
            personFullDetails={personFullDetails}
            sortedChanges={sortedChanges}
          />
        </div>
      </div>
    </div>
  );
};

export default FetchPerson;

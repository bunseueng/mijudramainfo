import Card from "../Card/Card";
import Person from "../Fetching/Person";
import { Suspense } from "react";
import SearchLoading from "../Loading/SearchLoading";
import DramaFilter from "@/app/(route)/(drama)/drama/top/DramaFilter";
import AdBanner from "../Adsense/AdBanner";

function getLevenshteinDistance(a: string, b: string) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export default function Results({
  results,
  items,
  searchQuery,
  BASE_URL,
  currentUser,
  getDrama,
  getMovie,
  getPerson,
}: any) {
  // Sort results by name similarity
  const sortedResults = [...(results || [])].sort((a, b) => {
    const nameA = (a.title || a.name || "").toLowerCase();
    const nameB = (b.title || b.name || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const distanceA = getLevenshteinDistance(nameA, query);
    const distanceB = getLevenshteinDistance(nameB, query);

    return distanceA - distanceB;
  });
  return (
    <div className="max-w-6xl relative flex flex-wrap items-center justify-between mx-auto px-4 my-7">
      <div className="w-full h-full flex flex-col md:flex-row justify-between">
        <div className="w-full md:w-[77.7777%] float-left px-1 md:px-2">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold">Search</h1>
            <p>{items} results</p>
          </div>
          <div className="h-full w-full py-2 overflow-hidden">
            {sortedResults?.map((result: any, idx: number) => (
              <div
                className="grid grid-cols-1 bg-white dark:bg-[#242424] border-2 dark:border-[#272727] rounded-lg mb-4"
                key={idx}
              >
                {!result.gender && !result.known_for ? (
                  <Card
                    key={idx}
                    result={result}
                    results={results}
                    searchQuery={searchQuery}
                    BASE_URL={BASE_URL}
                    getDrama={getDrama}
                    getMovie={getMovie}
                  />
                ) : (
                  <Person
                    key={idx}
                    result={result}
                    results={results}
                    searchQuery={searchQuery}
                    BASE_URL={BASE_URL}
                    currentUser={currentUser}
                    getPerson={getPerson}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-2/6 pl-1 md:pl-3 lg:pl-3">
          <div className="py-3 hidden md:block">
            <AdBanner dataAdFormat="auto" dataAdSlot="3527489220" />
          </div>
          <div className="border bg-white dark:bg-[#242424] rounded-lg">
            <h1 className="text-lg font-bold p-4 border-b-2 border-b-slate-400 dark:border-[#272727]">
              Advanced Search
            </h1>
            <Suspense fallback={<SearchLoading />}>
              <DramaFilter />
            </Suspense>
          </div>
          <div className="hidden md:block relative bg-black mx-auto my-5">
            <div className="min-w-auto min-h-screen">
              <AdBanner dataAdFormat="auto" dataAdSlot="4321696148" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

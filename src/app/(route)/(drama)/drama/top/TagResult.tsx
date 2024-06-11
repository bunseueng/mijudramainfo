import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";

const TagResult = ({
  searchParams,
  setSearchQueryKeyword,
  searchQueryKeyword,
  router,
  showResult,
  setShowResult,
  pathname,
}: any) => {
  const queries = searchParams.get("query") ?? "";
  const currentPage = parseInt(searchParams.get("page") || "1");

  const onInput = (e: any) => {
    const { name, value } = e.target;
    // Update the corresponding state variable based on the input's name
    if (name === "searchQueryKeyword") {
      setSearchQueryKeyword(value);
    }
    const params = new URLSearchParams(searchParams);
    // Update the query parameter based on the input's name
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    e.preventDefault();
    router.push(`${pathname}/?${params.toString()}`, {
      scroll: false,
    });
  };

  const fetchMultiSearch = async (pages = 1) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/keyword?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${queries}&language=en-US&with_original_language=zh&region=CN&season&page=${pages}`
    );
    const data = await res.json();
    return data.results;
  };

  const { data: keyword, isLoading } = useQuery({
    queryKey: ["keywords", queries],
    queryFn: () => fetchMultiSearch(currentPage),
  });

  const addToSelectedResults = (itemName: any, key: any, value: any) => {
    setShowResult([...showResult, itemName]);
    // Update query parameter when adding a keyword
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    const query = Object.fromEntries(params);
    let values = query[key] ? query[key].split(",") : [];

    if (values.includes(value)) {
      values = values.filter((v) => v !== value);
    } else {
      values.push(value);
    }

    if (values.length === 0) {
      delete query[key];
    } else {
      query[key] = values.join(",");
    }

    const queryString = new URLSearchParams(query).toString();
    router.push(`${pathname}/?${queryString}`, {
      scroll: false,
    });
    // Reset the searchQueryKeyword state to clear the input field
    setSearchQueryKeyword("");
  };

  const handleCloseResult = (index: number) => {
    // Create a copy of the showResult array
    const updatedResult = [...showResult];
    // Remove the result at the specified index
    updatedResult.splice(index, 1);
    // Update the showResult state with the modified array
    setShowResult(updatedResult);

    // Parse the current query parameters from the URL
    const params = new URLSearchParams(searchParams);
    // Get the value of the "keywords" parameter
    const keywords = params.get("keywords");
    if (keywords) {
      // Split the keywords string into an array
      const keywordArray = keywords.split(",");
      // Remove the keyword at the specified index
      keywordArray.splice(index, 1);
      // Update the "keywords" parameter with the modified array
      params.set("keywords", keywordArray.join(","));
      // Update the URL with the modified query parameters
      const queryString = params.toString();
      router.push(`${pathname}/?${queryString}`, {
        scroll: false,
      });
    }
  };

  if (isLoading) {
    <div className="">Fetching...</div>;
  }

  return (
    <>
      <div className="flex flex-wrap pb-2">
        {showResult.map((result: any, index: number) => (
          <div key={index}>
            <p className="flex items-center border text-white bg-green-400 px-2 py-1 rounded-md">
              {result}
              <span className="text-white ml-2 cursor-pointer">
                <IoCloseCircleSharp onClick={() => handleCloseResult(index)} />
              </span>
            </p>
          </div>
        ))}
      </div>
      <div className="relative">
        <input
          id="keyword"
          name="searchQueryKeyword"
          type="text"
          placeholder="Search for keywords"
          className=" w-full px-4 py-2 border border-solid border-neutral-200 bg-transparent bg-clip-padding text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-neutral-500 focus:z-[3] focus:border-cyan-400 focus:shadow-inset focus:outline-none motion-reduce:transition-none dark:border-white/10 dark:text-white dark:placeholder:text-neutral-200 dark:autofill:shadow-autofill dark:focus:border-y-cyan-400 rounded-lg"
          onChange={onInput}
          value={searchQueryKeyword}
        />
        <FaSearch className="absolute right-4 top-3" />
      </div>
      <div
        className={`bg-white text-black border border-slate-400 rounded-lg shadow-xl my-2 cursor-pointer ${
          keyword?.length < 1 ? "hidden" : "block"
        }`}
      >
        <div className="flex flex-col h-[200px] overflow-y">
          {keyword?.map((item: any) => {
            // Split the name into words
            const words = item?.name?.split(" ");
            // Capitalize the first letter of each word
            const capitalizedWords = words?.map((word: any) => {
              return word.charAt(0).toUpperCase() + word.slice(1);
            });
            // Join the words back together
            const capitalizedName = capitalizedWords?.join(" ");
            // Render the capitalized name
            return (
              <div
                key={item.id}
                className="hover:bg-slate-200 transform duration-300 px-5 py-3"
                onClick={() =>
                  addToSelectedResults(capitalizedName, "keywords", item.id)
                }
              >
                {capitalizedName}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TagResult;

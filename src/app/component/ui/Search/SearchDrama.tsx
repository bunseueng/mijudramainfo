"use client";

import { SearchParamsType } from "@/helper/type";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const SearchDrama = () => {
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const query = searchParams?.get("query") ?? "";
  const router = useRouter();

  const updateQueryParams = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(
      searchParams as unknown as SearchParamsType
    );
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    router.push(`${pathname}/?${params.toString()}`);
  }, 300);

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
    updateQueryParams(value);
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(
      searchParams as unknown as SearchParamsType
    );
    if (search) {
      params.set("query", search);
    } else {
      params.delete("query");
    }
    // Push the updated query parameters immediately
    router.push(`/search/?${params.toString()}`);
  };

  return (
    <form
      className="flex justify-between max-w-6xl mx-auto"
      onSubmit={onSearch}
    >
      <div className="w-full mt-5">
        <div className="relative">
          <input
            type="text"
            placeholder="Search your favorite Drama/Movie/Actor..."
            className="w-full px-5 py-2 md:py-3 rounded-full text-black dark:text-white text-sm md:text-md font-semibold"
            name="homeSearch"
            onChange={onInput}
            value={search}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pl-3 pointer-events-none">
            <button
              type="submit"
              className="bg-gradient-to-r from-teal-400 to-blue-400 rounded-r-full px-5 py-1 md:py-2"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <button className="text-amber-600 disabled:text-gray-400"></button>
    </form>
  );
};

export default SearchDrama;

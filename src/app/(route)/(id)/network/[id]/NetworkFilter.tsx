import type React from "react";
import { BiSort } from "react-icons/bi";

export const NetworkFilter = ({
  genre,
  setGenre,
  setWithoutGenre,
  sortby,
  setSortby,
}: {
  genre: string;
  setGenre: (genre: string) => void;
  setWithoutGenre: (withoutGenre: string) => void;
  sortby: string | undefined;
  setSortby: (sortby: string) => void;
}) => {
  return (
    <>
      <div className="inline-block">
        <BiSort className="inline-block" />{" "}
        <span className="align-middle">Sort By</span>
      </div>
      <div className="mt-4">
        <div className="border-b border-b-slate-400">Type:</div>
        <div className="relative float-left w-full text-left mb-4 my-5">
          <div className="-mx-3">
            <div className="relative float-left w-full px-3">
              <label
                className={`flex items-center text-sm transform duration-300 cursor-pointer ${
                  genre === "18" ? "text-[#409eff] font-bold" : ""
                }`}
              >
                <input
                  type="radio"
                  name="18"
                  value="18"
                  checked={genre === "18"}
                  onChange={() => {
                    setGenre("18");
                    setWithoutGenre("16|10767|10764|35");
                  }}
                  className="transform duration-300 cursor-pointer mr-2"
                />
                <span>Drama</span>
              </label>
            </div>
            <div className="relative float-left w-full px-3 mt-2">
              <label
                className={`flex items-center text-sm transform duration-300 cursor-pointer ${
                  genre === "16" ? "text-[#409eff] font-bold" : ""
                }`}
              >
                <input
                  type="radio"
                  name="16"
                  value="16"
                  checked={genre === "16"}
                  onChange={() => {
                    setGenre("16");
                    setWithoutGenre("10767|10764");
                  }}
                  className="transform duration-300 cursor-pointer mr-2"
                />
                <span>Anime</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <SortOption
        title="Popularity"
        options={[
          { value: "popularity.asc", label: "Ascending" },
          { value: "popularity.desc", label: "Descending" },
        ]}
        sortby={sortby}
        setSortby={setSortby}
      />
      <SortOption
        title="Rating"
        options={[
          { value: "vote_average.asc", label: "Ascending" },
          { value: "vote_average.desc", label: "Descending" },
        ]}
        sortby={sortby}
        setSortby={setSortby}
      />
      <SortOption
        title="First Air Date"
        options={[
          { value: "first_air_date.asc", label: "Ascending" },
          { value: "first_air_date.desc", label: "Descending" },
        ]}
        sortby={sortby}
        setSortby={setSortby}
      />
    </>
  );
};

const SortOption: React.FC<{
  title: string;
  options: { value: string; label: string }[];
  sortby: string | undefined;
  setSortby: (sortby: string) => void;
}> = ({ title, options, sortby, setSortby }) => {
  return (
    <div className="mt-5">
      <div className="border-b border-b-slate-400">{title}:</div>
      <div className="relative float-left w-full text-left mb-4 my-5">
        <div className="-mx-3">
          {options.map((option, index) => (
            <div
              key={option.value}
              className={`relative float-left w-full px-3 ${
                index > 0 ? "mt-2" : ""
              }`}
            >
              <label
                className={`flex items-center text-sm transform duration-300 cursor-pointer ${
                  sortby === option.value ? "text-[#409eff] font-bold" : ""
                }`}
              >
                <input
                  type="radio"
                  name={option.value}
                  value={option.value}
                  checked={sortby === option.value}
                  onChange={() => setSortby(option.value)}
                  className="transform duration-300 cursor-pointer mr-2"
                />
                <span>{option.label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { countryToNationalityMap } from "@/helper/item-list";
import { PersonDBType, PersonDetail } from "@/helper/type";

interface PersonInfoProps {
  persons: any;
  personFullDetails: any;
  getCredits?: any;
  person_db: PersonDBType | null;
}

export default function PersonInfo({
  persons,
  personFullDetails,
  getCredits,
  person_db,
}: PersonInfoProps) {
  const [detail]: PersonDetail[] = (person_db?.details ||
    []) as unknown as PersonDetail[];

  const calculatedAge =
    detail?.birthday || persons?.birthday
      ? Math.abs(
          new Date(
            Date.now() -
              new Date(detail?.birthday || persons.birthday).getTime()
          ).getUTCFullYear() - 1970
        )
      : 0;

  const knownCredits = getCredits
    ? (getCredits?.cast?.length || 0) + (getCredits?.crew?.length || 0)
    : 0;

  // Function to get nationality from place of birth
  const getNationality = (place_of_birth: string) => {
    if (!place_of_birth) return "";

    const parts = place_of_birth.split(", ");
    const country = parts[parts.length - 1].trim();

    if ((countryToNationalityMap as Record<string, string>)[country]) {
      return (countryToNationalityMap as Record<string, string>)[country];
    }

    const countryKeys = Object.keys(countryToNationalityMap);
    const matchingKey = countryKeys.find(
      (key) =>
        country.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(country.toLowerCase())
    );

    return matchingKey
      ? (countryToNationalityMap as Record<string, string>)[matchingKey]
      : "";
  };
  return (
    <div className="py-4">
      <div className="my-2">
        <h1 className="text-md font-semibold px-3 md:px-6">Native Name</h1>
        <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
          {detail?.native_name || personFullDetails?.original_name || "N/A"}
        </p>
      </div>
      <div className="my-2">
        <h1 className="text-md font-semibold px-3 md:px-6">Career</h1>
        <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
          {persons?.known_for_department}
        </p>
      </div>
      {getCredits && (
        <div className="my-2">
          <h1 className="text-md font-semibold px-3 md:px-6">Known Credits</h1>
          <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
            {String(knownCredits)}
          </p>
        </div>
      )}
      <div className="my-2">
        <h1 className="text-md font-semibold px-3 md:px-6">Gender</h1>
        <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
          {detail?.gender || persons?.gender === 1 ? "Female" : "Male"}
        </p>
      </div>
      <div className="my-2">
        <h1 className="text-md font-semibold px-3 md:px-6">Birthday</h1>
        <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
          {detail?.birthday || persons?.birthday} ({String(calculatedAge)} years
          old)
        </p>
      </div>
      <div className="my-2">
        <h1 className="text-md font-semibold px-3 md:px-6">Place of Birth</h1>
        <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
          {persons?.place_of_birth || "?"}
        </p>
      </div>{" "}
      <div className="my-2">
        <h1 className="text-md font-semibold px-3 md:px-6">Nationality</h1>
        <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
          {detail?.nationality ||
            getNationality(persons?.place_of_birth) ||
            "?"}
        </p>
      </div>
      <div className="my-2">
        <h1 className="text-md font-semibold px-3 md:px-6">Also Known As</h1>
        <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
          {detail?.also_known_as || persons?.also_known_as?.join(" , ")}
        </p>
      </div>
    </div>
  );
}

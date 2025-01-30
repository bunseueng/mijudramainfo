interface PersonInfoProps {
  persons: any;
  personFullDetails: any;
  getCredits?: any;
}

export default function PersonInfo({
  persons,
  personFullDetails,
  getCredits,
}: PersonInfoProps) {
  const calculatedAge = persons?.birthday
    ? Math.abs(
        new Date(
          Date.now() - new Date(persons.birthday).getTime()
        ).getUTCFullYear() - 1970
      )
    : 0;

  const knownCredits = getCredits
    ? (getCredits?.cast?.length || 0) + (getCredits?.crew?.length || 0)
    : 0;

  return (
    <div className="py-4">
      <div className="my-2">
        <h1 className="text-md font-semibold px-3 md:px-6">Native Name</h1>
        <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
          {personFullDetails?.results[0]?.original_name || "N/A"}
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
          {persons?.gender === 1 ? "Female" : "Male"}
        </p>
      </div>
      <div className="my-2">
        <h1 className="text-md font-semibold px-3 md:px-6">Birthday</h1>
        <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
          {persons?.birthday} ({String(calculatedAge)} years old)
        </p>
      </div>
      <div className="my-2">
        <h1 className="text-md font-semibold px-3 md:px-6">Place of Birth</h1>
        <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
          {persons?.place_of_birth}
        </p>
      </div>
      <div className="my-2">
        <h1 className="text-md font-semibold px-3 md:px-6">Also Known As</h1>
        <p className="text-slate-500 dark:text-[hsla(0,0%,100%,0.87)] text-xs font-normal px-3 md:px-6">
          {persons?.also_known_as?.join(" , ")}
        </p>
      </div>
    </div>
  );
}

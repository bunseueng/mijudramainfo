import Link from "next/link";
import { useState } from "react";

interface BiographyProps {
  persons: any;
}

export default function PersonBiography({ persons }: BiographyProps) {
  const [more, setMore] = useState(false);

  if (!persons?.biography) {
    return (
      <div className="text-md font-semibold text-start pb-5">
        {persons?.name} currently has no biography. <Link prefetch={false} href={`/person/${persons?.id}/edit/details`} className="text-blue-500 hover:opacity-80 transform duration-300">Edit Biography</Link>
      </div>
    );
  }

  return (
    <div className="inline-block mt-5">
      <p className="text-xl font-bold">Biography: </p>
      {persons.biography.split("\n").map((paragraph: string, index: number) => (
        <span key={index} className="text-sm">
          <span>
            {paragraph}
            {index === persons.biography.split("\n").length - 1 && (
              <Link
                prefetch={false}
                href={`/person/${persons?.id}/edit`}
                className="text-sm text-[#1675b6] ml-1"
                onClick={() => setMore(!more)}
              >
                Edit Translation
              </Link>
            )}
          </span>
          <br />
        </span>
      ))}
    </div>
  );
}

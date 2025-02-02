import { PersonDetail } from "@/helper/type";
import Link from "next/link";
import { useState } from "react";

interface BiographyProps {
  persons: any;
  detail: PersonDetail;
}

export default function PersonBiography({ persons, detail }: BiographyProps) {
  const [more, setMore] = useState(false);

  const fullName = `${detail?.last_name ?? ""} ${
    detail?.first_name ?? ""
  }`.trim();

  if (!persons?.biography && !detail?.biography) {
    return (
      <div className="text-md font-semibold text-start pb-5 px-4 md:px-0">
        {fullName || persons?.name} currently has no biography.{" "}
        <Link
          prefetch={false}
          href={`/person/${persons?.id}/edit/details`}
          className="text-blue-500 hover:opacity-80 transform duration-300"
        >
          Edit Biography
        </Link>
      </div>
    );
  }

  return (
    <div className="inline-block mt-3">
      <p className="text-xl font-bold mb-4">Biography: </p>
      {detail?.biography ? (
        <span>{detail?.biography}</span>
      ) : (
        <>
          {persons.biography
            .split("\n")
            .map((paragraph: string, index: number) => (
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
        </>
      )}
    </div>
  );
}

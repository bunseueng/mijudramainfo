import Link from "next/link";
import React from "react";

const LinkPreview = ({ linkPreview }: any) => {
  return (
    <div className="border rounded-md my-4 mx-3">
      {linkPreview !== null && (
        <div className="flex flex-col lg:flex-row">
          <div
            className="w-full h-48 lg:h-auto bg-cover bg-center rounded-l-md"
            style={{
              backgroundImage: `url(${
                linkPreview?.image !== null
                  ? linkPreview?.image
                  : "/placeholder-image.avif"
              })`,
            }}
          />
          <div className="flex flex-col p-3">
            <Link
              prefetch={false}
              href={`${linkPreview?.url}`}
              className="text-[#2490da]"
            >
              {linkPreview?.title}
            </Link>
            <p className="text-sm">{linkPreview?.description}</p>
            <p className="text-sm text-foreground-muted opacity-60">
              {linkPreview?.publisher}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkPreview;

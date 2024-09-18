"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

export function SearchPagination({
  totalItems,
  setPage,
  per_page,
}: {
  totalItems: number;
  setPage: (page: number) => void;
  per_page: string;
}) {
  const path = usePathname();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const perPage = parseInt(searchParams?.get("per_page") || per_page);

  const totalPages = Math.ceil(totalItems / perPage);
  const currentPageGroup = Math.ceil(currentPage / 6);
  const startPageIndex = (currentPageGroup - 1) * 6 + 1;
  let endPageIndex = Math.min(startPageIndex + 5, totalPages);

  // Adjust endPageIndex to show next 3 pages when currentPage is a multiple of 6
  if (currentPage % 6 === 0 && currentPage !== totalPages) {
    endPageIndex = Math.min(startPageIndex + 8, totalPages);
  }

  const pageNumbers: number[] = [];
  for (let i = startPageIndex; i <= endPageIndex; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageIndex: number) => {
    setPage(pageIndex);
  };

  const showPrevious = currentPage > 1;
  const showNext = currentPage < totalPages;

  return (
    <Pagination className="flex flex-wrap items-start justify-start px-1 md:px-4 z-50">
      <PaginationContent className="flex-wrap">
        {showPrevious && (
          <PaginationItem>
            <PaginationPrevious
              className="border border-slate-200 rounded-md bg-white dark:bg-[#242424] dark:border-[#272727]"
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              href={`${path}?${new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                page: String(Math.max(currentPage - 1, 1)),
              }).toString()}`}
            />
          </PaginationItem>
        )}
        {pageNumbers.map((pageIndex) => (
          <PaginationItem key={pageIndex}>
            <PaginationLink
              href={`${path}?${new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                page: String(pageIndex),
              }).toString()}`}
              onClick={() => handlePageChange(pageIndex)}
              className={`bg-white border border-slate-200 px-4 py-2 rounded-sm cursor-pointer dark:bg-[#242424] dark:border-[#272727] ${
                pageIndex === currentPage
                  ? "bg-cyan-500 text-white dark:bg-cyan-500"
                  : ""
              }`}
            >
              {pageIndex}
            </PaginationLink>
          </PaginationItem>
        ))}
        {showNext && (
          <PaginationItem>
            <PaginationNext
              className="border border-slate-200 rounded-md bg-white dark:bg-[#242424] dark:border-[#272727]"
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
              href={`${path}?${new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                page: String(Math.min(currentPage + 1, totalPages)),
              }).toString()}`}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

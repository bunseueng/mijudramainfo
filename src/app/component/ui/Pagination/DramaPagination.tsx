"use client";

import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

export function DramaPagination({ totalItems, setPage }: any) {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const perPage = parseInt(searchParams?.get("per_page") || "20");

  const totalPages = Math.ceil(totalItems / perPage);
  const currentPageGroup = Math.ceil(currentPage / 5); // Change 6 to 5 for a group of 5 pages
  const startPageIndex = (currentPageGroup - 1) * 5 + 1;
  let endPageIndex = Math.min(startPageIndex + 4, totalPages);
  // Change 5 to 4 for a group of 5 pages

  // Adjust endPageIndex to show next 3 pages when currentPage is a multiple of 6
  if (currentPage % 6 === 0 && currentPage !== totalPages) {
    endPageIndex = Math.min(startPageIndex + 8, totalPages);
  }

  const pageNumbers: any[] = [];
  for (let i = startPageIndex; i <= endPageIndex; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageIndex: number) => {
    setPage(pageIndex);
  };

  return (
    <Pagination className="flex items-start justify-start">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="border border-slate-200 rounded-md bg-white dark:bg-[#242424] dark:border-[#272727]"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            href={`${
              currentPage === 1
                ? `?${new URLSearchParams({ page: 1 as any })}`
                : `?${new URLSearchParams({ page: (currentPage - 1) as any })}`
            }`}
          />
        </PaginationItem>
        {pageNumbers.map((pageIndex: number) => (
          <PaginationItem key={pageIndex}>
            <PaginationLink
              href={`?${new URLSearchParams({
                page: pageIndex as any, // Set the page based on the link index
              })}`}
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
        <PaginationItem>
          <PaginationNext
            className="border border-slate-200 rounded-md bg-white dark:bg-[#242424] dark:border-[#272727]"
            onClick={() => {
              handlePageChange(Math.min(currentPage + 1, totalPages));
            }}
            href={`${
              currentPage === totalPages
                ? `?${new URLSearchParams({ page: totalPages as any })}`
                : `?${new URLSearchParams({ page: (currentPage + 1) as any })}`
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

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

export function SearchPagination({ totalItems, setPage }: any) {
  const path = usePathname();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const perPage = parseInt(searchParams?.get("per_page") || "20");
  const nextPage =
    currentPage === totalItems ? totalItems : parseInt(currentPage as any) + 1;
  const nextPageParams = new URLSearchParams(searchParams?.toString());
  nextPageParams.set("page", nextPage.toString());
  const queryString = nextPageParams.toString();
  const prevPage = currentPage === 1 ? 1 : parseInt(currentPage as any) - 1;
  const prevPageParams = new URLSearchParams(searchParams?.toString());
  prevPageParams.set("page", prevPage.toString());
  const prevQueryString = prevPageParams.toString();

  const totalPages = Math.ceil(totalItems / perPage);
  const currentPageGroup = Math.ceil(currentPage / 6);
  const startPageIndex = (currentPageGroup - 1) * 6 + 1;
  let endPageIndex = Math.min(startPageIndex + 5, totalPages);
  const searchParamsEntries = searchParams?.entries() ?? [];
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
    <Pagination className="flex flex-wrap items-start justify-start px-1 md:px-4">
      <PaginationContent className="flex-wrap">
        <PaginationItem>
          <PaginationPrevious
            className="border border-slate-200 rounded-md bg-white dark:bg-[#242424] dark:border-[#272727]"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            href={`${path}?${prevQueryString}`}
          />
        </PaginationItem>
        {pageNumbers.map((pageIndex: number) => (
          <PaginationItem key={pageIndex}>
            <PaginationLink
              href={`${path}/?${new URLSearchParams({
                ...Object.fromEntries(searchParamsEntries),
                page: pageIndex.toString(), // Set the page based on the link index
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
            href={`${path}?${queryString}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

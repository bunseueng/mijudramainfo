"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import ClipLoader from "react-spinners/ClipLoader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MoreVertical, X } from "lucide-react";
import ShowCard from "./ShowCard";
import { currentUserProps, TVShow, UserProps } from "@/helper/type";
import { fetchMultiSearch } from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import FetchingPersonSearch from "@/app/component/ui/Fetching/FetchingPersonSearch";

interface IActionModal {
  feedId: string;
  feed: any;
  user: UserProps | null;
  currentUser: currentUserProps | null;
  openSearch: boolean;
  setStoredData: (data: any) => void;
  mediaIds: number[];
  setMediaIds: (value: number[]) => void;
}

const ActionModal = ({
  feedId,
  feed,
  user,
  openSearch,
  setStoredData,
  currentUser,
  mediaIds,
  setMediaIds,
}: IActionModal) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpoiler, setIsSpoiler] = useState(feed?.spoiler);
  const [currentFeed, setCurrentFeed] = useState(feed?.content);
  const [editContent, setEditContent] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportExplanation, setReportExplanation] = useState("");
  const [item, setItem] = useState(feed?.tag);
  const router = useRouter();
  const searchQuery = useSearchParams();
  const query = searchQuery?.get("q") || "";

  const {
    data: dynamicSearch,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["multiSearchs"],
    queryFn: () => fetchMultiSearch(query),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });

  const handleRemoveItem = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    indexToRemove: number
  ) => {
    e.preventDefault();
    setItem((prevItems: any) =>
      prevItems.filter((_: any, idx: number) => idx !== indexToRemove)
    );
  };

  const handleDelete = (feed: any) => {
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (feed: any) => {
    setEditContent(feed.content);
    setIsEditModalOpen(true);
  };

  const handleReport = (feed: any) => {
    setCurrentFeed(feed);
    setIsReportModalOpen(true);
  };

  const updatingFeed = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/feeds/${user?.name}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          editContent,
          currentFeed,
          item,
          isSpoiler,
        }),
      });

      if (res.status === 200) {
        toast.success("Success");
        router.refresh();
        setIsEditModalOpen(false);
      } else if (res.status === 404) {
        toast.error("Invalid User");
      }
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletingFeeds = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/feeds/${user?.name}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: feed?.id,
        }),
      });
      if (res.status === 200) {
        toast.success("Success");
        router.refresh();
        setIsDeleteModalOpen(false);
      } else if (res.status === 404) {
        toast.error("Invalid User");
      }
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const reportingFeeds = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/feeds/${user?.name}/report`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          reason: reportReason,
          explanation: reportExplanation,
        }),
      });
      if (res.status === 200) {
        toast.success("Success");
        router.refresh();
        setIsDeleteModalOpen(false);
      } else if (res.status === 404) {
        toast.error("Invalid User");
      }
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    refetch();
  }, [query, refetch]);
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {currentUser?.id === feed?.userId && (
            <>
              <DropdownMenuItem
                onClick={() => handleEdit(feedId)}
                className="cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(feedId)}
                className="cursor-pointer"
              >
                Delete
              </DropdownMenuItem>
            </>
          )}
          {currentUser?.id !== feed?.userId && (
            <DropdownMenuItem
              onClick={() => handleReport(feedId)}
              className="cursor-pointer"
            >
              Report
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this post?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deletingFeeds}>
              {isLoading ? (
                <ClipLoader color="#c3c3c3" loading={isLoading} size={14} />
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Edit your post..."
            className="min-h-[100px]"
            defaultValue={feed?.content}
          />
          {item?.length > 0 === false && (
            <div className="block relative">
              <FetchingPersonSearch
                dynamicSearch={dynamicSearch}
                isFetching={isFetching}
                searchQuery={searchQuery as string | any}
                openSearch={openSearch}
                mediaIds={mediaIds}
                setMediaIds={setMediaIds}
                setStoredData={setStoredData}
                setItem={setItem}
                query={query}
              />
            </div>
          )}

          {item?.map((show: TVShow, idx: number) => (
            <div
              key={show?.id}
              className="relative w-full h-full dark:bg-[#232425] rounded-sm my-2"
            >
              <ShowCard show={show} />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={(e) => handleRemoveItem(e, idx)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cancel tag</span>
              </Button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="spoiler"
              checked={isSpoiler}
              onCheckedChange={(checked) => setIsSpoiler(checked as boolean)}
            />
            <Label htmlFor="spoiler" className="cursor-pointer">
              Spoiler
            </Label>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={updatingFeed}>
              {isLoading ? (
                <ClipLoader color="#c3c3c3" loading={isLoading} size={14} />
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Post</DialogTitle>
          </DialogHeader>
          <RadioGroup onValueChange={setReportReason}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="spam" id="spam" />
              <Label htmlFor="spam">Spam</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="harassment" id="harassment" />
              <Label htmlFor="harassment">Harassment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inappropriate" id="inappropriate" />
              <Label htmlFor="inappropriate">Inappropriate Content</Label>
            </div>
          </RadioGroup>
          <Textarea
            value={reportExplanation}
            onChange={(e) => setReportExplanation(e.target.value)}
            placeholder="Provide additional details..."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button onClick={() => setIsReportModalOpen(false)}>Cancel</Button>
            <Button onClick={reportingFeeds}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionModal;

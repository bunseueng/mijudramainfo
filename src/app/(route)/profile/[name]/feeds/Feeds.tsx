"use client";

import { useState, useRef, useEffect, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Link as LinkIcon,
  Image as ImageIcon,
  ThumbsUp,
  MessageCircle,
  Share2,
  X,
  EyeOff,
  Eye,
  Copy,
} from "lucide-react";
import Image from "next/image";
import { CommentProps, currentUserProps, IProfileFeeds } from "@/helper/type";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchMultiSearch } from "@/app/actions/fetchMovieApi";
import { useQuery } from "@tanstack/react-query";
import FetchingTv from "@/app/component/ui/Fetching/FetchingTv";
import { toast } from "react-toastify";
import { formatDate } from "@/app/actions/formatDate";
import { User } from "../ProfileItem";
import ShowCard from "./ShowCard";
import LinkPreview from "./LinkPreview";
import ActionModal from "./ActionModal";
import Discuss from "@/app/(route)/(id)/tv/[id]/discuss/Discuss";
import ClipLoader from "react-spinners/ClipLoader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFeedsType, TProfileFeeds } from "@/helper/zod";

type CommentType = {
  getComment: CommentProps[];
};
export default function Feeds({
  user,
  users,
  getFeeds,
  getComment,
  currentUser,
}: User & IProfileFeeds & CommentType) {
  const [postText, setPostText] = useState("");
  const [postLink, setPostLink] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [tempLink, setTempLink] = useState("");
  const [linkPreview, setLinkPreview] = useState<any>();
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean[]>([]);
  const [revealedItems, setRevealedItems] = useState<boolean[]>([]);
  const [revealedComment, setRevealedComment] = useState<boolean[]>([]);
  const [tvIds, setTvIds] = useState<number[]>([]);
  const [storedData, setStoredData] = useState<any[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [shareUrl, setShareUrl] = useState("");
  const [feedId, setFeedId] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();
  const setQuery = "query";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchQuery = useSearchParams();
  const query = searchQuery?.get("query") || "";
  const { register, handleSubmit } = useForm<TProfileFeeds>({
    resolver: zodResolver(ProfileFeedsType),
  });

  const {
    data: dynamicSearch,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["tvSearch"],
    queryFn: () => fetchMultiSearch(query),
    staleTime: 3600000, // Cache data for 1 hour
    refetchOnWindowFocus: true, // Refetch when window is focused
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPostImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancelImage = () => {
    setPostImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveItem = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    indexToRemove: number
  ) => {
    e.preventDefault();
    setStoredData((prevItems) =>
      prevItems.filter((_, idx) => idx !== indexToRemove)
    );
  };

  const toggleReveal = (idx: number) => {
    setRevealedItems((prev) => {
      const newRevealedItems = [...prev];
      newRevealedItems[idx] = !newRevealedItems[idx];
      // Toggle the specific item
      return newRevealedItems;
    });
  };

  const toggleComment = (idx: number) => {
    setRevealedComment((prev) => {
      const newRevealedItems = [...prev];
      newRevealedItems[idx] = !newRevealedItems[idx];
      // Toggle the specific item
      return newRevealedItems;
    });
  };

  const handleLinkConfirm = async () => {
    if (!tempLink) {
      console.error("No URL provided for metadata fetching");
      return;
    }
    try {
      const response = await fetch(
        `/api/metadata?url=${encodeURIComponent(tempLink)}`,
        {
          method: "GET",
        }
      );
      const result = await response.json();
      if (!response.ok) {
        console.error(result.error);
        return;
      }
      setPostLink(tempLink);
      setLinkPreview(result); // Assuming result contains the link preview data
      setIsLinkModalOpen(false);
    } catch (error) {
      console.error("Error fetching link preview:", error);
    }
  };

  const createPost = async () => {
    setLoading((prev) => ({ ...prev, ["post"]: true }));
    try {
      const res = await fetch(`/api/feeds/${user?.name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postText,
          imagePreview: imagePreview || null,
          linkPreview,
          isSpoiler,
          storedData,
        }),
      });

      if (res.status === 200) {
        toast.success("Success");
        setPostText("");
        setPostLink("");
        setPostImage(null);
        setImagePreview(null);
        setLinkPreview(null);
        router.refresh();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else if (res.status === 404) {
        toast.error("Invalid User");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error Posting");
    } finally {
      setLoading((prev) => ({ ...prev, ["post"]: false }));
    }
  };

  const likePost = async (id: string) => {
    setLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/feeds/${user?.name}/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (res.status === 200) {
        toast.success("Success");
        router.refresh();
      } else if (res.status === 404) {
        toast.error("Invalid User");
      }
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleShare = (idx: number) => {
    setIsShareModalOpen((prev) => {
      const newShareModal = [...prev];
      newShareModal[idx] = !newShareModal[idx];
      // Toggle the specific item
      return newShareModal;
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Copied to clipboard");
      setIsShareModalOpen([]);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}${pathname}#${feedId}`);
    }
  }, [pathname, feedId]);

  useEffect(() => {
    refetch();
  }, [query, refetch]);

  return (
    <div className="mx-auto md:px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-2xl font-bold">Create a Post</h2>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <Textarea
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="mb-4"
          />
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLinkModalOpen(true)}
            >
              <LinkIcon className="mr-2 h-4 w-4" /> Add Link
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleImageButtonClick}
            >
              <ImageIcon className="mr-2 h-4 w-4" /> Upload Image
            </Button>

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
          </div>
          {storedData?.length > 0 === false && (
            <div className="block relative">
              <FetchingTv
                dynamicSearch={dynamicSearch}
                isFetching={isFetching}
                searchQuery={searchQuery as string | any}
                openSearch={openSearch}
                tvIds={[]}
                setTvIds={setTvIds}
                setStoredData={setStoredData}
                setItem={function (item: any): void {
                  throw new Error("Function not implemented.");
                }}
                query={query}
              />
            </div>
          )}

          {linkPreview && <LinkPreview linkPreview={linkPreview} />}

          {imagePreview && (
            <div className="relative inline-block my-2">
              <Image
                src={imagePreview}
                alt="Preview"
                width={200}
                height={150}
                loading="lazy"
                className="w-[200px] h-[150px] object-cover rounded-md mb-4"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleCancelImage}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cancel image upload</span>
              </Button>
            </div>
          )}
          {storedData?.map((data, idx) => {
            return (
              <div
                className="relative w-full h-full dark:bg-[#232425] rounded-sm my-2"
                key={data?.id}
              >
                <ShowCard show={data} />
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
            );
          })}
        </CardContent>
        <CardFooter className="!p-2">
          <Button type="button" onClick={createPost}>
            {loading["post"] ? (
              <ClipLoader color="#c3c3c3" loading={loading["post"]} size={14} />
            ) : (
              "Post"
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-8">
        {getFeeds.map((feed, idx) => {
          const allUser = users?.find((u) => u?.id?.includes(feed?.userId));
          return (
            <Card key={feed?.id} id={feed?.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <Image
                        src={`${allUser?.profileAvatar || allUser?.image}`}
                        alt={`${
                          allUser?.displayName || allUser?.name
                        }'s Profile`}
                        width={40}
                        height={40}
                        quality={100}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-full mb-4"
                      />
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {allUser?.displayName || allUser?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Posted on {formatDate(feed?.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <ActionModal
                    feedId={feed?.id}
                    feed={feed}
                    user={user}
                    currentUser={currentUser}
                    openSearch={openSearch}
                    tvIds={[]}
                    setTvIds={setTvIds}
                    setStoredData={setStoredData}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {feed.spoiler && !revealedItems[idx] ? (
                  <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                    <Button
                      onClick={() => toggleReveal(idx)}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <EyeOff className="h-4 w-4" />
                      <span>Reveal spoiler content</span>
                    </Button>
                  </div>
                ) : (
                  <div className="w-full">
                    <p className="px-6 py-2">{feed?.content}</p>
                    {feed?.image !== null && (
                      <Image
                        src={`${feed?.image}`}
                        alt="Feeds Image"
                        width={500}
                        height={500}
                        quality={100}
                        loading="lazy"
                        className="w-full h-[500px] bg-cover object-cover"
                      />
                    )}
                    {feed?.spoiler !== false && (
                      <Button
                        onClick={() => toggleReveal(idx)}
                        variant="outline"
                        className="flex items-center space-x-2 mt-2 ml-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Hide spoiler content</span>
                      </Button>
                    )}
                  </div>
                )}

                <div className="w-full h-full">
                  <LinkPreview linkPreview={feed?.link} />
                  {feed?.tag?.map((show) => (
                    <div key={show?.id}>
                      <ShowCard show={show} />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <Button
                    {...register("like")}
                    variant="ghost"
                    size="sm"
                    onClick={() => likePost(feed.id)}
                    className={`${
                      feed?.likeBy?.includes(currentUser?.id as string)
                        ? "text-red-500"
                        : "text-white"
                    }`}
                  >
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    {loading[feed?.id] ? (
                      <ClipLoader
                        color="c3c3c3"
                        loading={loading[feed?.id]}
                        size={14}
                      />
                    ) : (
                      `Like (${feed?.like})`
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleComment(idx)}
                  >
                    <MessageCircle className="mr-1 h-4 w-4" />
                    Comment (
                    {(getComment?.filter((com) => com?.postId === feed?.id)
                      ?.length || 0) +
                      (getComment?.filter((com) => com?.postId === feed?.id)[
                        idx
                      ]?.replies?.length || 0)}
                    )
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleShare(idx);
                      setFeedId(feed?.id);
                    }}
                  >
                    <Share2 className="mr-1 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardFooter>
              {revealedComment[idx] && (
                <div className="m-0">
                  <Discuss
                    user={user}
                    users={users}
                    getComment={getComment?.filter(
                      (com) => com?.postId === feed?.id
                    )}
                    tv_id={feed?.id}
                    type="feeds"
                  />
                </div>
              )}
              <Dialog
                open={isShareModalOpen[idx]}
                onOpenChange={() => handleShare(idx)}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Post</DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <Input value={shareUrl} readOnly />
                    <Button onClick={copyToClipboard} size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => handleShare(idx)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>
          );
        })}
      </div>

      <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <Input
            type="url"
            placeholder="Enter link URL"
            value={tempLink}
            onChange={(e) => setTempLink(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLinkConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

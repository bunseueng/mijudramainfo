"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import ReusedImage from "@/components/ui/allreusedimage";
import CommentCard from "./CommentCard";
import NestedComment from "./NestedComment";
import ClipLoader from "react-spinners/ClipLoader";
import { CommentProps, UserProps } from "@/helper/type";
import CommentSkeleton from "@/app/component/ui/Loading/CommentSkeleton";

type DiscussProps = {
  user: UserProps;
  users: UserProps[];
  tv_id: string;
  getComment: CommentProps[];
  type: string;
};

const Discuss = ({ user, users, tv_id, getComment, type }: DiscussProps) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [loadingLove, setLoadingLove] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");
  const [replyingTo, setReplyingTo] = useState<Record<string, boolean>>({});
  const [spoilerComment, setSpoilerComment] = useState<boolean>(false);
  const [spoilerReply, setSpoilerReply] = useState<boolean>(false);
  const [revealSpoiler, setRevealSpoiler] = useState<{
    [key: string]: boolean;
  }>({});
  const [comments, setComments] = useState<CommentProps[]>(getComment || []);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (Array.isArray(getComment)) {
      setComments(getComment);
    }
  }, [getComment]);

  const handlePostComment = async (parentId: string | null, postId: string) => {
    const loadingKey = parentId || "main";
    const currentSpoilerState = parentId ? spoilerReply : spoilerComment;
    try {
      setLoading((prev) => ({ ...prev, [loadingKey]: true }));
      if (parentId) {
        setReplyingToId(parentId);
      } else {
        setIsPosting(true);
      }
      const response = await fetch(`/api/${type}/${tv_id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: parentId ? replyText : commentText,
          parentId: parentId || null,
          userId: user.id,
          repliedUserId: user.id || null,
          postId: postId,
          spoiler: currentSpoilerState,
        }),
      });

      if (response.status === 200) {
        const newComment = await response.json();
        if (newComment && newComment.message) {
          // Update comments state with new comment at the beginning
          setComments((prevComments) => {
            if (parentId) {
              return prevComments.map((comment) => {
                if (comment.id === parentId) {
                  return {
                    ...comment,
                    replies: [
                      { ...newComment, spoiler: currentSpoilerState },
                      ...(comment.replies || []),
                    ],
                  };
                }
                return comment;
              });
            } else {
              // Add new comment at the beginning of the array
              return [
                { ...newComment, spoiler: currentSpoilerState },
                ...prevComments,
              ];
            }
          });
          // Reset form state
          setReplyText("");
          setCommentText("");
          setReplyingTo({});
          setSpoilerComment(false);
          setSpoilerReply(false);
          toast.success(`Comment posted`);
          setTimeout(() => {
            router.refresh();
          }, 500);
        } else {
          console.error("Invalid comment data received:", newComment);
          toast.error("Failed to post comment: Invalid data received");
        }
      } else if (response.status === 400) {
        toast.error("Invalid User");
      } else if (response.status === 404) {
        toast.error("Message cannot be empty");
      } else {
        console.error("Failed to post comment:", response.statusText);
        toast.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Error posting comment");
    } finally {
      setLoading((prev) => ({ ...prev, [loadingKey]: false }));
      setReplyingToId(null);
    }
  };

  const handleReply = (commentId: string, parentId: string) => {
    setReplyingTo((prev) => ({
      ...prev,
      [commentId]: true,
    }));
    router.refresh();
    setCommentText("");
    setReplyText("");
  };

  const handleDelete = async (parentId: string | null, commentId: string) => {
    const loadingKey = commentId;
    try {
      setLoading((prev) => ({ ...prev, [loadingKey]: true }));
      const res = await fetch(`/api/${type}/${tv_id}/comment`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentId: parentId || null,
          commentId,
        }),
      });

      if (res.status === 200) {
        await res.json();
        setComments((prevComments: any) =>
          prevComments.filter(
            (comment: CommentProps) => comment.id !== commentId
          )
        );
        router.refresh();
        toast.success("Comment deleted successfully");
      } else if (res.status === 400) {
        toast.error("Invalid User");
      } else {
        throw new Error("Failed to delete the comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleCancelReply = (commentId: string) => {
    setReplyingTo((prev) => ({
      ...prev,
      [commentId]: false,
    }));
  };

  const handleLove = async (commentId: string, parentId: string | null) => {
    try {
      setLoadingLove((prev) => ({ ...prev, [commentId]: true }));
      const res = await fetch(`/api/${type}/${tv_id}/comment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentId: parentId || null,
          commentId,
        }),
      });

      if (res.status === 200) {
        router.refresh();
      } else if (res.status === 400) {
        toast.error("Invalid User");
      } else {
        toast.error("Failed to like the comment");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to like the comment");
    } finally {
      setLoadingLove((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  return (
    <div className={`${type === "feeds" ? "py-0" : "py-5"}`} id="comment">
      <div
        className={`min-h-[100px] relative bg-white text-[#ffffffde] ${
          type === "feeds"
            ? "dark:bg-[#1b1c1d] border-t mb-0 rounded-b-md"
            : "mb-2 dark:bg-[#242526] border border-[#00000024] rounded-md"
        }`}
      >
        <div className="border-b border-b-[#78828c21] px-3 py-2">
          <h3 className="text-black dark:text-white text-md font-bold">
            Comments
          </h3>
        </div>
        <div className="border-b-0 px-3 py-2">
          <div className="text-md font-bold">
            <div className="relative inline-block float-left w-[38px] h-[38px] md:w-[48px] md:h-[48px] bg-[#3e4042] mr-3 rounded-full">
              <ReusedImage
                src={user?.profileAvatar || user?.image || "/default-pf.jpg"}
                alt={`${user?.displayName || user?.name}'s profile avatar`}
                width={48}
                height={48}
                quality={100}
                loading="lazy"
                className="w-[38px] h-[38px] md:w-[48px] md:h-[48px] bg-center object-cover rounded-full align-middle"
              />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePostComment(null, tv_id);
              }}
              className="overflow-hidden"
            >
              <div className="text-left block mb-1">
                <div className="relative inline-block w-full align-bottom text-md">
                  <textarea
                    name="comment"
                    id="comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full h-[53.6px] min-h-[53.6px] text-[#606266] dark:text-white bg-[#fff] dark:bg-[#3a3b3c] border-[1px] border-[#dcdfe6] dark:border-[#46494a] focus:border-blue-500 focus:ring-blue-500 text-sm font-normal rounded-sm outline-none focus:transform focus:duration-300 py-2 px-4"
                    placeholder="Post a comment..."
                  ></textarea>
                </div>
              </div>
              <div className="text-right block mb-1">
                <label
                  className={`text-sm transform duration-300 cursor-pointer ${
                    spoilerComment
                      ? "text-[#409eff] font-bold"
                      : "text-black dark:text-[#ffffffde]"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="spoiler"
                    checked={spoilerComment}
                    onChange={(e) => setSpoilerComment(e.target.checked)}
                    className="transform duration-300 cursor-pointer mr-1 px-2"
                  />
                  <span className="pl-1 text-sm mb-1">Spoiler</span>
                </label>
                <button
                  name="Posting Button"
                  className={`inline-block text-center text-sm text-black dark:text-[#ffffffde] bg-[#fff] dark:bg-[#3a3b3c] hover:bg-[#787878] hover:bg-opacity-40 hover:text-white dark:hover:bg-opacity-75 border-[1px] border-[#dcdfe6] dark:border-[#3e4042] shadow-md rounded-md whitespace-nowrap ml-2 py-2 px-5 outline-none ${
                    loading["main"] ? "opacity-50 pointer-events-none" : ""
                  } ${!session ? "cursor-not-allowed" : "cursor-pointer"}`}
                  disabled={loading["main"] || !session}
                >
                  {loading["main"] ? (
                    <ClipLoader
                      color="#c3c3c3"
                      loading={loading["main"]}
                      size={14}
                      className="align-middle"
                    />
                  ) : (
                    "Post"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="border-b border-b-[#78828c21] px-3 pt-2">
          <ul>
            {" "}
            {isPosting && <CommentSkeleton />}
            {Array.isArray(comments) &&
              comments
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .filter((item: any) => !item.parentId)
                .map((comment: any, idx: number) => (
                  <li
                    className="relative border-t-[1px] border-t-[#78828c21] dark:border-t-[#36383a] -mx-[12px] pt-4 px-4"
                    key={idx}
                  >
                    <CommentCard
                      tv_id={tv_id}
                      comment={comment}
                      onReply={(commentId: string) =>
                        handleReply(commentId, comment.id)
                      }
                      users={users}
                      user={user}
                      replyingTo={replyingTo[comment.id]}
                      handlePostComment={(parentId: string | null) =>
                        handlePostComment(parentId, comment.postId)
                      }
                      handleCancelReply={handleCancelReply}
                      loading={loading[comment.id] || false}
                      replyText={replyText}
                      setReplyText={setReplyText}
                      handleLove={() => handleLove(comment.id, comment.id)}
                      loadingLove={loadingLove[comment.id] || false}
                      handleDelete={() => handleDelete(comment.id, comment.id)}
                      setSpoilerReply={setSpoilerReply}
                      spoilerReply={spoilerReply}
                      setRevealSpoiler={setRevealSpoiler}
                      revealSpoiler={revealSpoiler}
                      session={session}
                      type={type}
                    />

                    <NestedComment
                      tv_id={tv_id}
                      comments={comment.replies}
                      parentId={comment.id}
                      user={user}
                      users={users}
                      replyingTo={replyingTo}
                      handlePostComment={handlePostComment}
                      handleReply={handleReply}
                      handleCancelReply={handleCancelReply}
                      commentText={commentText}
                      setCommentText={setCommentText}
                      loading={loading}
                      replyText={replyText}
                      setReplyText={setReplyText}
                      handleLove={handleLove}
                      loadingLove={loadingLove}
                      setLoadingLove={setLoadingLove}
                      handleDelete={handleDelete}
                      setSpoilerComment={setSpoilerComment}
                      spoilerComment={spoilerComment}
                      setSpoilerReply={setSpoilerReply}
                      spoilerReply={spoilerReply}
                      setRevealSpoiler={setRevealSpoiler}
                      revealSpoiler={revealSpoiler}
                      session={session}
                      type={type}
                      comment={comment}
                      onReply={(commentId: string) =>
                        handleReply(commentId, comment.id)
                      }
                      replyingToId={replyingToId}
                    />
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Discuss;

"use client";

import { useState } from "react";
import CommentCard from "./CommentCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NestedComment from "./NestedComment";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const Discuss = ({ user, users, tv_id, getComment }: any) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [loadingLove, setLoadingLove] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");
  const [replyingTo, setReplyingTo] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { data: session } = useSession();

  const handlePostComment = async (parentId: string | null, postId: string) => {
    const loadingKey = parentId || "main";
    try {
      setLoading((prev) => ({ ...prev, [loadingKey]: true }));
      const response = await fetch(`/api/tv/${tv_id}/comment`, {
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
        }),
      });

      if (response.status === 200) {
        const updatedComments = await response.json();
        getComment(updatedComments);
        setReplyText("");
        setCommentText("");
        setReplyingTo({});
        router.refresh();
      } else if (response.status === 400) {
        toast.error("Invalid User");
      } else if (response.status === 404) {
        toast.error("Message cannot be empty");
      } else {
        console.error("Failed to post comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleReply = (commentId: string, parentId: string) => {
    setReplyingTo((prev) => ({
      ...prev,
      [commentId]: true,
    }));
    router.refresh();
    setCommentText(""); // Clear the main comment textarea
    setReplyText(""); // Clear the reply textarea
  };

  // In the handleDelete function
  const handleDelete = async (parentId: string | null, commentId: string) => {
    const loadingKey = commentId;
    try {
      setLoading((prev) => ({ ...prev, [loadingKey]: true }));

      const res = await fetch(`/api/tv/${tv_id}/comment`, {
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
        const updatedComments = await res.json();
        getComment(updatedComments); // Assuming getComment is a function to update comments in the state
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
      const res = await fetch(`/api/tv/${tv_id}/comment`, {
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
    <div className="py-5">
      <div className="min-h-[100px] relative bg-white dark:bg-[#242526] text-[#ffffffde] border-2 border-[#00000024] shadow-sm rounded-sm mb-2">
        <div className="border-b-2 border-b-[#78828c21] px-3 py-2">
          <h3 className="text-black dark:text-white text-md font-bold">
            Comments
          </h3>
        </div>
        <div className="border-b-0 px-3 py-2">
          <div className="text-md font-bold">
            <div className="relative inline-block float-left w-[48px] h-[48px] bg-[#3e4042] mr-3 rounded-full">
              <Image
                src={user?.profileAvatar || user?.image || "/default-pf.jpg"}
                alt={`${user?.displayName || user?.name}'s profile avatar`}
                width={200}
                height={200}
                quality={100}
                className="w-[48px] h-[48px] whitespace-nowrap bg-center bg-cover object-cover rounded-full align-middle"
              />
            </div>
            <div className="overflow-hidden">
              <div className="text-left block mb-1">
                <div className="relative inline-block w-full align-bottom text-md">
                  <textarea
                    name="comment"
                    id="comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full h-[53.6px] min-h-[53.6px] text-[#606266] dark:text-white bg-[#fff] dark:bg-[#3a3b3c] border-2 border-[#dcdfe6] dark:border-[#46494a] focus:border-blue-500 focus:ring-blue-500  text-sm font-normal rounded-sm outline-none focus:transform focus:duration-300 py-2 px-4"
                    placeholder="Post a comment..."
                  ></textarea>
                </div>
              </div>
              <div className="text-right block mb-1">
                <label
                  htmlFor="comment"
                  className="text-[#606266] font-semibold whitespace-nowrap cursor-pointer"
                >
                  <span className="inline-block relative cursor-pointer whitespace-nowrap align-middle"></span>
                </label>
                <button
                  onClick={() => handlePostComment(null, tv_id)}
                  className={`inline-block text-center text-sm text-black dark:text-[#ffffffde] bg-[#fff] dark:bg-[#3a3b3c] hover:bg-[#787878] hover:bg-opacity-40 hover:text-white dark:hover:bg-opacity-75 border-2 border-[#dcdfe6] dark:border-[#3e4042] shadow-md rounded-md whitespace-nowrap ml-2 py-3 px-5 outline-none ${
                    loading.main ? "opacity-50 pointer-events-none" : ""
                  } ${!session ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {loading.main ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-b-2 border-b-[#78828c21] px-3 pt-2">
          <ul>
            {getComment
              ?.filter((item: any) => !item.parentId)
              .map((comment: any, idx: number) => (
                <li
                  className="relative border-t-2 border-t-[#78828c21] dark:border-t-[#36383a] -mx-[12px] pt-4 px-4"
                  key={idx}
                >
                  <CommentCard
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
                    commentText={commentText}
                    setCommentText={setCommentText}
                    loading={loading[comment.id] || false}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    handleLove={() => handleLove(comment.id, comment.id)}
                    loadingLove={loadingLove[comment.id] || false}
                    setLoadingLove={setLoadingLove}
                    handleDelete={() => handleDelete(comment.id, comment.id)}
                  />

                  <NestedComment
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

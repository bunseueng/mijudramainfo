import CommentSkeleton from "@/app/component/ui/Loading/CommentSkeleton";
import { CommentProps, UserProps } from "@/helper/type";
import { Session } from "next-auth";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";
const CommentCard = dynamic(() => import("./CommentCard"), { ssr: false });

type NestedCommentProps = {
  comments: CommentProps[];
  parentId: string;
  users: UserProps[];
  user: UserProps;
  comment: CommentProps;
  replyingTo: Record<string, boolean>;
  onReply: (commentId: string) => void;
  handlePostComment: (parentId: string | null, postId: string) => Promise<void>;
  handleReply: (commentId: string, parentId: string) => void;
  handleCancelReply: (id: string) => void;
  commentText: string;
  setCommentText: (value: string) => void;
  loading: Record<string, boolean>;
  replyText: string;
  setReplyText: (value: string) => void;
  handleLove: (commentId: string, parentId: string | null) => Promise<void>;
  tv_id: string;
  loadingLove: Record<string, boolean>;
  setLoadingLove: Dispatch<SetStateAction<Record<string, boolean>>>;
  handleDelete: (value: string | null, tv_id: string) => void;
  setSpoilerComment: Dispatch<SetStateAction<boolean>>;
  spoilerComment: boolean;
  setSpoilerReply: (value: boolean) => void;
  spoilerReply: boolean;
  setRevealSpoiler: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  revealSpoiler: { [key: string]: boolean };
  session: Session | null;
  type: string;
  replyingToId: string | null;
};
const NestedComment = ({
  comments,
  parentId,
  users,
  user,
  replyingTo,
  handlePostComment,
  handleReply,
  handleCancelReply,
  commentText,
  setCommentText,
  loading,
  replyText,
  setReplyText,
  handleLove,
  tv_id,
  loadingLove,
  setLoadingLove,
  handleDelete,
  setSpoilerComment,
  setSpoilerReply,
  spoilerComment,
  spoilerReply,
  setRevealSpoiler,
  revealSpoiler,
  session,
  type,
  replyingToId,
}: NestedCommentProps) => {
  const nestedComments = comments?.filter(
    (comment: any) => comment.parentId === parentId
  );

  if (!nestedComments || nestedComments.length === 0) return null;

  return (
    <ul>
      {nestedComments.map((comment: any, idx: number) => (
        <li className="relative border-t-0 -mx-4 pt-4 px-4" key={idx}>
          <div className="ml-[60px] relative">
            <div className="absolute bottom-0 left-0 top-10 z-2">
              <div className="inline-block h-full w-[26px] align-top mr-1 box-border">
                <i className="block w-[50%] h-full border-r-2 border-r-[#edeff1] dark:border-r-[#36383a]"></i>
              </div>
            </div>
            <CommentCard
              tv_id={tv_id}
              comment={comment}
              onReply={(commentId: string) =>
                handleReply(commentId, comment.id)
              }
              users={users}
              user={user}
              replyingTo={replyingTo[comment.id]}
              handlePostComment={() =>
                handlePostComment(comment.id, comment.postId)
              }
              handleCancelReply={handleCancelReply}
              loading={loading[comment.parentId] || false}
              replyText={replyText}
              setReplyText={setReplyText}
              handleLove={() => handleLove(comment.id, comment.id)}
              loadingLove={loadingLove[comment.id] || false}
              handleDelete={() => handleDelete(comment.id, comment.id)}
              setSpoilerReply={setSpoilerReply}
              spoilerReply={spoilerReply}
              revealSpoiler={revealSpoiler}
              setRevealSpoiler={setRevealSpoiler}
              session={session}
              type={type}
            />
            <NestedComment
              tv_id={tv_id}
              comments={comments}
              parentId={comment.id}
              users={users}
              user={user}
              replyingTo={replyingTo}
              handlePostComment={() =>
                handlePostComment(comment.id, comment.postId)
              }
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
              setSpoilerReply={setSpoilerReply}
              spoilerComment={spoilerComment}
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
          </div>
          <div className="ml-[60px]">
            {replyingToId === comment.id && <CommentSkeleton />}
          </div>
        </li>
      ))}
    </ul>
  );
};
export default NestedComment;

import dynamic from "next/dynamic";
const CommentCard = dynamic(() => import("./CommentCard"), { ssr: false });

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
}: any) => {
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
              commentText={commentText}
              setCommentText={setCommentText}
              loading={loading[comment.parentId] || false}
              replyText={replyText}
              setReplyText={setReplyText}
              handleLove={() => handleLove(comment.id, comment.id)}
              loadingLove={loadingLove[comment.id] || false}
              setLoadingLove={setLoadingLove}
              handleDelete={() => handleDelete(comment.id, comment.id)}
              setSpoilerComment={setSpoilerComment}
              setSpoilerReply={setSpoilerReply}
              spoilerComment={spoilerComment}
              spoilerReply={spoilerReply}
              revealSpoiler={revealSpoiler}
              setRevealSpoiler={setRevealSpoiler}
              session={session}
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
            />
          </div>
        </li>
      ))}
    </ul>
  );
};
export default NestedComment;

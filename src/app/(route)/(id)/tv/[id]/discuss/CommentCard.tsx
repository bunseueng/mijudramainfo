import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { CiChat2, CiHeart } from "react-icons/ci";
import { HiDotsVertical } from "react-icons/hi";
import ClipLoader from "react-spinners/ClipLoader";

const CommentCard = ({
  users,
  user,
  comment,
  replyingTo,
  onReply,
  handlePostComment,
  handleCancelReply,
  loading,
  replyText,
  setReplyText,
  handleLove,
  tv_id,
  loadingLove,
  handleDelete,
}: any) => {
  const eachUser = users.find((u: any) => u.id === comment.repliedUserId);
  const [showActions, setShowActions] = useState(false);

  const handleAction = () => {
    setShowActions(!showActions);
  };

  return (
    <>
      <div className="relative pb-4 transform duration-300">
        <div className="float-left relative inline-block w-[48px] h-[48px] mr-3">
          <Link href="">
            <Image
              src={
                eachUser?.profileAvatar || eachUser?.image || "/default-pf.jpg"
              }
              alt=""
              width={200}
              height={200}
              quality={100}
              className="w-[48px] h-[48px] border-[1px] border-[#7a7c7e] whitespace-nowrap bg-center bg-cover object-cover rounded-full align-middle"
            />
          </Link>
        </div>
        <div className="ml-16">
          <div className="inline-block min-w-[300px] pb-1">
            <Link href="" className="text-[#2490da]">
              <b>{eachUser?.displayName || eachUser?.name}</b>
            </Link>
            <span className="relative inline-block h-4 leading-5"></span>
            <span className="text-sm text-[#ffffff99] pl-1">
              {moment(comment?.createdAt).fromNow()}
            </span>
          </div>
          <div className="min-h-[21px] break-words">
            <p className="text-sm text-black dark:text-white">
              {comment?.message}
            </p>
          </div>
          <div className="mt-2 -ml-2 whitespace-nowrap relative">
            <button
              className={`text-[#ffffff99] min-w-[30px] bg-transparent hover:text-red-500 border-0 rounded-sm transform duration-300 py-1 px-[6px] mr-[2px] cursor-default ${
                comment.love === 0
                  ? "text-black dark:text-white"
                  : "text-red-600"
              } `}
              onClick={() => handleLove(null, tv_id)}
            >
              <span className="inline-flex items-center cursor-pointer">
                {loadingLove ? (
                  <ClipLoader
                    color="#FF0000"
                    size={17}
                    loading={loadingLove}
                    className="mr-1"
                  />
                ) : (
                  <CiHeart size={19} />
                )}
                <span className="text-black dark:text-white text-start">
                  {comment.love}
                </span>
              </span>{" "}
            </button>
            <button
              className="text-[#ffffff99] min-w-[30px] bg-transparent rounded-sm py-1 px-[6px] mr-[2px] cursor-default"
              onClick={() => {
                onReply(comment.id);
              }}
            >
              <span className="inline-flex items-center cursor-pointer text-black dark:text-white">
                <CiChat2 size={19} />
                <span className="text-start">Reply</span>
              </span>{" "}
            </button>
            <div className="inline-block relative">
              <button className="text-black dark:text-[#ffffff99] min-w-[30px] bg-transparent rounded-sm py-1 px-[6px] mr-[2px] opacity-60 cursor-default">
                <HiDotsVertical
                  size={16}
                  className="cursor-pointer"
                  onClick={handleAction}
                />
              </button>
            </div>
          </div>
          {/* Reply Section */}
          {replyingTo && (
            <div className="border-t-[1px] border-t-[#3e4042] pt-4 mt-4">
              <div className="w-[36px] h-[36px] relative inline-block float-left bg-[#242526] border-full whitespace-nowrap mr-3">
                <Image
                  src={user?.profileAvatar || user?.image}
                  alt={`${
                    eachUser?.displayName || eachUser?.name
                  }'s profile avatar`}
                  width={200}
                  height={200}
                  quality={100}
                  className="w-[36px] h-[36px] whitespace-nowrap bg-center bg-cover object-cover rounded-full align-middle"
                />
              </div>
              <div className="overflow-hidden">
                <div className="text-left mb-1">
                  <div className="relative inline-block w-full align-bottom">
                    <textarea
                      name="reply"
                      id="reply"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full min-h-[32.6px] h-[32.6px] max-h-[400px] bg-[#3a3b3c] border-[1px] border-[#46494a] text-[#ffffffcc] focus:border-blue-500 focus:ring-blue-500 focus:transform focus:duration-300 outline-none overflow-hidden rounded-sm py-1 px-4"
                      placeholder="Post a comment..."
                    ></textarea>
                  </div>
                </div>
                <div className="text-right mb-4">
                  <label
                    htmlFor="comment"
                    className="text-[#606266] font-semibold whitespace-nowrap cursor-pointer"
                  >
                    <span className="inline-block relative cursor-pointer whitespace-nowrap align-middle"></span>
                  </label>
                  <button
                    onClick={() => handlePostComment(comment.id)}
                    className="inline-block text-center text-sm text-[#ffffffde] bg-[#3a3b3c] hover:bg-opacity-75 border-[1px] border-[#3e4042] shadow-md rounded-md whitespace-nowrap cursor-pointer ml-2 py-3 px-5 outline-none"
                  >
                    <span className="flex items-center">
                      <ClipLoader
                        color="#fff"
                        size={20}
                        loading={loading}
                        className="mr-1"
                      />
                      {loading ? "Posting..." : "Post"}
                    </span>
                  </button>
                  <button
                    className="py-3 px-5 text-sm border-0 bg-transparent rounded-sm hover:bg-[#3a3b3c] ml-2"
                    onClick={() => handleCancelReply(comment.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showActions && (
        <div className="min-w-[160px] absolute right-auto left-10 top-24 float-right text-start text-[#ffffffcc] bg-[#242526] border-[1px] border-[#3e4042] z-[9999]">
          <button className="block w-full bg-transparent text-left clear-both py-1 px-5">
            Edit
          </button>
          <button
            className="block w-full bg-transparent text-left clear-both py-1 px-5"
            onClick={() => handleDelete(null, tv_id)}
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
};

export default CommentCard;

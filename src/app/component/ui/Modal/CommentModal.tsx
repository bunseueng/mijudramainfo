"use client";

import { TCreateList } from "@/app/helper/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

const CommentModal = ({
  register,
  handleSubmit,
  item,
  list,
  setModal,
  comments, // Comments state
  setComments, // Setter for Comments state
}: any) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [commentValue, setCommentValue] = useState<string>("");

  useEffect(() => {
    // Set the default value of the textarea
    setCommentValue(
      list?.dramaComment?.find((comment: any) => comment?.tvId === item?.id)
        ?.comment || ""
    );
  }, [item, list?.dramaComment]);

  const addingComment = async (data: TCreateList) => {
    try {
      setLoading(true);
      // Send the updated dramaComment array to the backend
      const res = await fetch(`/api/list/${list?.listId}/dramaComment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dramaComment: data.dramaComment, // Send the comment directly
          tvId: item.id,
        }),
      });

      const responseData = await res.json();

      if (res.ok) {
        router?.refresh();
        toast.success("Successfully adding comment");
        setComments({ ...comments, [item.id]: data.dramaComment }); // Update the comments state
      } else {
        throw new Error(responseData.message || "Failed to add comment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="relative bg-white rounded-lg shadow dark:bg-[#242526]">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Comment
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setModal(false)} // Close modal
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                <textarea
                  {...register("dramaComment")}
                  name="dramaComment"
                  id="dramaComment"
                  className="w-full bg-[#242526] text-[#ffffffde] border-2 border-[#313334] shadow-lg p-4 outline-none"
                  value={commentValue}
                  onChange={(e) => setCommentValue(e.target.value)}
                  placeholder="Type something..."
                ></textarea>
              </div>
              <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  className="text-white bg-[#3a3b3c] px-5 py-2 rounded-lg"
                  onClick={() => setModal(false)} // Close modal
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit(addingComment)}
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-white focus:outline-none bg-white dark:bg-[#40a0ff] rounded-lg border"
                >
                  <span className="flex items-center">
                    <ClipLoader
                      color="#272727"
                      size={20}
                      loading={loading}
                      className="mr-1"
                    />
                    Save
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;

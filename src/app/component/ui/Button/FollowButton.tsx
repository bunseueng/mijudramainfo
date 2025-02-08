"use client";

import { currentUserProps, UserProps } from "@/helper/type";
import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { FaExclamation } from "react-icons/fa6";
import { useQueryClient } from "@tanstack/react-query";

interface FollowButtonProps {
  currentUser: currentUserProps | null;
  user: UserProps | null;
  onFollowerUpdate?: (count: number) => void;
}

interface ProfileData {
  user: UserProps;
  currentUser: currentUserProps;
  followers: string[];
  following: string[];
}

const FollowButton: React.FC<FollowButtonProps> = ({
  user,
  currentUser,
  onFollowerUpdate,
}) => {
  const queryClient = useQueryClient();
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [localIsFollowing, setLocalIsFollowing] = useState<boolean>(false);
  const [unfollowLoading, setUnfollowLoading] = useState<boolean>(false);

  useEffect(() => {
    setLocalIsFollowing(
      currentUser?.following?.includes(user?.id ?? "") ?? false
    );
  }, [currentUser?.following, user?.id]);

  const handleFollow = async () => {
    if (!currentUser || !user) return;

    if (localIsFollowing) {
      setModal(true);
    } else {
      setFollowLoading(true);
      setLocalIsFollowing(true);

      const previousData = queryClient.getQueryData([
        "profile_data",
        user.name,
      ]) as ProfileData;

      // Calculate new followers count
      const newFollowers = [
        ...(previousData?.user?.followers || []),
        currentUser.id,
      ];

      // Update follower count immediately
      onFollowerUpdate?.(newFollowers.length);

      // Optimistically update UI
      queryClient.setQueryData(
        ["profile_data", user.name],
        (oldData: ProfileData | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            currentUser: {
              ...oldData.currentUser,
              following: [...(oldData.currentUser?.following || []), user.id],
            },
            user: {
              ...oldData.user,
              followers: newFollowers,
            },
          };
        }
      );

      try {
        const res = await fetch(`/api/follow/${user.name}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ followId: user.id }),
        });

        if (res.ok) {
          await queryClient.invalidateQueries({
            queryKey: ["profile_data", user.name],
          });
          toast.success("Successfully followed user");
        } else {
          // Revert optimistic updates
          setLocalIsFollowing(false);
          queryClient.setQueryData(["profile_data", user.name], previousData);
          onFollowerUpdate?.(previousData?.user?.followers?.length ?? 0);
          toast.error("Failed to follow user");
        }
      } catch (error) {
        // Revert optimistic updates
        setLocalIsFollowing(false);
        queryClient.setQueryData(["profile_data", user.name], previousData);
        onFollowerUpdate?.(previousData?.user?.followers?.length ?? 0);
        toast.error("An error occurred");
      } finally {
        setFollowLoading(false);
      }
    }
  };

  const handleUnfollow = async () => {
    if (!user) return;

    setUnfollowLoading(true);
    setLocalIsFollowing(false);

    const previousData = queryClient.getQueryData([
      "profile_data",
      user.name,
    ]) as ProfileData;

    // Calculate new followers count
    const newFollowers = (previousData?.user?.followers || []).filter(
      (id: string) => id !== currentUser?.id
    );

    // Update follower count immediately
    onFollowerUpdate?.(newFollowers.length);

    // Optimistically update UI
    queryClient.setQueryData(
      ["profile_data", user.name],
      (oldData: ProfileData | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          currentUser: {
            ...oldData.currentUser,
            following: (oldData.currentUser?.following || []).filter(
              (id: string) => id !== user.id
            ),
          },
          user: {
            ...oldData.user,
            followers: newFollowers,
          },
        };
      }
    );

    try {
      const res = await fetch(`/api/follow/${user.name}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followId: user.id }),
      });

      if (res.ok) {
        setModal(false);
        await queryClient.invalidateQueries({
          queryKey: ["profile_data", user.name],
        });
        toast.success("Successfully unfollowed user");
      } else {
        // Revert optimistic updates
        setLocalIsFollowing(true);
        queryClient.setQueryData(["profile_data", user.name], previousData);
        onFollowerUpdate?.(previousData?.user?.followers?.length ?? 0);
        toast.error("Failed to unfollow user");
      }
    } catch (error) {
      // Revert optimistic updates
      setLocalIsFollowing(true);
      queryClient.setQueryData(["profile_data", user.name], previousData);
      onFollowerUpdate?.(previousData?.user?.followers?.length ?? 0);
      toast.error("Failed to unfollow");
    } finally {
      setUnfollowLoading(false);
    }
  };

  if (!currentUser || !user) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        name="follow btn"
        className="bg-white dark:bg-[#3a3b3c] text-black dark:text-[#ffffffde] text-sm border border-[#c3c3c3] dark:border-[#3e4042] rounded-md mr-2 p-1 md:p-2 cursor-pointer"
        onClick={handleFollow}
        disabled={followLoading}
      >
        {localIsFollowing ? (
          <span className="flex items-center">
            <span className="pt-[2px]">Following</span>
          </span>
        ) : (
          <span className="flex items-center">
            <ClipLoader
              color="#fff"
              size={20}
              loading={followLoading}
              className="mr-1"
            />
            <span className="pt-[2px]">
              {followLoading ? "Following..." : "Follow"}
            </span>
          </span>
        )}
      </button>
      {modal && (
        <div id={currentUser.id} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-[#18191a] opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  name="Close icon"
                  onClick={() => setModal(false)}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-400 sm:mx-0 sm:h-10 sm:w-10">
                  <FaExclamation className="text-white font-bold" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    Warning
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to unfollow?
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  name="Cancel"
                  onClick={handleUnfollow}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <ClipLoader
                    color="#fff"
                    size={20}
                    loading={unfollowLoading}
                    className="mr-1"
                  />
                  <span className="pt-[2px]">
                    {unfollowLoading ? "Confirming..." : "Confirm"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FollowButton;

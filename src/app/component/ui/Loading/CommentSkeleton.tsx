import React from "react";

const CommentSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex items-start space-x-4 mb-6">
        {/* Avatar skeleton */}
        <div className="w-[36px] h-[36px] bg-gray-200 dark:bg-gray-700 rounded-full" />

        <div className="flex-1">
          {/* Username and timestamp skeleton */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>

          {/* Comment text skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>

          {/* Action buttons skeleton */}
          <div className="flex items-center space-x-4 mt-3">
            <div className="h-4 w-12 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-4 w-12 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-4 w-8 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

const NestedCommentSkeleton = () => {
  return (
    <div className="ml-12">
      <CommentSkeleton />
    </div>
  );
};

export { CommentSkeleton, NestedCommentSkeleton };
export default CommentSkeleton;

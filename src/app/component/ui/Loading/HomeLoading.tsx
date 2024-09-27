export const SkeletonCard = () => {
  return (
    <div className="block w-[150px] h-[250px] animate-pulse mr-4 rounded-xl">
      {/* Image Placeholder */}
      <div className="w-full h-[200px] bg-gray-400 dark:bg-gray-600 rounded-xl"></div>

      {/* Title Placeholder */}
      <div className="mt-2 w-[150px] h-[15px] bg-gray-400 dark:bg-gray-600 rounded-md"></div>

      {/* Date Placeholder */}
      <div className="mt-2 w-[80px] h-[15px] bg-gray-400 dark:bg-gray-600 rounded-md"></div>
    </div>
  );
};

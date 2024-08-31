export const SkeletonCard = () => {
  return (
    <div className="block w-[150px] h-[250px] bg-gray-300 dark:bg-gray-700 animate-pulse mr-4 rounded-xl">
      <div className="w-[150px] h-[200px] bg-gray-400 dark:bg-gray-600 rounded-t-xl"></div>
      <div className="mt-2 w-[120px] h-[15px] bg-gray-400 dark:bg-gray-600 rounded-md"></div>
      <div className="mt-2 w-[80px] h-[15px] bg-gray-400 dark:bg-gray-600 rounded-md"></div>
    </div>
  );
};

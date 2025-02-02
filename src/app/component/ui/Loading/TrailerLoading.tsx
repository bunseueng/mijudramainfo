const SkeletonMediaPhoto = () => {
  return (
    <div className="pt-5 animate-pulse">
      <div className="flex items-center">
        <div className="h-6 w-20 bg-gray-300 rounded"></div>
        <ul className="flex items-center ml-10">
          {[1, 2, 3].map((item) => (
            <li key={item} className="h-4 w-16 bg-gray-300 rounded ml-5"></li>
          ))}
        </ul>
      </div>
      <div className="mt-5">
        <div className="flex items-center h-[300px] overflow-hidden whitespace-nowrap">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="w-[1833px] h-[300px] mr-4 bg-gray-300 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SkeletonReviewCard = () => {
  return (
    <div className="animate-pulse">
      <SkeletonMediaPhoto />

      <div className="mt-10 border-t pt-3">
        <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>
        <div className="flex overflow-x-auto">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="w-[270px] h-[180px] mr-4 bg-gray-300 rounded-lg flex-shrink-0"
            ></div>
          ))}
        </div>
      </div>

      <div className="mt-10 border-t pt-3">
        <div className="border rounded-md mt-8">
          <div className="bg-gray-200 p-5 flex justify-between items-center">
            <div className="h-5 w-20 bg-gray-300 rounded"></div>
            <div className="h-5 w-24 bg-gray-300 rounded"></div>
          </div>
          {[1, 2].map((item) => (
            <div key={item} className="p-5">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="ml-4 flex-grow">
                  <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="mt-4 h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 border-t pt-3">
        <div className="h-6 w-20 bg-gray-300 rounded mb-4"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export { SkeletonMediaPhoto, SkeletonReviewCard };

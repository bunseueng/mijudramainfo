import React from "react";
import Image from "next/image";

interface RatingButtonProps {
  userRating: any[];
  modal: boolean;
  setModal: (value: boolean) => void;
}

const RatingButton: React.FC<RatingButtonProps> = ({
  userRating,
  modal,
  setModal,
}) => {
  if (userRating.length > 0) {
    return (
      <div
        className="group flex items-center justify-center space-2 rating_true reactions_true bg-[#032541] rounded-full cursor-pointer hover:scale-105 transition ease-in-out duration-150 pr-1 pl-4 py-1 md:ml-3"
        onClick={() => setModal(!modal)}
      >
        <div className="flex items-center justify-center">
          <div className="flex items-center text-white font-bold cursor-pointer transform">
            <div className="flex items-center font-bold">Your vibe </div>
            <div className="flex items-center font-bold ml-2">
              <span className="text-[#21D07A] text-xl decoration-2 decoration-white">
                {userRating[0]?.rating * 10}
                <span className="self-start text-xs pt-1">%</span>
              </span>
            </div>
            {userRating[0]?.emojiImg && (
              <>
                <div className="inline-block mx-2 h-6 w-px bg-white/30"></div>
                <ul className="flex items-center justify-between">
                  <li className="!mx-0 w-8 h-8 md:w-9 md:h-9 md:bg-[#032541] mt-1">
                    <Image
                      src={userRating[0]?.emojiImg}
                      alt="icon"
                      width={100}
                      height={100}
                      priority
                      className="w-6 h-6 md:w-7 md:h-7"
                    />
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group flex items-center justify-center space-2 rating_true reactions_true bg-[#032541] rounded-full cursor-pointer hover:scale-105 transition ease-in-out duration-150 pr-4 pl-4 py-[9px] md:ml-3"
      onClick={() => setModal(!modal)}
    >
      <div className="flex items-center justify-center">
        <div className="flex items-center text-white font-bold cursor-pointer transform">
          <div className="flex items-center font-bold text-xs lg:text-md">
            What&apos;s your{" "}
            <span className="border-b-[1px] border-b-cyan-500 ml-2 md:ml-0 lg:ml-2 pt-1">
              Vibe
            </span>
            ?{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingButton;

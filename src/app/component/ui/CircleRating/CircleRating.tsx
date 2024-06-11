"use client";

import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircleRating = ({ rating }: any) => {
  return (
    <div className="circleRating cursor-pointer hover:scale-125 transition transform duration-300">
      <CircularProgressbar
        value={rating}
        maxValue={10}
        text={rating}
        backgroundPadding={6}
        strokeWidth={10}
        styles={buildStyles({
          textColor: "#fff",
          textSize: "30px",
          trailColor:
            rating < 5 ? "#571435" : rating < 7 ? "#423d0f" : "#204529",
          pathColor:
            rating < 5 ? "#db2360" : rating < 7 ? "#d2d531" : "#21d07a",
        })}
      />
    </div>
  );
};

export default CircleRating;

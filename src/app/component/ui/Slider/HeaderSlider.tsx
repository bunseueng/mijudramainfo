"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { video } from "@/helper/VideoData";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const HeaderSlider = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && sliderRef.current) {
      initializeCards();
    }
  }, [isClient]);

  const initializeCards = () => {
    if (!sliderRef.current) return; // Ensure sliderRef is not null
    const cards = Array.from(
      sliderRef.current.querySelectorAll<HTMLDivElement>(".card")
    );
    if (!cards.length) return; // Ensure cards exist

    gsap.to(cards, {
      y: (i) => 0 + 20 * i + "%",
      z: (i) => 15 * i,
      duration: 1,
      ease: "power3.out",
      stagger: -0.1,
    });
  };

  const handleClick = () => {
    if (isAnimating || !sliderRef.current) return; // Check if animating or sliderRef is null
    setIsAnimating(true);

    const slider = sliderRef.current;
    const cards = Array.from(slider.querySelectorAll<HTMLDivElement>(".card"));
    if (!cards.length) return; // Ensure cards exist
    const lastCard = cards.pop();

    if (!lastCard) return; // Ensure lastCard exists
    gsap.to(lastCard, {
      y: "+=150%",
      duration: 0.75,
      ease: "power3.inOut",
      onStart: () => {
        setTimeout(() => {
          slider.prepend(lastCard);
          initializeCards();
          setTimeout(() => {
            setIsAnimating(false);
          }, 1000);
        }, 300);
      },
    });
  };

  // Handler for when the video ends to auto move to the next
  const handleVideoEnd = () => {
    handleClick(); // Automatically trigger the slide transition to the next video
  };

  return (
    <div className="sliderContainer" onClick={handleClick}>
      <div className="slider" ref={sliderRef}>
        {video?.map((vid: any) => (
          <div className="card" key={vid?.id}>
            <div className="card-info">
              <div className="card-item">
                <p>{vid?.date}</p>
              </div>
              <div className="card-item">
                <p>{vid?.title}</p>
              </div>
              <div className="card-item">
                <p>{vid?.category}</p>
              </div>
            </div>
            <div className="video-player">
              <ReactPlayer
                url={`https://vimeo.com/${vid?.id}`}
                width="100%"
                height="100%"
                controls={false}
                autoPlay={true}
                loop={true}
                playing
                muted
                onEnded={handleVideoEnd} // Call the handler when the video ends
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;

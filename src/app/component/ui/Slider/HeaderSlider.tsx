// "use client";

// import dynamic from "next/dynamic";
// import React, { useEffect, useRef, useState } from "react";
// import gsap from "gsap";

// const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

// const HeaderSlider = (video: any) => {
//   const sliderRef = useRef(null);
//   const [isAnimating, setIsAnimating] = useState<boolean>(false);
//   const [isClient, setIsClient] = useState<boolean>(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   useEffect(() => {
//     if (isClient && sliderRef.current) {
//       initializeCards();
//     }
//   }, [isClient, sliderRef]);

//   const initializeCards = () => {
//     const cards = Array.from(sliderRef.current.querySelectorAll(".card"));
//     gsap.to(cards, {
//       y: (i) => 0 + 20 * i + "%",
//       z: (i) => 15 * i,
//       duration: 1,
//       ease: "power3.out",
//       stagger: -0.1,
//     });
//   };

//   const handleClick = () => {
//     if (isAnimating) return;
//     setIsAnimating(true);

//     const slider = sliderRef.current;
//     const cards = Array.from(slider.querySelectorAll(".card"));
//     const lastCard = cards.pop();

//     gsap.to(lastCard, {
//       y: "+=150%",
//       duration: 0.75,
//       ease: "power3.inOut",
//       onStart: () => {
//         setTimeout(() => {
//           slider.prepend(lastCard);
//           initializeCards();
//           setTimeout(() => {
//             setIsAnimating(false);
//           }, 1000);
//         }, 300);
//       },
//     });
//   };

//   return (
//     <div className="sliderContainer" onClick={handleClick}>
//       <div className="slider" ref={sliderRef}>
//         {video?.video?.items?.map((vid: any) => {
//           return (
//             <div className="card" key={vid?.id?.videoId}>
//               <div className="card-info">
//                 <div className="card-item">
//                   <p>{vid?.snippet?.date}</p>
//                 </div>
//                 <div className="card-item">
//                   <p>asd</p>
//                 </div>
//                 <div className="card-item">
//                   <p>{vid?.snippet?.description}</p>
//                 </div>
//                 <div className="video-player">
//                   <ReactPlayer
//                     url={`https://www.youtube.com/embed/${vid?.id?.videoId}`}
//                     width="100%"
//                     height="100%"
//                     controls={true}
//                     autoPlay={true}
//                     playing
//                     muted
//                   />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default HeaderSlider;

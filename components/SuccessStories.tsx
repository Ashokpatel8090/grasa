// 'use client';

// import React, { useEffect, useRef, useState } from 'react';

// // --- Types ---
// interface SuccessStory {
//   id: string;
//   videoUrl: string;
// }

// // --- Data ---
// const storiesData: SuccessStory[] = [
//   {
//     id: "1",
//     videoUrl: "https://res.cloudinary.com/daunsn0z7/video/upload/v1776768316/medicaps/social_video/ndpx1gsavslnied9yvmq.mp4",
//   },
//   {
//     id: "2",
//     videoUrl: "https://res.cloudinary.com/daunsn0z7/video/upload/v1776768426/medicaps/social_video/r3ytwojmo7vfcxgednqo.mp4",
//   },
//   {
//     id: "3",
//     videoUrl: "https://res.cloudinary.com/daunsn0z7/video/upload/v1776768869/medicaps/social_video/dj88xe4cijmdzpjhxkbu.mp4",
//   },
//   {
//     id: "4",
//     videoUrl: "https://res.cloudinary.com/do3gnmt7p/video/upload/v1776943575/medicaps/social_video/xso1w7trmrbpt3myiew1.mp4",
//   },
// ];

// export default function SuccessStoriesCarousel() {
//   const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
//   const [clickedVideoId, setClickedVideoId] = useState<string | null>(null); 
  
//   // ✅ NEW: Add state to track which video is currently being hovered
//   const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null); 
  
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);

//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);
//   const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

//   // ✅ Detect mobile
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);

//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // ✅ Auto Scroll (only when no video is playing)
//   useEffect(() => {
//     if (!isMobile) return;

//     if (playingVideoId) {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       return;
//     }

//     intervalRef.current = setInterval(() => {
//       setCurrentIndex((prev) => {
//         const nextIndex = (prev + 1) % storiesData.length;

//         const container = containerRef.current;
//         const targetCard = cardRefs.current[nextIndex];

//         if (container && targetCard) {
//           container.scrollTo({
//             left: targetCard.offsetLeft,
//             behavior: 'smooth',
//           });
//         }

//         return nextIndex;
//       });
//     }, 3000);

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [playingVideoId, isMobile]);

//   // ✅ Handle Play (Explicit Click)
//   const handlePlay = (id: string, index: number) => {
//     setPlayingVideoId(id);
//     setClickedVideoId(id); 

//     videoRefs.current.forEach((video, i) => {
//       if (i !== index && video) {
//         video.pause();
//         video.currentTime = 0;
//         video.load(); 
//       }
//     });

//     const currentVideo = videoRefs.current[index];
//     if (currentVideo) {
//       currentVideo.muted = false;
//       currentVideo.play().catch(() => {});
//     }
//   };

//   // ✅ Handle Hover Play
//   const handleHoverPlay = (index: number, id: string) => {
//     if (clickedVideoId) return; 

//     const video = videoRefs.current[index];
//     if (!video) return;

//     setPlayingVideoId(id);

//     videoRefs.current.forEach((v, i) => {
//       if (i !== index && v) {
//         v.pause();
//         v.currentTime = 0;
//       }
//     });

//     video.muted = true;
//     video.play().catch(() => {});
//   };

//   // ✅ Handle Hover Pause
//   const handleHoverPause = (index: number, id: string) => {
//     if (clickedVideoId === id) return; 

//     const video = videoRefs.current[index];
//     if (!video) return;

//     video.pause();
//     video.currentTime = 0;

//     setPlayingVideoId(null);
//   };

//   return (
//     <section className="flex flex-col items-center px-5 bg-[#fbfbfb] w-full">
      
//       <h2 className="text-3xl sm:text-4xl text-center w-full max-w-6xl md:text-[44px] font-bold leading-[1.15] mb-6">
//         Our Success Stories
//       </h2>

//       {/* Carousel */}
//       <div
//         ref={containerRef}
//         className="flex md:justify-center gap-5 max-w-6xl w-full overflow-x-auto pb-5 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
//       >
//         {storiesData.map((story, index) => {
//           const isPlaying = playingVideoId === story.id;

//           return (
//             <div
//               key={story.id}
//               ref={(el) => (cardRefs.current[index] = el)}
//               className="flex-shrink-0 w-[85%] sm:w-[260px] bg-[#f8f9fa] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] snap-center flex flex-col transition-all duration-300"
//             >
//               {/* Video */}
//               <div className="relative h-[320px] sm:h-[400px] w-full bg-black overflow-hidden">
//                 <video
//                   ref={(el) => (videoRefs.current[index] = el)}
//                   src={story.videoUrl}
//                   poster={`${story.videoUrl.replace('.mp4', '.jpg')}`}
//                   className="w-full h-full object-cover"
//                   playsInline
//                   muted
                  
//                   // ✅ FIX: Conditionally show controls only if hovered OR explicitly clicked
//                   controls={hoveredVideoId === story.id || clickedVideoId === story.id}
                  
//                   preload="metadata"
//                   onPlay={(e) => {
//                     if (!e.currentTarget.muted) {
//                       setClickedVideoId(story.id);
//                       setPlayingVideoId(story.id);
//                     }
//                   }}
//                   onPause={() => {
//                     if (clickedVideoId === story.id) setClickedVideoId(null);
//                     if (playingVideoId === story.id) setPlayingVideoId(null);
//                   }}
//                   onMouseEnter={() => {
//                     setHoveredVideoId(story.id); // ✅ Track hover state
//                     if (isMobile) return;
//                     handleHoverPlay(index, story.id);
//                   }}
//                   onMouseLeave={() => {
//                     setHoveredVideoId(null); // ✅ Clear hover state when mouse leaves
//                     if (isMobile) return;
//                     handleHoverPause(index, story.id); 
//                   }}
//                 />

//                 {!isPlaying && (
//                   <div
//                     className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
//                     onClick={() => handlePlay(story.id, index)}
//                   >
//                     <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-md">
//                       ▶
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }









// 'use client';

// import React, { useEffect, useRef, useState } from 'react';

// // --- Types ---
// interface SuccessStory {
//   id: string;
//   videoUrl: string;
// }

// // --- Data ---
// const storiesData: SuccessStory[] = [
//   {
//     id: "1",
//     videoUrl: "https://res.cloudinary.com/daunsn0z7/video/upload/v1777287696/MicrosoftTeams-video_an3qtg.mp4"
//   },
//   {
//     id: "2",
//     videoUrl: "https://res.cloudinary.com/daunsn0z7/video/upload/v1776768316/medicaps/social_video/ndpx1gsavslnied9yvmq.mp4",
//   },
//   {
//     id: "3",
//     videoUrl: "https://res.cloudinary.com/daunsn0z7/video/upload/v1776768426/medicaps/social_video/r3ytwojmo7vfcxgednqo.mp4",
//   },
//   {
//     id: "4",
//     videoUrl: "https://res.cloudinary.com/daunsn0z7/video/upload/v1776768869/medicaps/social_video/dj88xe4cijmdzpjhxkbu.mp4",
//   },
//   {
//     id: "5",
//     videoUrl: "https://res.cloudinary.com/do3gnmt7p/video/upload/v1776943575/medicaps/social_video/xso1w7trmrbpt3myiew1.mp4",
//   },
// ];

// export default function SuccessStoriesCarousel() {
//   const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
//   const [clickedVideoId, setClickedVideoId] = useState<string | null>(null); 
  
//   // ✅ NEW: Add state to track which video is currently being hovered
//   const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null); 
  
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);

//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);
//   const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

//   // ✅ Detect mobile
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);

//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // ✅ Auto Scroll (only when no video is playing)
//   useEffect(() => {
//     if (!isMobile) return;

//     if (playingVideoId) {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       return;
//     }

//     intervalRef.current = setInterval(() => {
//       setCurrentIndex((prev) => {
//         const nextIndex = (prev + 1) % storiesData.length;

//         const container = containerRef.current;
//         const targetCard = cardRefs.current[nextIndex];

//         if (container && targetCard) {
//           container.scrollTo({
//             left: targetCard.offsetLeft,
//             behavior: 'smooth',
//           });
//         }

//         return nextIndex;
//       });
//     }, 3000);

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [playingVideoId, isMobile]);

//   // ✅ Handle Play (Explicit Click)
//   const handlePlay = (id: string, index: number) => {
//     setPlayingVideoId(id);
//     setClickedVideoId(id); 

//     videoRefs.current.forEach((video, i) => {
//       if (i !== index && video) {
//         video.pause();
//         video.currentTime = 0;
//         video.load(); 
//       }
//     });

//     const currentVideo = videoRefs.current[index];
//     if (currentVideo) {
//       currentVideo.muted = false;
//       currentVideo.play().catch(() => {});
//     }
//   };

//   // ✅ Handle Hover Play
//   const handleHoverPlay = (index: number, id: string) => {
//     if (clickedVideoId) return; 

//     const video = videoRefs.current[index];
//     if (!video) return;

//     setPlayingVideoId(id);

//     videoRefs.current.forEach((v, i) => {
//       if (i !== index && v) {
//         v.pause();
//         v.currentTime = 0;
//       }
//     });

//     video.muted = true;
//     video.play().catch(() => {});
//   };

//   // ✅ Handle Hover Pause
//   const handleHoverPause = (index: number, id: string) => {
//     if (clickedVideoId === id) return; 

//     const video = videoRefs.current[index];
//     if (!video) return;

//     video.pause();
//     video.currentTime = 0;

//     setPlayingVideoId(null);
//   };

//   return (
//     <section className="flex flex-col items-center px-5 bg-[#fbfbfb] w-full">
      
//       <h2 className="text-3xl sm:text-4xl text-center w-full max-w-6xl md:text-[44px] font-bold leading-[1.15] mb-6">
//         Our Success Stories
//       </h2>

//       {/* Carousel */}
//       <div
//         ref={containerRef}
//         className="flex md:justify-center gap-5 max-w-6xl w-full overflow-x-auto pb-5 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
//       >
//         {storiesData.map((story, index) => {
//           const isPlaying = playingVideoId === story.id;

//           return (
//             <div
//               key={story.id}
//               ref={(el) => (cardRefs.current[index] = el)}
//               className="flex-shrink-0 w-[85%] sm:w-[260px] bg-[#f8f9fa] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] snap-center flex flex-col transition-all duration-300"
//             >
//               {/* Video */}
//               <div className="relative h-[320px] sm:h-[400px] w-full bg-black overflow-hidden">
//                 <video
//                   ref={(el) => (videoRefs.current[index] = el)}
//                   src={story.videoUrl}
//                   poster={`${story.videoUrl.replace('.mp4', '.jpg')}`}
//                   className="w-full h-full object-cover"
//                   playsInline
//                   muted
                  
//                   // ✅ FIX: Conditionally show controls only if hovered OR explicitly clicked
//                   controls={hoveredVideoId === story.id || clickedVideoId === story.id}
                  
//                   preload="metadata"
//                   onPlay={(e) => {
//                     if (!e.currentTarget.muted) {
//                       setClickedVideoId(story.id);
//                       setPlayingVideoId(story.id);
//                     }
//                   }}
//                   onPause={() => {
//                     if (clickedVideoId === story.id) setClickedVideoId(null);
//                     if (playingVideoId === story.id) setPlayingVideoId(null);
//                   }}
//                   onMouseEnter={() => {
//                     setHoveredVideoId(story.id); // ✅ Track hover state
//                     if (isMobile) return;
//                     handleHoverPlay(index, story.id);
//                   }}
//                   onMouseLeave={() => {
//                     setHoveredVideoId(null); // ✅ Clear hover state when mouse leaves
//                     if (isMobile) return;
//                     handleHoverPause(index, story.id); 
//                   }}
//                 />

//                 {!isPlaying && (
//                   <div
//                     className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
//                     onClick={() => handlePlay(story.id, index)}
//                   >
//                     <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-md">
//                       ▶
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }







'use client';

import React, { useEffect, useRef, useState } from 'react';

// --- Types ---
interface SuccessStory {
  id: string;
  videoUrl: string;
}

// --- Data ---
const storiesData: SuccessStory[] = [
  {
    id: "1",
    videoUrl: "https://res.cloudinary.com/daunsn0z7/video/upload/v1777287696/MicrosoftTeams-video_an3qtg.mp4"
  },
  {
    id: "2",
    videoUrl: "https://res.cloudinary.com/daunsn0z7/video/upload/v1776768316/medicaps/social_video/ndpx1gsavslnied9yvmq.mp4",
  },
  {
    id: "3",
    videoUrl: "https://res.cloudinary.com/daunsn0z7/video/upload/v1776768426/medicaps/social_video/r3ytwojmo7vfcxgednqo.mp4",
  },
  {
    id: "4",
    videoUrl: "https://res.cloudinary.com/daunsn0z7/video/upload/v1776768869/medicaps/social_video/dj88xe4cijmdzpjhxkbu.mp4",
  },
  {
    id: "5",
    videoUrl: "https://res.cloudinary.com/do3gnmt7p/video/upload/v1776943575/medicaps/social_video/xso1w7trmrbpt3myiew1.mp4",
  },
];

export default function SuccessStoriesCarousel() {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [clickedVideoId, setClickedVideoId] = useState<string | null>(null); 
  
  // ✅ NEW: Add state to track which video is currently being hovered
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null); 
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // ✅ Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ Auto Scroll (Now works on Desktop AND Mobile)
  useEffect(() => {
    // ❌ Removed 'if (!isMobile) return;' so it auto-scrolls on desktop too

    if (playingVideoId) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % storiesData.length;

        const container = containerRef.current;
        const targetCard = cardRefs.current[nextIndex];

        if (container && targetCard) {
          container.scrollTo({
            left: targetCard.offsetLeft,
            behavior: 'smooth',
          });
        }

        return nextIndex;
      });
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playingVideoId]); // ❌ Removed isMobile from dependency array

  // ✅ Handle Play (Explicit Click)
  const handlePlay = (id: string, index: number) => {
    setPlayingVideoId(id);
    setClickedVideoId(id); 

    videoRefs.current.forEach((video, i) => {
      if (i !== index && video) {
        video.pause();
        video.currentTime = 0;
        video.load(); 
      }
    });

    const currentVideo = videoRefs.current[index];
    if (currentVideo) {
      currentVideo.muted = false;
      currentVideo.play().catch(() => {});
    }
  };

  // ✅ Handle Hover Play
  const handleHoverPlay = (index: number, id: string) => {
    if (clickedVideoId) return; 

    const video = videoRefs.current[index];
    if (!video) return;

    setPlayingVideoId(id);

    videoRefs.current.forEach((v, i) => {
      if (i !== index && v) {
        v.pause();
        v.currentTime = 0;
      }
    });

    video.muted = true;
    video.play().catch(() => {});
  };

  // ✅ Handle Hover Pause
  const handleHoverPause = (index: number, id: string) => {
    if (clickedVideoId === id) return; 

    const video = videoRefs.current[index];
    if (!video) return;

    video.pause();
    video.currentTime = 0;

    setPlayingVideoId(null);
  };

  return (
    <section className="flex flex-col items-center px-5 bg-[#fbfbfb] w-full">
      
      {/* ✅ Increased max-w to match the container below */}
      <h2 className="text-3xl sm:text-4xl text-center w-full max-w-[1400px] md:text-[44px] font-bold leading-[1.15] mb-6">
        Our Success Stories
      </h2>

      {/* Carousel */}
      <div
        ref={containerRef}
        // ✅ Removed `md:justify-center` and changed `max-w-6xl` to `max-w-[1400px]` to fit all videos
        className="flex gap-5 max-w-[1400px] w-full overflow-x-auto pb-5 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {storiesData.map((story, index) => {
          const isPlaying = playingVideoId === story.id;

          return (
            <div
              key={story.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className="flex-shrink-0 w-[85%] sm:w-[260px] bg-[#f8f9fa] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] snap-center flex flex-col transition-all duration-300"
            >
              {/* Video */}
              <div className="relative h-[320px] sm:h-[400px] w-full bg-black overflow-hidden">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={story.videoUrl}
                  poster={`${story.videoUrl.replace('.mp4', '.jpg')}`}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  
                  // ✅ FIX: Conditionally show controls only if hovered OR explicitly clicked
                  controls={hoveredVideoId === story.id || clickedVideoId === story.id}
                  
                  preload="metadata"
                  onPlay={(e) => {
                    if (!e.currentTarget.muted) {
                      setClickedVideoId(story.id);
                      setPlayingVideoId(story.id);
                    }
                  }}
                  onPause={() => {
                    if (clickedVideoId === story.id) setClickedVideoId(null);
                    if (playingVideoId === story.id) setPlayingVideoId(null);
                  }}
                  onMouseEnter={() => {
                    setHoveredVideoId(story.id); // ✅ Track hover state
                    if (isMobile) return;
                    handleHoverPlay(index, story.id);
                  }}
                  onMouseLeave={() => {
                    setHoveredVideoId(null); // ✅ Clear hover state when mouse leaves
                    if (isMobile) return;
                    handleHoverPause(index, story.id); 
                  }}
                />

                {!isPlaying && (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                    onClick={() => handlePlay(story.id, index)}
                  >
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                      ▶
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
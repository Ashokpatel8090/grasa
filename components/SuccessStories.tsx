
// 'use client';

// import React, { useEffect, useRef, useState } from 'react';

// // --- Types ---
// interface SuccessStory {
//   id: string;
//   name: string;
//   videoId: string;
//   quote: string;
// }

// // --- Data ---
// const storiesData: SuccessStory[] = [
//   { id: "1", name: "Soham", videoId: "oX_x7N_OZR8", quote: "I trusted the journey and the results speak for themselves" },
//   { id: "2", name: "Swati", videoId: "VFNCK2_-iIU", quote: "Got my hair volume back thanks to Traya!" },
//   { id: "3", name: "Bharat", videoId: "whZwklD6K7Q", quote: "I'm so glad I decided to act and saved my hairline" },
// ];

// export default function SuccessStoriesCarousel() {
//   const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);

//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);
//   const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

//   // ✅ Detect mobile properly
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);

//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // ✅ Auto Scroll (FIXED)
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

//   return (
//     <section className="flex flex-col items-center  px-5 bg-[#fbfbfb] w-full">
      
//           <h2 className="text-3xl sm:text-4xl items-left md:text-[44px] font-bold leading-[1.15] mb-6">
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
//               onClick={() => setPlayingVideoId(story.id)}
//             >
//               {/* Media */}
//               <div className="relative h-[280px] sm:h-[300px] w-full bg-black flex items-center justify-center overflow-hidden">
//                 {isPlaying ? (
//                   <iframe
//                     className="w-full h-full"
//                     src={`https://www.youtube.com/embed/${story.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&controls=0`}
//                     title={story.name}
//                     allow="autoplay; encrypted-media"
//                     allowFullScreen
//                   />
//                 ) : (
//                   <>
//                     <img
//                       src={`https://i.ytimg.com/vi/${story.videoId}/hqdefault.jpg`}
//                       alt={story.name}
//                       className="w-full h-full object-cover brightness-90"
//                     />

//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-md">
//                         ▶
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Text */}
//               <div className="p-4 bg-[#f3f3ee] relative min-h-[100px] flex flex-col justify-center">
//                 <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-[#8CC63F]"></div>

//                 <p className="text-[13px] font-semibold text-gray-800 mb-2 ml-3">
//                   {story.quote}
//                 </p>

//                 <span className="text-[11px] font-semibold text-gray-500 ml-3 italic">
//                   - {story.name}
//                 </span>
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
    videoUrl: "https://res.cloudinary.com/daunsn0z7/video/upload/v1776768316/medicaps/social_video/ndpx1gsavslnied9yvmq.mp4",
  },
  {
    id: "2",
    videoUrl: "https://res.cloudinary.com/daunsn0z7/video/upload/v1776768426/medicaps/social_video/r3ytwojmo7vfcxgednqo.mp4",
  },
  {
    id: "3",
    videoUrl: "https://res.cloudinary.com/daunsn0z7/video/upload/v1776768869/medicaps/social_video/dj88xe4cijmdzpjhxkbu.mp4",
  },
];

export default function SuccessStoriesCarousel() {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
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

  // ✅ Auto Scroll (only when no video is playing)
  useEffect(() => {
    if (!isMobile) return;

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
  }, [playingVideoId, isMobile]);

  // ✅ Handle Play
  const handlePlay = (id: string, index: number) => {
    setPlayingVideoId(id);

    videoRefs.current.forEach((video, i) => {
      if (i !== index && video) {
        video.pause();
        video.currentTime = 0;
        video.load(); // ✅ fixes black screen
      }
    });

    const currentVideo = videoRefs.current[index];
    if (currentVideo) {
      currentVideo.muted = false;
      currentVideo.play().catch(() => {});
    }
  };


  const handleHoverPlay = (index: number, id: string) => {
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

const handleHoverPause = (index: number) => {
  const video = videoRefs.current[index];
  if (!video) return;

  video.pause();
  video.currentTime = 0;

  setPlayingVideoId(null);
};


  return (
    <section className="flex flex-col items-center px-5 bg-[#fbfbfb] w-full">
      
      <h2 className="text-3xl sm:text-4xl text-center w-full max-w-6xl md:text-[44px] font-bold leading-[1.15] mb-6">
        Our Success Stories
      </h2>

      {/* Carousel */}
      <div
        ref={containerRef}
        className="flex md:justify-center gap-5 max-w-6xl w-full overflow-x-auto pb-5 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              <div className="relative h-[280px] sm:h-[420px] w-full bg-black overflow-hidden">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={story.videoUrl}
                  poster={`${story.videoUrl.replace('.mp4', '.jpg')}`}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  controls
                  preload="metadata"
                  onPlay={() => handlePlay(story.id, index)}

                  // ✅ ADD THESE
                onMouseEnter={() => {
                  if (isMobile) return;
                  handleHoverPlay(index, story.id);
                }}

                // ✅ Hover Pause
                onMouseLeave={() => {
                  if (isMobile) return;
                  handleHoverPause(index);
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
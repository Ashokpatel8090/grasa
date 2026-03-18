// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Star } from "lucide-react";

// type ReviewImage = {
//   id: number;
//   url: string;
// };

// type Review = {
//   id: number;
//   rating: number;
//   review_text: string;
//   is_verified_purchase: boolean;
//   created_at: string;
//   user: {
//     full_name: string;
//   };
//   images: ReviewImage[];
// };

// type ApiResponse = {
//   items: Review[];
//   total: number;
//   page: number;
//   per_page: number;
//   avg_rating: number;
//   total_reviews: number;
// };

// type Props = {
//   productId: number;
// };

// export default function ProductReviews({ productId }: Props) {
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [avgRating, setAvgRating] = useState<number>(0);
//   const [totalReviews, setTotalReviews] = useState<number>(0);

//   const [page, setPage] = useState(1);
//   const [status, setStatus] = useState("approved");
//   const [minRating, setMinRating] = useState("");
//   const [sort, setSort] = useState("recent");

//   const perPage = 10;

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const query = new URLSearchParams({
//           page: page.toString(),
//           per_page: perPage.toString(),
//           status,
//           sort,
//         });

//         if (minRating) query.append("min_rating", minRating);

//         const res = await fetch(
//           `https://medicaps.cloud/product-reviews/${productId}/all-reviews?${query}`
//         );

//         const data: ApiResponse = await res.json();

//         setReviews(data.items);
//         setAvgRating(data.avg_rating);
//         setTotalReviews(data.total_reviews);
//       } catch (err) {
//         console.error("Failed to load reviews", err);
//       }
//     };

//     fetchReviews();
//   }, [productId, page, status, minRating, sort]);

//   const totalPages = Math.ceil(totalReviews / perPage);

//   return (
//     <div className="mt-16">

//       {/* HEADER */}
//       <div className="mb-6">
//         <h2 className="text-3xl font-bold">Customer Reviews</h2>

//         <div className="flex items-center gap-3 mt-2">
//           <span className="text-4xl font-bold">{avgRating}</span>

//           <div className="flex">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <Star
//                 key={i}
//                 size={20}
//                 className={
//                   i < Math.round(avgRating)
//                     ? "text-yellow-500 fill-yellow-500"
//                     : "text-gray-300"
//                 }
//               />
//             ))}
//           </div>

//           <span className="text-gray-500">
//             ({totalReviews} reviews)
//           </span>
//         </div>
//       </div>

//       {/* FILTERS */}
//       <div className="flex flex-wrap gap-4 mb-6">

//         <select
//           value={minRating}
//           onChange={(e) => setMinRating(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="">All Ratings</option>
//           <option value="5">5 Star</option>
//           <option value="4">4+ Star</option>
//           <option value="3">3+ Star</option>
//           <option value="2">2+ Star</option>
//         </select>

//         <select
//           value={sort}
//           onChange={(e) => setSort(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="recent">Most Recent</option>
//           <option value="rating">Highest Rating</option>
//         </select>

//       </div>

//       {/* REVIEWS */}
//       <div className="space-y-6">
//         {reviews.map((review) => (
//           <div
//             key={review.id}
//             className="bg-white border rounded-xl p-6 shadow-sm"
//           >
//             <div className="flex justify-between items-center">

//               <div>
//                 <p className="font-semibold">
//                   {review.user.full_name}
//                 </p>

//                 <div className="flex mt-1">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <Star
//                       key={i}
//                       size={16}
//                       className={
//                         i < review.rating
//                           ? "text-yellow-500 fill-yellow-500"
//                           : "text-gray-300"
//                       }
//                     />
//                   ))}
//                 </div>
//               </div>

//               {review.is_verified_purchase && (
//                 <span className="text-sm text-green-600 font-medium">
//                   Verified Purchase
//                 </span>
//               )}
//             </div>

//             <p className="mt-3 text-gray-700">
//               {review.review_text}
//             </p>

//             {/* REVIEW IMAGES */}
//             {review.images.length > 0 && (
//               <div className="flex gap-3 mt-4 flex-wrap">
//                 {review.images.map((img) => (
//                   <Image
//                     key={img.id}
//                     src={img.url}
//                     alt="review"
//                     width={80}
//                     height={80}
//                     className="rounded-lg object-cover"
//                   />
//                 ))}
//               </div>
//             )}

//             <p className="text-sm text-gray-400 mt-3">
//               {new Date(review.created_at).toLocaleDateString()}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* PAGINATION */}
//       <div className="flex justify-center gap-2 mt-8">

//         <button
//           disabled={page === 1}
//           onClick={() => setPage((p) => p - 1)}
//           className="px-4 py-2 border rounded disabled:opacity-40"
//         >
//           Prev
//         </button>

//         <span className="px-4 py-2 border rounded bg-gray-100">
//           Page {page} / {totalPages}
//         </span>

//         <button
//           disabled={page === totalPages}
//           onClick={() => setPage((p) => p + 1)}
//           className="px-4 py-2 border rounded disabled:opacity-40"
//         >
//           Next
//         </button>

//       </div>
//     </div>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

type ReviewImage = {
  id: number;
  url: string;
};

type Review = {
  id: number;
  rating: number;
  review_text: string;
  is_verified_purchase: boolean;
  created_at: string;
  user: {
    full_name: string;
  };
  images: ReviewImage[];
};

type ApiResponse = {
  items: Review[];
  total: number;
  page: number;
  per_page: number;
  avg_rating: number;
  total_reviews: number;
};

type Props = {
  productId: number;
};

export default function ProductReviews({ productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  const [page, setPage] = useState(1);
  const [status] = useState("approved");
  const [minRating, setMinRating] = useState("");
  const [sort, setSort] = useState("recent");

  const perPage = 10;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const query = new URLSearchParams({
          page: page.toString(),
          per_page: perPage.toString(),
          status,
          sort,
        });

        if (minRating) query.append("min_rating", minRating);

        const res = await fetch(
          `https://medicaps.cloud/product-reviews/${productId}/all-reviews?${query}`
        );

        const data: ApiResponse = await res.json();

        setReviews(data.items);
        setAvgRating(data.avg_rating);
        setTotalReviews(data.total_reviews);
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    };

    fetchReviews();
  }, [productId, page, status, minRating, sort]);

  const totalPages = Math.ceil(totalReviews / perPage);

  /* 🚀 If no reviews exist, render nothing */
  if (!reviews.length || totalReviews === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Customer Reviews</h2>

        <div className="flex items-center gap-3 mt-2">
          <span className="text-4xl font-bold">{avgRating}</span>

          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                className={
                  i < Math.round(avgRating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }
              />
            ))}
          </div>

          <span className="text-gray-500">
            ({totalReviews} reviews)
          </span>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={minRating}
          onChange={(e) => {
            setMinRating(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Star</option>
          <option value="4">4+ Star</option>
          <option value="3">3+ Star</option>
          <option value="2">2+ Star</option>
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="recent">Most Recent</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {/* REVIEWS */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border rounded-xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {review.user.full_name}
                </p>

                <div className="flex mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < review.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>

              {review.is_verified_purchase && (
                <span className="text-sm text-green-600 font-medium">
                  Verified Purchase
                </span>
              )}
            </div>

            <p className="mt-3 text-gray-700">
              {review.review_text}
            </p>

            {/* REVIEW IMAGES */}
            {review.images.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {review.images.map((img) => (
                  <Image
                    key={img.id}
                    src={img.url}
                    alt="review"
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                ))}
              </div>
            )}

            <p className="text-sm text-gray-400 mt-3">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-4 py-2 border rounded bg-gray-100">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
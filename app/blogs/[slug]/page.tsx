

// import { blogs, BlogPost } from "@/data/blogs";
// import { notFound } from "next/navigation";
// import Link from "next/link";

// export async function generateStaticParams() {
//   return blogs.map((blog) => ({
//     slug: blog.slug,
//   }));
// }

// export default async function BlogDetails({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const resolvedParams = await params;

//   const blog: BlogPost | undefined = blogs.find(
//     (b) => b.slug === resolvedParams.slug
//   );

//   if (!blog) return notFound();

//   return (
//     <article className="min-h-screen bg-[#ebecdf] py-20">

//       <div className="max-w-6xl mx-auto px-6">

//         {/* Title Section */}
//         <header className="mb-12 text-center">

//           {/* <p className="text-[#8ca21f] font-medium mb-4">
//             Gut Health Insights
//           </p> */}

//           <h1 className="text-4xl font-bold text-[#0f172a] leading-tight">
//             {blog.title}
//           </h1>

//         </header>

//         {/* Hero Image */}
//         <div className="mb-16 overflow-hidden rounded-2xl shadow-md bg-white">
//           <img
//             src={blog.image}
//             alt={blog.title}
//             className="
//               w-full
//               h-[220px]
//               sm:h-[260px]
//               md:h-[320px]
//               lg:h-[380px]
//               xl:h-[420px]
//               object-cover
//               transition-transform duration-500 hover:scale-105
//             "
//           />
//         </div>

//         {/* Blog Content Card */}
//         <div className="bg-white rounded-2xl shadow-md p-8 md:p-12">

//           <div
//             className="
//             text-gray-700
//             leading-relaxed
//             space-y-3

//             [&>h2]:text-[28px]
//             md:[&>h2]:text-[34px]
//             [&>h2]:font-bold
//             [&>h2]:text-[#0f172a]
//             [&>h2]:mt-12

//             [&>h3]:text-xl
//             md:[&>h3]:text-2xl
//             [&>h3]:font-semibold
//             [&>h3]:text-[#0f172a]
//             [&>h3]:mt-8

//             [&>p]:text-[16px]
//             md:[&>p]:text-[18px]
//             [&>p]:leading-8
//             [&>p]:text-gray-600

//             [&>ul]:list-disc
//             [&>ul]:pl-6
//             [&>ul]:space-y-2
//             [&>ul]:text-[16px]

//             [&>ul>li]:marker:text-[#8ca21f]

//             [&>strong]:text-[#0f172a]
//             [&>strong]:font-semibold

//             [&>blockquote]:border-l-4
//             [&>blockquote]:border-[#8ca21f]
//             [&>blockquote]:bg-[#f6f7ea]
//             [&>blockquote]:px-6
//             [&>blockquote]:py-4
//             [&>blockquote]:rounded-xl
//             [&>blockquote]:text-lg
//             [&>blockquote]:font-medium
//             [&>blockquote]:text-[#0f172a]

//             [&>hr]:my-12
//             [&>hr]:border-gray-200
//             "
//             dangerouslySetInnerHTML={{ __html: blog.content }}
//           />

//         </div>

        

//       </div>
//     </article>
//   );
// }









import { blogs, BlogPost } from "@/data/blogs";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  const blog: BlogPost | undefined = blogs.find(
    (b) => b.slug === resolvedParams.slug
  );

  if (!blog) return notFound();

  return (
    <article className="min-h-screen bg-[#ebecdf] py-12 ">

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Title Section */}
        <header className="mb-10 text-center">

          {/* <p className="text-[#5c5c5c] font-bold tracking-wider uppercase text-sm mb-4">
            Gut Health Insights
          </p> */}

          <h1 className="text-3xl md:text-4xl font-bold text-[#1b1b1b] leading-tight">
            {blog.title}
          </h1>

        </header>

        {/* Hero Image */}
        <div className="mb-12 overflow-hidden rounded-xl shadow-sm border border-[#d6d1c4] bg-[#f4f4f2]">
          <img
            src={blog.image}
            alt={blog.title}
            className="
              w-full
              h-[220px]
              sm:h-[260px]
              md:h-[360px]
              lg:h-[420px]
              object-cover
              transition-transform duration-500 hover:scale-105
            "
          />
        </div>

        {/* Blog Content Card */}
        <div className="bg-[#f4f4f2] rounded-xl shadow-sm border border-[#d6d1c4] p-6 sm:p-8 md:p-12">

          <div
            className="
            text-[#5c5c5c]
            leading-relaxed
            space-y-4

            [&>h2]:text-[26px]
            md:[&>h2]:text-[32px]
            [&>h2]:font-bold
            [&>h2]:text-[#1b1b1b]
            [&>h2]:mt-10
            [&>h2]:mb-4

            [&>h3]:text-xl
            md:[&>h3]:text-2xl
            [&>h3]:font-bold
            [&>h3]:text-[#1b1b1b]
            [&>h3]:mt-8
            [&>h3]:mb-3

            [&>p]:text-[16px]
            md:[&>p]:text-[18px]
            [&>p]:leading-8
            [&>p]:text-[#5c5c5c]
            [&>p]:mb-5

            [&>ul]:list-disc
            [&>ul]:pl-6
            [&>ul]:space-y-2
            [&>ul]:text-[16px]
            md:[&>ul]:text-[18px]
            [&>ul]:mb-6

            [&>ul>li]:marker:text-[#C5D82D]
            [&>ol>li]:marker:text-[#1b1b1b]
            [&>ol>li]:marker:font-bold

            [&>strong]:text-[#1b1b1b]
            [&>strong]:font-bold

            [&>blockquote]:border-l-4
            [&>blockquote]:border-[#C5D82D]
            [&>blockquote]:bg-[#ebecdf]
            [&>blockquote]:px-6
            [&>blockquote]:py-5
            [&>blockquote]:rounded-r-xl
            [&>blockquote]:text-lg
            md:[&>blockquote]:text-xl
            [&>blockquote]:font-medium
            [&>blockquote]:text-[#1b1b1b]
            [&>blockquote]:my-8

            [&>hr]:my-10
            [&>hr]:border-[#d6d1c4]
            "
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

        </div>

      </div>
    </article>
  );
}
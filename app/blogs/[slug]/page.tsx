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
//     <article className="min-h-screen bg-gray-50 py-10">
//       <div className="max-w-6xl mx-auto px-6">

        

//         {/* Title */}
//         <header className="mb-10">
//           <h1
//   className="
//     text-4xl 
//     font-extrabold 
//     leading-tight 
//     text-gray-900 
//     mb-4 
//     text-center 
//     mx-auto
//   "
// >
//     {blog.title}
//     </h1>
//         </header>

//         {/* Hero Image */}
//         <div className="mb-12 overflow-hidden rounded-3xl shadow-lg">
//   <img
//     src={blog.image}
//     alt={blog.title}
//     className="
//     w-full
//     h-[220px]
//     sm:h-[260px]
//     md:h-[320px]
//     lg:h-[380px]
//     xl:h-[420px]
//     object-cover
//     transition-transform duration-500 hover:scale-105
//     "
//   />
// </div>

//         {/* Blog Content */}
//         <div
//   className="
//   text-gray-700
//   leading-relaxed
//   space-y-2

//   [&>h2]:text-2xl
//   sm:[&>h2]:text-3xl
//   md:[&>h2]:text-4xl
//   [&>h2]:font-extrabold
//   [&>h2]:text-gray-900
//   [&>h2]:mt-14
//   [&>h2]:tracking-tight

//   [&>h3]:text-xl
//   sm:[&>h3]:text-2xl
//   [&>h3]:font-semibold
//   [&>h3]:text-gray-900
//   [&>h3]:mt-10

//   [&>p]:text-base 
//   sm:[&>p]:text-lg
//   [&>p]:leading-8
//   [&>p]:text-gray-700

//   [&>ul]:list-disc
//   [&>ul]:pl-6
//   [&>ul]:space-y-2
//   [&>ul]:text-base
//   sm:[&>ul]:text-lg

//   [&>ul>li]:marker:text-emerald-600
//   [&>ul>li]:pl-1

//   [&>strong]:text-gray-900
//   [&>strong]:font-semibold

//   [&>blockquote]:border-l-4
//   [&>blockquote]:border-emerald-500
//   [&>blockquote]:bg-emerald-50/70
//   [&>blockquote]:px-6
//   [&>blockquote]:py-4
//   [&>blockquote]:rounded-xl
//   [&>blockquote]:text-lg
//   [&>blockquote]:font-medium
//   [&>blockquote]:text-emerald-900

//   [&>hr]:my-12
//   [&>hr]:border-gray-200
//   "
//   dangerouslySetInnerHTML={{ __html: blog.content }}
// />

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
    <article className="min-h-screen bg-[#ebecdf] py-20">

      <div className="max-w-6xl mx-auto px-6">

        {/* Title Section */}
        <header className="mb-12 text-center">

          {/* <p className="text-[#8ca21f] font-medium mb-4">
            Gut Health Insights
          </p> */}

          <h1 className="text-4xl font-bold text-[#0f172a] leading-tight">
            {blog.title}
          </h1>

        </header>

        {/* Hero Image */}
        <div className="mb-16 overflow-hidden rounded-2xl shadow-md bg-white">
          <img
            src={blog.image}
            alt={blog.title}
            className="
              w-full
              h-[220px]
              sm:h-[260px]
              md:h-[320px]
              lg:h-[380px]
              xl:h-[420px]
              object-cover
              transition-transform duration-500 hover:scale-105
            "
          />
        </div>

        {/* Blog Content Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-12">

          <div
            className="
            text-gray-700
            leading-relaxed
            space-y-3

            [&>h2]:text-[28px]
            md:[&>h2]:text-[34px]
            [&>h2]:font-bold
            [&>h2]:text-[#0f172a]
            [&>h2]:mt-12

            [&>h3]:text-xl
            md:[&>h3]:text-2xl
            [&>h3]:font-semibold
            [&>h3]:text-[#0f172a]
            [&>h3]:mt-8

            [&>p]:text-[16px]
            md:[&>p]:text-[18px]
            [&>p]:leading-8
            [&>p]:text-gray-600

            [&>ul]:list-disc
            [&>ul]:pl-6
            [&>ul]:space-y-2
            [&>ul]:text-[16px]

            [&>ul>li]:marker:text-[#8ca21f]

            [&>strong]:text-[#0f172a]
            [&>strong]:font-semibold

            [&>blockquote]:border-l-4
            [&>blockquote]:border-[#8ca21f]
            [&>blockquote]:bg-[#f6f7ea]
            [&>blockquote]:px-6
            [&>blockquote]:py-4
            [&>blockquote]:rounded-xl
            [&>blockquote]:text-lg
            [&>blockquote]:font-medium
            [&>blockquote]:text-[#0f172a]

            [&>hr]:my-12
            [&>hr]:border-gray-200
            "
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

        </div>

        

      </div>
    </article>
  );
}
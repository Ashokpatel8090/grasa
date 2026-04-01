import { blogs, BlogPost } from "@/data/blogs";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}


const generateBlogSchema = (blog: BlogPost) => {
  const domain = "https://www.grasamillets.com";

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",

    "headline": blog.title,
    "description": blog.excerpt,
    "image": blog.image,

    "author": {
      "@type": "Organization",
      "name": blog.author || "Grasa"
    },

    "publisher": {
      "@type": "Organization",
      "name": "Grasa",
      "logo": {
        "@type": "ImageObject",
        "url": `${domain}/logo.png`
      }
    },

    "datePublished": blog.date,
    "dateModified": blog.date,

    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${domain}/blogs/${blog.slug}`
    },

    "url": `${domain}/blogs/${blog.slug}`,

    "articleSection": blog.category,
    "keywords": [
      "gut health",
      "millets",
      "PCOS diet",
      "metabolic health",
      "Grasa nutrition"
    ]
  };
};


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
  const schemaData = generateBlogSchema(blog);

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData),
      }}
    />

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
    </>
  );
}
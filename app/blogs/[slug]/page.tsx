

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
  
  // Dynamically generates the exact URL for the current blog post
  const currentUrl = `${domain}/blogs/${blog.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    },
    "headline": blog.title,
    "description": blog.excerpt,
    "image": blog.image,
    "url": currentUrl,
    "datePublished": blog.date,
    "dateModified": blog.date, // Best practice: update this dynamically if your CMS tracks edit dates
    "articleSection": blog.category,
    "keywords": [
      "gut health",
      "millets",
      "PCOS diet",
      "metabolic health",
      "Grasa nutrition"
    ],
    "author": {
      "@type": "Organization",
      "@id": `${domain}/#organization`, // Links the author to your master brand entity
      "name": blog.author || "Grasa",
      "url": domain
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${domain}/#organization`, // Links the publisher to your master brand entity
      "name": "Grasa",
      "alternateName": ["Grasa Millets", "GRASA", "Grasa Wellness", "Grasa Nutrition"],
      "url": domain,
      "logo": {
        "@type": "ImageObject",
        "url": `${domain}/logo.png`
      }
    }
  };
};

// Determine layout based on blog slug (alternating pattern)
const getLayoutDirection = (slug: string): 'left' | 'right' => {
  const slugs = [
    "pcos-gut-connection-hormones-india",
    "pre-diabetic-diet-india-what-to-eat",
    "sourdough-vs-multigrain-vs-whole-wheat-bread-india",
    "gut-health-thyroid-connection-india",
    "what-to-feed-diabetic-parents-india",
  ];
  
  const index = slugs.indexOf(slug);
  return index % 2 === 0 ? 'left' : 'right';
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
  const relatedBlogs = blog.relatedBlogs 
    ? blogs.filter(b => blog.relatedBlogs?.includes(b.slug)).slice(0, 3)
    : [];

  const layoutDirection = getLayoutDirection(blog.slug);
  const imageOnLeft = layoutDirection === 'left';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />

      <article className="min-h-screen bg-gradient-to-b from-[#f4f4f2] via-[#fbfbf9] to-[#ebecdf] ">
        
        {/* Hero Section with Alternating Layout */}
        <section className="relative overflow-hidden py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-full mx-auto">
            {/* Main Hero with Alternating Layout */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
              
              {/* Image Column */}
              <div className={`${imageOnLeft ? 'lg:order-1' : 'lg:order-2'}`}>
  <img
    src={blog.image}
    alt={blog.title}
    className="w-full h-auto rounded-xl"
  />

  {/* Category Badge */}
  <div className="mt-3">
    <span className="px-3 py-1 bg-[#C5D82D] text-[#1b1b1b] text-xs font-bold uppercase rounded-full">
      {blog.category}
    </span>
  </div>

  {/* Read Time */}
  <div className="mt-2 text-sm text-gray-600">
    {blog.readTime} min read
  </div>
</div>

              {/* Content Column */}
              <div className={`flex flex-col justify-center ${imageOnLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                
                {/* Category Label */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="w-1 h-8 bg-[#C5D82D] rounded-full" />
                  <span className="text-sm font-bold uppercase tracking-widest text-[#8ca21f]">
                    {blog.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-bold text-[#1b1b1b] mb-6 leading-tight max-w-full
               text-2xl 
               sm:text-3xl 
               md:text-4xl 
               ">
  {blog.title}
</h1>

                {/* Excerpt/Description */}
                <p className="text-md  text-[#5c5c5c] mb-8 leading-relaxed max-w-xl">
                  {blog.excerpt}
                </p>

                {/* Meta Information */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 pb-8 border-b border-[#d6d1c4]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5D82D] to-[#8ca21f] flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg">G</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#1b1b1b]">{blog.author}</p>
                      <p className="text-sm text-[#5c5c5c]">
                        {new Date(blog.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {blog.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs bg-[#C5D82D]/20 text-[#8ca21f] rounded-full border border-[#C5D82D]/40 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
  href="/products"
  className="px-8 py-4 bg-[#C5D82D] text-[#1b1b1b] font-bold rounded-lg hover:bg-[#8ca21f] transition-colors duration-300 text-center inline-block"
>
  Shop Products
</Link>
                  <a
                    href="https://api.whatsapp.com/send?phone=919870263399"
                    className="px-8 py-4 border-2 border-[#C5D82D] text-[#C5D82D] font-bold rounded-lg hover:bg-[#C5D82D] hover:text-[#1b1b1b] transition-colors duration-300 text-center"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#d6d1c4] to-transparent" />

        {/* Main Content Section */}
        <section className="relative z-20 px-4 sm:px-6 py-12">
          <div className="max-w-7xl mx-auto">
            
            {/* Content Layout: Main + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Main Content - 2 columns */}
              <div className="lg:col-span-2">
                <div className="prose prose-lg max-w-none">
                  <div
                    className="
                      text-[#5c5c5c]
                      leading-relaxed
                      space-y-6

                      [&>h2]:text-3xl
                      md:[&>h2]:text-4xl
                      [&>h2]:font-bold
                      [&>h2]:text-[#1b1b1b]
                      [&>h2]:mt-12
                      [&>h2]:mb-6

                      [&>h3]:text-2xl
                      [&>h3]:font-bold
                      [&>h3]:text-[#1b1b1b]
                      [&>h3]:mt-10
                      [&>h3]:mb-4

                      [&>p]:text-[16px]
                      md:[&>p]:text-[17px]
                      [&>p]:leading-8
                      [&>p]:text-[#5c5c5c]
                      [&>p]:mb-6

                      [&>ul]:list-disc
                      [&>ul]:pl-6
                      [&>ul]:space-y-3
                      [&>ul]:text-[16px]
                      [&>ul]:mb-6

                      [&>ul>li]:text-[#5c5c5c]
                      [&>ul>li>strong]:text-[#1b1b1b]
                      [&>ul>li]:marker:text-[#C5D82D]

                      [&>ol]:list-decimal
                      [&>ol]:pl-6
                      [&>ol]:space-y-3
                      [&>ol]:mb-6

                      [&>strong]:text-[#1b1b1b]
                      [&>strong]:font-bold

                      [&>blockquote]:border-l-4
                      [&>blockquote]:border-[#C5D82D]
                      [&>blockquote]:bg-[#ebecdf]
                      [&>blockquote]:px-6
                      [&>blockquote]:py-5
                      [&>blockquote]:rounded-r-xl
                      [&>blockquote]:text-lg
                      [&>blockquote]:font-medium
                      [&>blockquote]:text-[#1b1b1b]
                      [&>blockquote]:my-8
                      [&>blockquote]:italic

                      [&>hr]:my-10
                      [&>hr]:border-[#d6d1c4]

                      [&>table]:w-full
                      [&>table]:border-collapse
                      [&>table]:my-8
                    "
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>
              </div>

              {/* Sidebar - 1 column */}
              <div className="lg:col-span-1">
                {/* Sidebar Images */}
                <div className="sticky top-8 space-y-6">
                  {blog.sidebarImages && blog.sidebarImages.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#1b1b1b] mb-4">Related Visuals</h3>
                      {blog.sidebarImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl overflow-hidden shadow-md border border-[#d6d1c4] hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
                        >
                          <div className="relative h-64 overflow-hidden bg-[#f4f4f2]">
                            <img
                              src={img}
                              alt={`Related visual ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Related Articles */}
                  {relatedBlogs.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-[#d6d1c4]">
                      <h3 className="text-lg font-bold text-[#1b1b1b] mb-4">Related Articles</h3>
                      <div className="space-y-4">
                        {relatedBlogs.map((relBlog) => (
                          <Link key={relBlog.slug} href={`/blogs/${relBlog.slug}`}>
                            <div className="group cursor-pointer">
                              <p className="text-sm font-semibold text-[#1b1b1b] group-hover:text-[#8ca21f] transition-colors duration-300 line-clamp-2 mb-2">
                                {relBlog.title}
                              </p>
                              <p className="text-xs text-[#5c5c5c]">
                                {new Date(relBlog.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Box */}
                  <div className="mt-12 pt-8 border-t border-[#d6d1c4]">
                    <div className="bg-gradient-to-br from-[#ebecdf] to-[#f4f4f2] rounded-xl p-6 border border-[#C5D82D] shadow-md">
                      <h4 className="font-bold text-[#1b1b1b] mb-2 text-sm uppercase tracking-wide">
                        Explore GRASA
                      </h4>
                      <p className="text-sm text-[#5c5c5c] mb-4 leading-relaxed">
                        Fermented atta and sourdough bread crafted for gut health and metabolic wellness.
                      </p>
                      <Link
                        href="/products"
                        className="inline-block px-4 py-2 bg-[#C5D82D] text-[#1b1b1b] text-sm font-bold rounded-lg hover:bg-[#8ca21f] transition-colors duration-300 w-full text-center"
                      >
                        Shop Now
                      </Link>
                      <p className="text-xs text-[#5c5c5c] mt-3 text-center">
                        Or WhatsApp: <span className="font-semibold">+91 9870263399</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Share Section */}
        

        {/* Newsletter CTA */}
        <section className="bg-[#1b1b1b] text-white py-16 px-4">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-4">
      Explore Healthy Products
    </h2>
    <p className="text-lg text-gray-300 mb-8">
      Discover nutritious millet-based foods crafted for better health.
    </p>

    <a
      href="/products"
      className="inline-block px-8 py-4 bg-[#C5D82D] text-[#1b1b1b] font-bold rounded-lg hover:bg-[#8ca21f] transition-colors duration-300"
    >
      Shop Now
    </a>
  </div>
</section>

        {/* Navigation to other blogs */}
        <section className="px-4 py-16 bg-[#f4f4f2]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1b1b1b] mb-8">Explore More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.filter(b => b.slug !== blog.slug).slice(0, 4).map((otherBlog) => (
                <Link key={otherBlog.slug} href={`/blogs/${otherBlog.slug}`}>
                  <article className="group bg-white rounded-xl p-6 border border-[#d6d1c4] hover:border-[#C5D82D] hover:shadow-md transition-all duration-300 cursor-pointer h-full">
                    <span className="text-xs font-bold text-[#8ca21f] uppercase">
                      {otherBlog.category}
                    </span>
                    <h3 className="text-lg font-bold text-[#1b1b1b] my-2 group-hover:text-[#8ca21f] transition-colors line-clamp-2">
                      {otherBlog.title}
                    </h3>
                    <p className="text-sm text-[#5c5c5c] line-clamp-2 mb-3">
                      {otherBlog.excerpt}
                    </p>
                    <span className="text-sm font-semibold text-[#8ca21f] group-hover:translate-x-1 transition-transform duration-300">
                      Read More →
                    </span>
                  </article>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/blogs">
                <button className="px-8 py-3 border-2 border-[#1b1b1b] text-[#1b1b1b] font-bold rounded-lg hover:bg-[#1b1b1b] hover:text-white transition-colors duration-300">
                  View All Articles
                </button>
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
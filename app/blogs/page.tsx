import Link from 'next/link';
import { blogs } from '@/data/blogs';


const generateBlogsSchema = () => {
  const domain = "https://www.grasamillets.com";

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "GRASA Wellness Blogs",
    "url": `${domain}/blogs`,
    "description": "Explore wellness blogs by GRASA covering gut health, millets nutrition, metabolic health, and lifestyle improvement.",
    "publisher": {
      "@type": "Organization",
      "name": "Grasa",
      "alternateName": "Grasa Millets",
      "url": domain
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": blogs.map((blog, index) => ({
        "@type": "BlogPosting",
        "position": index + 1,
        "headline": blog.title,
        "description": blog.excerpt,
        "image": blog.image,
        "author": {
          "@type": "Organization",
          "name": blog.author || "Grasa",
          "url": domain
        },
        "publisher": {
          "@type": "Organization",
          "name": "Grasa",
          "alternateName": "Grasa Millets",
          "url": domain
        },
        "datePublished": blog.date,
        "url": `${domain}/blogs/${blog.slug}`
      }))
    }
  };
};


export default function BlogsListing() {
  const schemaData = generateBlogsSchema();
  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData),
      }}
    />
   
    <main className="min-h-screen bg-[#ebecdf] px-4 py-6">
      <div className="md:max-w-[96%] mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-[#1b1b1b] text-center">GRASA Wellness Blogs</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <article 
              key={blog.slug} 
              className="group border border-[#d6d1c4] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-[#f4f4f2]"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold mb-3 text-[#1b1b1b] group-hover:text-[#000000] transition-colors line-clamp-2">
                  <Link href={`/blogs/${blog.slug}`}>
                    {blog.title}
                  </Link>
                </h2>
                <p className="text-[#5c5c5c] text-sm mb-6 line-clamp-3">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between border-t border-[#d6d1c4] pt-4">
                  <span className="text-xs text-[#5c5c5c] font-medium">{blog.date}</span>
                  <Link 
                    href={`/blogs/${blog.slug}`} 
                    className="text-sm font-bold text-[#1b1b1b] hover:underline transition-colors"
                  >
                    READ BLOG →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
     </>
  );
}
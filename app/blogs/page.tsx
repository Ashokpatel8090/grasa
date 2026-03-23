
// import Link from 'next/link';
// import { blogs } from '@/data/blogs';

// export default function BlogsListing() {
//   return (
//     <main className="max-w-7xl mx-auto px-4 py-12">
//       <h1 className="text-4xl font-bold mb-10 text-gray-900">GRASA Wellness Blogs</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {blogs.map((blog) => (
//           <article key={blog.slug} className="group border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
//             <div className="relative h-56 overflow-hidden">
//               <img 
//                 src={blog.image} 
//                 alt={blog.title} 
//                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//               />
//               <div className="absolute top-4 left-4">
//                 <span className="bg-white/90 backdrop-blur-sm text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
//                   {blog.category}
//                 </span>
//               </div>
//             </div>
            
//             <div className="p-6">
//               <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
//                 <Link href={`/blogs/${blog.slug}`}>
//                   {blog.title}
//                 </Link>
//               </h2>
//               <p className="text-gray-600 text-sm mb-6 line-clamp-3">
//                 {blog.excerpt}
//               </p>
//               <div className="flex items-center justify-between border-t pt-4">
//                 <span className="text-xs text-gray-400 font-medium">{blog.date}</span>
//                 <Link 
//                   href={`/blogs/${blog.slug}`} 
//                   className="text-sm font-bold text-emerald-600 hover:text-emerald-800"
//                 >
//                   READ BLOG →
//                 </Link>
//               </div>
//             </div>
//           </article>
//         ))}
//       </div>
//     </main>
//   );
// }








import Link from 'next/link';
import { blogs } from '@/data/blogs';

export default function BlogsListing() {
  return (
    <main className="min-h-screen bg-[#ebecdf] px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-[#1b1b1b] text-center">GRASA Wellness Blogs</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <div className="absolute top-4 left-4">
                  <span className="bg-[#C5D82D]/95 backdrop-blur-sm text-[#1b1b1b] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    {blog.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold mb-3 text-[#1b1b1b] group-hover:text-[#5c5c5c] transition-colors line-clamp-2">
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
  );
}
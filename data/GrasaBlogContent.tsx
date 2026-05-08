"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BlogPost } from "@/data/blogs";
import {
  Share2,
  X,
  Link2,
  Check,
  Facebook,
  Linkedin,
  Twitter,
  MessageCircle,
} from "lucide-react";

interface GrasaBlogContentProps {
  blog: BlogPost;
  allBlogs: BlogPost[];
  relatedBlogs: BlogPost[];
  imageOnLeft: boolean;
}

const DOMAIN = "https://www.grasamillets.com";

export default function GrasaBlogContent({
  blog,
  allBlogs,
  relatedBlogs,
  imageOnLeft,
}: GrasaBlogContentProps) {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(`${window.location.origin}/blogs/${blog.slug}`);
  }, [blog.slug]);

  const ogImage = blog.image.startsWith("http") ? blog.image : `${DOMAIN}${blog.image}`;
  const shareText = blog.title;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: shareUrl,
        });
      } catch {
        setShowShare(true);
      }
    } else {
      setShowShare(true);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const el = document.createElement("textarea");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "width=600,height=500,noopener,noreferrer");
  };

  const platforms = [
    {
      name: "Facebook",
      icon: <Facebook size={17} />,
      color: "bg-[#1877F2] hover:bg-[#166fe5]",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "Twitter / X",
      icon: <Twitter size={17} />,
      color: "bg-[#000000] hover:bg-[#333333]",
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={17} />,
      color: "bg-[#0A66C2] hover:bg-[#0958a8]",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle size={17} />,
      color: "bg-[#25D366] hover:bg-[#20bd5a]",
      url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: "Telegram",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      color: "bg-[#229ED9] hover:bg-[#1a8fc2]",
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: "Email",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-[17px] h-[17px]">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      color: "bg-[#555555] hover:bg-[#333333]",
      url: `mailto:?subject=${encodedText}&body=${encodeURIComponent(`${blog.excerpt}\n\nRead more: ${shareUrl}`)}`,
    },
  ];

  return (
    <article className="min-h-screen bg-gradient-to-b from-[#f4f4f2] via-[#fbfbf9] to-[#ebecdf]">

      {/* ── SHARE MODAL ─────────────────────────────────────────────────────── */}
      {showShare && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowShare(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaeaea]">
              <h3 className="font-bold text-[#1b1b1b] text-base">Share this article</h3>
              <button
                onClick={() => setShowShare(false)}
                className="w-8 h-8 rounded-full bg-[#f4f4f2] flex items-center justify-center hover:bg-[#ebecdf] transition-colors"
              >
                <X size={16} className="text-[#5c5c5c]" />
              </button>
            </div>

            {/* Article Preview */}
            <div className="px-6 pt-4 pb-3 flex items-start gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#f4f4f2]">
                <img
                  src={ogImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-[#8ca21f] uppercase tracking-wider mb-1">
                  {blog.category}
                </p>
                <p className="text-sm font-semibold text-[#1b1b1b] line-clamp-2 leading-snug">
                  {blog.title}
                </p>
                <p className="text-xs text-[#5c5c5c] mt-1">grasamillets.com</p>
              </div>
            </div>

            {/* Platform Grid */}
            <div className="px-6 pt-2 pb-4">
              <p className="text-xs text-[#5c5c5c] font-medium uppercase tracking-wider mb-3">
                Share via
              </p>
              <div className="grid grid-cols-3 gap-2">
                {platforms.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => openShareWindow(p.url)}
                    className={`${p.color} text-white rounded-xl flex flex-col items-center justify-center gap-1.5 py-3 px-2 transition-all duration-200 hover:scale-105 active:scale-95`}
                  >
                    {p.icon}
                    <span className="text-[10px] font-semibold leading-none">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Copy Link */}
            <div className="px-6 pb-6">
              <div className="flex items-center gap-2 bg-[#f4f4f2] border border-[#d6d1c4] rounded-xl px-3 py-2">
                <Link2 size={14} className="text-[#5c5c5c] flex-shrink-0" />
                <p className="text-xs text-[#5c5c5c] truncate flex-1">{shareUrl}</p>
                <button
                  onClick={handleCopy}
                  className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-[#C5D82D] text-[#1b1b1b] hover:bg-[#8ca21f]"
                  }`}
                >
                  {copied ? (
                    <span className="flex items-center gap-1">
                      <Check size={11} /> Copied
                    </span>
                  ) : (
                    "Copy"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── HERO SECTION ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Image Column */}
            <div className={imageOnLeft ? "lg:order-1" : "lg:order-2"}>
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-auto rounded-xl"
              />
              <div className="mt-3">
                <span className="px-3 py-1 bg-[#C5D82D] text-[#1b1b1b] text-xs font-bold uppercase rounded-full">
                  {blog.category}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {blog.readTime} min read
              </div>
            </div>

            {/* Content Column */}
            <div className={`flex flex-col justify-center ${imageOnLeft ? "lg:order-2" : "lg:order-1"}`}>

              <div className="mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-[#C5D82D] rounded-full" />
                <span className="text-sm font-bold uppercase tracking-widest text-[#8ca21f]">
                  {blog.category}
                </span>
              </div>

              <h1 className="font-bold text-[#1b1b1b] mb-6 leading-tight max-w-full text-2xl sm:text-3xl md:text-4xl">
                {blog.title}
              </h1>

              <p className="text-md text-[#5c5c5c] mb-8 leading-relaxed max-w-xl">
                {blog.excerpt}
              </p>

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

                {/* Share Button */}
                <button
                  onClick={handleNativeShare}
                  className="px-8 py-4 border-2 border-[#8ca21f] text-[#8ca21f] font-bold rounded-lg hover:bg-[#C5D82D] hover:text-[#1b1b1b] hover:border-[#C5D82D] transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#d6d1c4] to-transparent" />

      {/* ── MAIN CONTENT SECTION ──────────────────────────────────────────── */}
      <section className="relative z-20 px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Main Content */}
            <div className="lg:col-span-2">

              {/* Inline Share Bar */}
              <div className="flex items-center gap-3 mb-8 flex-wrap">
                <span className="text-sm font-semibold text-[#5c5c5c]">Share:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {platforms.slice(0, 4).map((p) => (
                    <button
                      key={p.name}
                      onClick={() => openShareWindow(p.url)}
                      title={`Share on ${p.name}`}
                      className={`${p.color} text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95`}
                    >
                      {p.icon}
                    </button>
                  ))}
                  <button
                    onClick={handleCopy}
                    title="Copy link"
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
                      copied ? "bg-green-500 text-white" : "bg-[#d6d1c4] text-[#5c5c5c] hover:bg-[#c0bab0]"
                    }`}
                  >
                    {copied ? <Check size={14} /> : <Link2 size={14} />}
                  </button>
                  <button
                    onClick={handleNativeShare}
                    title="More share options"
                    className="w-8 h-8 rounded-full bg-[#1b1b1b] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#C5D82D] hover:text-[#1b1b1b] active:scale-95"
                  >
                    <Share2 size={14} />
                  </button>
                </div>
              </div>

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

              {/* End-of-Article Share */}
              <div className="mt-12 pt-8 border-t border-[#d6d1c4]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-[#5c5c5c]">
                    Found this helpful? Share it with your network.
                  </p>
                  <button
                    onClick={handleNativeShare}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#C5D82D] text-[#1b1b1b] text-sm font-bold rounded-lg hover:bg-[#8ca21f] transition-colors duration-300"
                  >
                    <Share2 size={16} />
                    Share Article
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
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

                {relatedBlogs.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-[#d6d1c4]">
                    <h3 className="text-lg font-bold text-[#1b1b1b] mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedBlogs.map((relBlog) => (
                        <Link key={relBlog.slug} href={`/blogs/${relBlog.slug}`}>
                          <div className="group cursor-pointer mb-4">
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

                {/* Sidebar Share Widget */}
                <div className="mt-8 pt-8 border-t border-[#d6d1c4]">
                  <h4 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide mb-3">
                    Share this Article
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => openShareWindow(p.url)}
                        title={p.name}
                        className={`${p.color} text-white w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95`}
                      >
                        {p.icon}
                      </button>
                    ))}
                    <button
                      onClick={handleCopy}
                      title="Copy link"
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
                        copied ? "bg-green-500 text-white" : "bg-[#d6d1c4] text-[#5c5c5c] hover:bg-[#c0bab0]"
                      }`}
                    >
                      {copied ? <Check size={15} /> : <Link2 size={15} />}
                    </button>
                  </div>
                </div>

                {/* CTA Box */}
                <div className="mt-4 pt-8 border-t border-[#d6d1c4]">
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
                      Or WhatsApp:{" "}
                      <span className="font-semibold">+91 9870263399</span>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* More Articles */}
      <section className="px-4 py-16 bg-[#f4f4f2]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1b1b1b] mb-8">Explore More Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allBlogs
              .filter((b) => b.slug !== blog.slug)
              .slice(0, 4)
              .map((otherBlog) => (
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
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, Search, Filter } from "lucide-react";

// 博客文章数据
const blogPosts = [
  {
    id: "wechat-hd-photo-guide",
    title: "朋友圈发布高清照片完全指南：不再被压缩的秘诀",
    date: "2024-03-20",
    excerpt: "学习如何在朋友圈发布不被压缩的高清照片，从尺寸调整到专业工具，一站式解决方案。",
    coverImage: "https://pic1.imgdb.cn/item/67e10dac0ba3d5a1d7e28c6b.png",
    tags: ["微信朋友圈", "高清照片", "实用技巧"],
  },
  {
    id: "wechat-moments-photo-tips",
    title: "微信朋友圈摄影与分享：从拍摄到发布保持高清质量",
    date: "2024-03-22",
    excerpt: "专业的微信朋友圈摄影指南，从拍摄技巧到发布策略，全方位提升朋友圈照片质量。",
    coverImage: "https://pic1.imgdb.cn/item/67e10f6a0ba3d5a1d7e28cd0.png",
    tags: ["微信朋友圈", "摄影技巧", "高清图片"],
  },
  {
    id: "xiaohongshu-hd-profile",
    title: "小红书高清主页打造攻略：脱颖而出的视觉密码",
    date: "2024-03-18",
    excerpt: "打造吸引目光的小红书主页，关键在于高质量图片的处理与展示，本文深入解析各种技巧。",
    coverImage: "https://pic1.imgdb.cn/item/67e10eae0ba3d5a1d7e28ca5.png",
    tags: ["小红书", "主页优化", "图片处理"],
  },
  {
    id: "smartphone-photography-skills",
    title: "手机摄影进阶：让你的照片秒变专业级",
    date: "2024-03-15",
    excerpt: "掌握这些手机摄影技巧，不需要专业设备也能拍出令人惊艳的照片，轻松提升你的社交媒体形象。",
    coverImage: "https://pic1.imgdb.cn/item/67e10fb40ba3d5a1d7e28ce5.png",
    tags: ["手机摄影", "构图技巧", "后期处理"],
  },
  {
    id: "social-media-image-size-guide",
    title: "2024年社交媒体图片尺寸完全指南",
    date: "2024-03-10",
    excerpt: "全面解析各大社交平台的最佳图片尺寸，让你的内容在任何平台都能完美呈现，提升曝光率与互动。",
    coverImage: "https://pic1.imgdb.cn/item/67e10fd20ba3d5a1d7e28ceb.png",
    tags: ["图片尺寸", "社交媒体", "视觉营销"],
  },
  {
    id: "codeformer-ai-intro",
    title: "CodeFormer AI：革命性的图像增强技术",
    date: "2023-05-15",
    excerpt: "探索CodeFormer AI如何改变图像增强领域，了解这项技术背后的原理及其优势。",
    coverImage: "https://tuchuang.org.cn/imgs/2025/03/22/89879711d95bbc5d.jpg",
    tags: ["CodeFormer AI", "图像增强", "AI技术"],
  },
  {
    id: "codeformer-vs-traditional",
    title: "CodeFormer与传统图像增强方法的对比",
    date: "2023-06-10",
    excerpt: "深入分析CodeFormer AI与传统图像增强技术的差异，为什么新一代AI模型能够提供更自然的结果。",
    coverImage: "https://pic1.imgdb.cn/item/67e1101e0ba3d5a1d7e28d06.png",
    tags: ["技术对比", "图像处理", "超分辨率"],
  },
  {
    id: "photo-enhancement-guide",
    title: "使用CodeFormer AI提升照片质量的完整指南",
    date: "2023-07-22",
    excerpt: "从专业角度教你如何使用CodeFormer AI技术最大程度地提升照片质量，修复常见问题。",
    coverImage: "https://pic1.imgdb.cn/item/67dcfbaf88c538a9b5c294b3.png",
    tags: ["教程", "照片修复", "最佳实践"],
  },
  {
    id: "codeformer-future",
    title: "AI图像增强的未来：CodeFormer技术展望",
    date: "2023-08-15",
    excerpt: "探索CodeFormer AI技术的发展前景，以及它如何影响未来的图像处理和内容创作。",
    coverImage: "https://pic1.imgdb.cn/item/67e1105a0ba3d5a1d7e28d22.png",
    tags: ["技术趋势", "AI发展", "未来展望"],
  },
];

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // 获取所有标签
  const allTags = Array.from(
    new Set(blogPosts.flatMap((post) => post.tags))
  );
  
  // 根据标签和搜索词筛选文章
  const filteredPosts = blogPosts
    .filter(post => !activeTag || post.tags.includes(activeTag))
    .filter(post => 
      searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <main className="min-h-screen hero-gradient text-white">
      <div className="mx-auto max-w-[1168px] px-4 py-12 md:py-20">
        {/* 返回主页 */}
        <div className="mb-8">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 transition-all duration-300 rounded-full flex items-center gap-2 px-5 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回主页
            </Button>
          </Link>
        </div>
        
        {/* 博客标题 */}
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold shine-text mb-4">
            图片增强技术博客
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            探索CodeFormer AI技术的前沿应用，了解如何使用AI工具提升照片质量
          </p>
        </div>

        {/* 搜索框 */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索文章..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* 标签筛选 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={activeTag === null ? "default" : "outline"}
              className={`rounded-full shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 ${
                activeTag === null 
                  ? "bg-blue-600 text-white border-none" 
                  : "bg-white/15 text-white border-white/30 border-2 hover:bg-white/25"
              }`}
              onClick={() => setActiveTag(null)}
            >
              <Filter className="w-4 h-4 mr-1" /> 全部
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={activeTag === tag ? "default" : "outline"}
                className={`rounded-full shadow hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 ${
                  activeTag === tag 
                    ? "bg-blue-600 text-white border-none" 
                    : "bg-white/15 text-white border-white/30 border-2 hover:bg-white/25"
                }`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
        
        {/* 博客文章列表 */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/posts/${post.id}`}>
              <Card className="overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.03] hero-card border-white/10 h-full">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{post.date}</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 shine-text line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 
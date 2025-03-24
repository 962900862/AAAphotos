"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold mb-6">404 - 页面未找到</h1>
        <p className="text-xl mb-8">很抱歉，您访问的页面不存在</p>
        <Link href="/">
          <Button variant="default" className="gap-2" size="lg">
            <Home className="w-4 h-4" />
            返回首页
          </Button>
        </Link>
      </div>
    </div>
  );
} 
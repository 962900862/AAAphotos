import Link from 'next/link'

export default function Custom404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold mb-6">404 - 页面未找到</h1>
        <p className="text-xl mb-8">很抱歉，您访问的页面不存在</p>
        <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg transition-colors">
          返回首页
        </Link>
      </div>
    </div>
  )
} 
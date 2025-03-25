'use client';

// import { intl } from 'di18n-react';
import { intl } from '@/lib/intl-mock';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Calendar,
  Tag,
  Share2,
  Layout,
  ImageIcon,
  Check,
} from 'lucide-react';

export default function SocialMediaImageSizeGuidePost() {
  return (
    <main className="min-h-screen hero-gradient text-white">
      <div className="mx-auto max-w-[900px] px-4 py-12 md:py-20">
        {/* 返回博客 */}
        <div className="mb-8">
          <Link href="/blog">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 transition-all duration-300 rounded-full flex items-center gap-2 px-5 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {intl.t('返回博客')}
            </Button>
          </Link>
        </div>

        {/* 文章标题和信息 */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold shine-text mb-4">
            {intl.t('2024年社交媒体图片尺寸完全指南')}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>2024-03-10</span>
            </div>
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              <span>{intl.t('图片尺寸, 社交媒体, 视觉营销')}</span>
            </div>
          </div>
        </div>

        {/* 文章内容 */}
        <div className="prose prose-lg prose-invert max-w-none">
          <h2 className="text-2xl font-bold shine-text mb-4 flex items-center">
            <Layout className="mr-2" />
            {intl.t('为什么正确的图片尺寸至关重要？')}
          </h2>
          <p className="mb-6">
            {intl.t(
              '在社交媒体营销中，视觉内容是吸引用户注意力的关键因素。研究表明，包含图片的帖子比纯文本帖子获得的互动率高出650%。然而，不同平台对图片尺寸有不同的要求，使用不正确的尺寸可能导致图片被裁剪、拉伸或压缩，大大降低了视觉效果和专业度。'
            )}
          </p>
          <p className="mb-6">
            {intl.t(
              '这份2024年最新指南将帮助你掌握主流社交媒体平台的最佳图片尺寸，确保你的视觉内容在任何设备上都能完美展示。我们还会提供一些专业建议，帮助你创建高质量的图片内容。'
            )}
          </p>

          <div className="bg-white/10 p-6 rounded-lg mb-10">
            <h3 className="text-xl font-bold mb-4">{intl.t('指南使用提示')}</h3>
            <ul className="space-y-2">
              <li>
                {intl.t('• 本指南中的所有尺寸均以')}
                <strong>{intl.t('像素(px)')}</strong>
                {intl.t('为单位')}
              </li>
              <li>
                {intl.t('• 我们提供了每种图片类型的')}
                <strong>{intl.t('最佳尺寸')}</strong>
                {intl.t('和')}
                <strong>{intl.t('最小要求')}</strong>
              </li>
              <li>
                {intl.t('• 大多数平台建议使用')}
                <strong>{intl.t('JPG、PNG或GIF')}</strong>
                {intl.t('格式')}
              </li>
              <li>
                {intl.t('• 文件大小限制因平台而异，但通常建议保持在')}
                <strong>{intl.t('5MB以下')}</strong>
              </li>
              <li>
                {intl.t(
                  '• 社交媒体平台可能随时更新其图片尺寸要求，本指南基于2024年3月的最新标准'
                )}
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold shine-text mb-6 mt-10 flex items-center">
            <ImageIcon className="mr-2" />
            {intl.t('主要社交媒体平台图片尺寸详解')}
          </h2>

          {/* 微信 */}
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <img
                src="/images/platforms/wechat-icon.png"
                alt={intl.t('微信')}
                className="w-6 h-6 mr-2"
              />
              {intl.t('微信图片尺寸指南')}
            </h3>
            <p className="mb-4">
              {intl.t(
                '作为中国最流行的社交媒体平台，微信拥有超过12亿的月活跃用户。正确的图片尺寸对提高你的内容在微信上的表现至关重要。'
              )}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{intl.t('朋友圈封面图')}</h4>
                <p className="text-sm text-gray-300 mb-2">
                  {intl.t('这是用户浏览朋友圈时首先看到的图片')}
                </p>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>{intl.t('最佳尺寸：')}</strong>
                    {intl.t('1080 × 1920 像素')}
                  </li>
                  <li>
                    • <strong>{intl.t('宽高比：')}</strong>9:16
                  </li>
                  <li>
                    • <strong>{intl.t('文件格式：')}</strong>JPG, PNG
                  </li>
                  <li>
                    • <strong>{intl.t('注意：')}</strong>
                    {intl.t('不建议添加文字，可能会被头像遮挡')}
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{intl.t('朋友圈单图/多图')}</h4>
                <p className="text-sm text-gray-300 mb-2">
                  {intl.t('在朋友圈发布的照片')}
                </p>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>{intl.t('最佳尺寸：')}</strong>
                    {intl.t('1080 × 1080 像素（正方形）')}
                  </li>
                  <li>
                    • <strong>{intl.t('多图展示：')}</strong>
                    {intl.t('800 × 800 像素（缩略图）')}
                  </li>
                  <li>
                    • <strong>{intl.t('注意：')}</strong>
                    {intl.t('超过2160×2160像素的图片会被压缩')}
                  </li>
                  <li>
                    • <strong>{intl.t('优化建议：')}</strong>
                    {intl.t('使用三方工具控制压缩')}
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{intl.t('公众号封面图')}</h4>
                <p className="text-sm text-gray-300 mb-2">
                  {intl.t('公众号文章顶部的大图')}
                </p>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>{intl.t('最佳尺寸：')}</strong>
                    {intl.t('900 × 383 像素')}
                  </li>
                  <li>
                    • <strong>{intl.t('宽高比：')}</strong>900:383 (≈ 2.35:1)
                  </li>
                  <li>
                    • <strong>{intl.t('文件大小：')}</strong>
                    {intl.t('不超过2MB')}
                  </li>
                  <li>
                    • <strong>{intl.t('注意：')}</strong>
                    {intl.t('保持重要内容在中央区域')}
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{intl.t('公众号正文图片')}</h4>
                <p className="text-sm text-gray-300 mb-2">
                  {intl.t('公众号文章内插入的图片')}
                </p>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>{intl.t('最佳宽度：')}</strong>
                    {intl.t('750像素')}
                  </li>
                  <li>
                    • <strong>{intl.t('高度：')}</strong>
                    {intl.t('根据内容自适应')}
                  </li>
                  <li>
                    • <strong>{intl.t('文件大小：')}</strong>
                    {intl.t('不超过2MB')}
                  </li>
                  <li>
                    • <strong>{intl.t('注意：')}</strong>
                    {intl.t('过宽的图片会自动缩放至适合屏幕宽度')}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 小红书 */}
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <img
                src="/images/platforms/xiaohongshu-icon.png"
                alt={intl.t('小红书')}
                className="w-6 h-6 mr-2"
              />
              {intl.t('小红书图片尺寸指南')}
            </h3>
            <p className="mb-4">
              {intl.t(
                '小红书作为中国领先的生活方式分享平台，对图片质量和美感要求较高。高质量的视觉内容是在小红书获得好流量的关键。'
              )}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{intl.t('封面图')}</h4>
                <p className="text-sm text-gray-300 mb-2">
                  {intl.t('笔记的首图，用户浏览时最先看到')}
                </p>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>{intl.t('最佳尺寸：')}</strong>
                    {intl.t('1080 × 1440 像素')}
                  </li>
                  <li>
                    • <strong>{intl.t('宽高比：')}</strong>3:4
                  </li>
                  <li>
                    • <strong>{intl.t('文件格式：')}</strong>JPG, PNG
                  </li>
                  <li>
                    • <strong>{intl.t('注意：')}</strong>
                    {intl.t('顶部和底部约10%区域可能会被UI元素覆盖')}
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{intl.t('多图笔记')}</h4>
                <p className="text-sm text-gray-300 mb-2">
                  {intl.t('笔记中的多张图片')}
                </p>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>{intl.t('推荐尺寸：')}</strong>
                    {intl.t('1080 × 1440 像素')}
                  </li>
                  <li>
                    • <strong>{intl.t('最大数量：')}</strong>
                    {intl.t('9张图片')}
                  </li>
                  <li>
                    • <strong>{intl.t('注意：')}</strong>
                    {intl.t('保持所有图片使用相同的宽高比')}
                  </li>
                  <li>
                    • <strong>{intl.t('优化建议：')}</strong>
                    {intl.t('使用相同滤镜和风格，提升整体美感')}
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{intl.t('个人头像')}</h4>
                <p className="text-sm text-gray-300 mb-2">
                  {intl.t('个人资料的头像图片')}
                </p>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>{intl.t('显示尺寸：')}</strong>
                    {intl.t('240 × 240 像素')}
                  </li>
                  <li>
                    • <strong>{intl.t('上传尺寸：')}</strong>
                    {intl.t('600 × 600 像素（推荐）')}
                  </li>
                  <li>
                    • <strong>{intl.t('形状：')}</strong>
                    {intl.t('圆形（注意中心区域是关键）')}
                  </li>
                  <li>
                    • <strong>{intl.t('文件大小：')}</strong>
                    {intl.t('不超过5MB')}
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{intl.t('主页背景图')}</h4>
                <p className="text-sm text-gray-300 mb-2">
                  {intl.t('个人主页的顶部背景图片')}
                </p>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>{intl.t('最佳尺寸：')}</strong>
                    {intl.t('1125 × 400 像素')}
                  </li>
                  <li>
                    • <strong>{intl.t('宽高比：')}</strong>
                    {intl.t('约2.8:1')}
                  </li>
                  <li>
                    • <strong>{intl.t('注意：')}</strong>
                    {intl.t('中下部分会被个人信息覆盖')}
                  </li>
                  <li>
                    • <strong>{intl.t('优化建议：')}</strong>
                    {intl.t('选择有视觉冲击力的横向图片')}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 抖音 */}
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <img
                src="/images/platforms/douyin-icon.png"
                alt={intl.t('抖音')}
                className="w-6 h-6 mr-2"
              />
              {intl.t('抖音图片尺寸指南')}
            </h3>
            <p className="mb-4">
              {intl.t(
                '虽然抖音主要是视频平台，但图片在个人资料和图文内容上仍然扮演着重要角色。'
              )}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{intl.t('个人头像')}</h4>
                <p className="text-sm text-gray-300 mb-2">
                  {intl.t('个人资料显示的头像')}
                </p>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>{intl.t('推荐尺寸：')}</strong>
                    {intl.t('500 × 500 像素')}
                  </li>
                  <li>
                    • <strong>{intl.t('形状：')}</strong>
                    {intl.t('圆形（上传时为方形）')}
                  </li>
                  <li>
                    • <strong>{intl.t('文件格式：')}</strong>JPG, PNG
                  </li>
                  <li>
                    • <strong>{intl.t('注意：')}</strong>
                    {intl.t('确保脸部或主体在中心位置')}
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{intl.t('图文封面')}</h4>
                <p className="text-sm text-gray-300 mb-2">
                  {intl.t('图文内容的封面图片')}
                </p>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>{intl.t('最佳尺寸：')}</strong>
                    {intl.t('1080 × 1920 像素')}
                  </li>
                  <li>
                    • <strong>{intl.t('宽高比：')}</strong>9:16
                  </li>
                  <li>
                    • <strong>{intl.t('注意：')}</strong>
                    {intl.t('上传后会自动裁剪以适应平台尺寸')}
                  </li>
                  <li>
                    • <strong>{intl.t('优化建议：')}</strong>
                    {intl.t('将重要内容放在中央区域')}
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{intl.t('背景图')}</h4>
                <p className="text-sm text-gray-300 mb-2">
                  {intl.t('个人主页背景图片（仅特定账号支持）')}
                </p>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>{intl.t('最佳尺寸：')}</strong>
                    {intl.t('1125 × 2436 像素')}
                  </li>
                  <li>
                    • <strong>{intl.t('宽高比：')}</strong>
                    {intl.t('约9:19.5')}
                  </li>
                  <li>
                    • <strong>{intl.t('文件大小：')}</strong>
                    {intl.t('不超过5MB')}
                  </li>
                  <li>
                    • <strong>{intl.t('注意：')}</strong>
                    {intl.t('图片上部和下部会被UI元素覆盖')}
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-bold mb-2">{intl.t('图集内图片')}</h4>
                <p className="text-sm text-gray-300 mb-2">
                  {intl.t('图集模式中的单张图片')}
                </p>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>{intl.t('最佳尺寸：')}</strong>
                    {intl.t('1080 × 1920 像素')}
                  </li>
                  <li>
                    • <strong>{intl.t('宽高比：')}</strong>9:16
                  </li>
                  <li>
                    • <strong>{intl.t('最大数量：')}</strong>
                    {intl.t('35张')}
                  </li>
                  <li>
                    • <strong>{intl.t('优化建议：')}</strong>
                    {intl.t('保持一致的风格和色调')}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 国际平台 */}
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              {intl.t('国际社交媒体平台图片尺寸速查')}
            </h3>
            <p className="mb-4">
              {intl.t(
                '对于有国际业务的品牌和创作者，以下是主要国际平台的图片尺寸参考：'
              )}
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-bold mb-2 flex items-center">
                  <img
                    src="/images/platforms/instagram-icon.png"
                    alt="Instagram"
                    className="w-5 h-5 mr-2"
                  />
                  Instagram
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">{intl.t('Feed帖子')}</p>
                    <p>{intl.t('1080 × 1080像素 (1:1)')}</p>
                  </div>
                  <div>
                    <p className="font-medium">Stories</p>
                    <p>{intl.t('1080 × 1920像素 (9:16)')}</p>
                  </div>
                  <div>
                    <p className="font-medium">{intl.t('个人头像')}</p>
                    <p>{intl.t('320 × 320像素')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-bold mb-2 flex items-center">
                  <img
                    src="/images/platforms/facebook-icon.png"
                    alt="Facebook"
                    className="w-5 h-5 mr-2"
                  />
                  Facebook
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">{intl.t('个人动态图片')}</p>
                    <p>{intl.t('1200 × 630像素')}</p>
                  </div>
                  <div>
                    <p className="font-medium">{intl.t('封面照片')}</p>
                    <p>{intl.t('851 × 315像素')}</p>
                  </div>
                  <div>
                    <p className="font-medium">{intl.t('个人/专页头像')}</p>
                    <p>{intl.t('170 × 170像素')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-bold mb-2 flex items-center">
                  <img
                    src="/images/platforms/twitter-icon.png"
                    alt="Twitter"
                    className="w-5 h-5 mr-2"
                  />
                  Twitter
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">{intl.t('推文图片')}</p>
                    <p>{intl.t('1600 × 900像素 (16:9)')}</p>
                  </div>
                  <div>
                    <p className="font-medium">{intl.t('标题图片')}</p>
                    <p>{intl.t('1500 × 500像素')}</p>
                  </div>
                  <div>
                    <p className="font-medium">{intl.t('个人头像')}</p>
                    <p>{intl.t('400 × 400像素')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-bold mb-2 flex items-center">
                  <img
                    src="/images/platforms/linkedin-icon.png"
                    alt="LinkedIn"
                    className="w-5 h-5 mr-2"
                  />
                  LinkedIn
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">{intl.t('共享图片')}</p>
                    <p>{intl.t('1200 × 627像素')}</p>
                  </div>
                  <div>
                    <p className="font-medium">{intl.t('个人背景图')}</p>
                    <p>{intl.t('1584 × 396像素')}</p>
                  </div>
                  <div>
                    <p className="font-medium">{intl.t('公司页面徽标')}</p>
                    <p>{intl.t('300 × 300像素')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold shine-text mb-4 mt-10 flex items-center">
            <Check className="mr-2" />
            {intl.t('社交媒体图片优化专业建议')}
          </h2>

          <div className="space-y-6 mb-10">
            <div>
              <h3 className="text-xl font-bold mb-3">
                {intl.t('1. 优先考虑移动设备体验')}
              </h3>
              <p>
                {intl.t(
                  '超过90%的社交媒体用户通过移动设备访问平台。确保你的图片在小屏幕上看起来清晰且内容易读。避免使用过多细节或小字体，这些在移动设备上可能难以辨认。'
                )}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">
                {intl.t('2. 保持品牌一致性')}
              </h3>
              <p>
                {intl.t(
                  '在所有平台上使用一致的视觉风格、色彩方案和设计元素，这有助于增强品牌识别度。考虑创建图片模板，确保你的内容在不同平台上都具有一致的外观。'
                )}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">
                {intl.t('3. 了解安全区域')}
              </h3>
              <p>
                {intl.t(
                  '许多社交媒体平台会在图片的某些区域显示UI元素（如按钮、文字或头像）。将重要内容放在"安全区域"内，通常是中央70%的区域，避免重要信息被遮挡。'
                )}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">
                {intl.t('4. 优化图片文件大小')}
              </h3>
              <p>
                {intl.t(
                  '在保持视觉质量的同时，尽量减小文件大小以提高加载速度。使用适当的压缩工具如ImageOptim、TinyPNG或CodeFormer AI来优化图片，确保文件大小在平台限制之内。'
                )}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">
                {intl.t('5. 考虑图片文字限制')}
              </h3>
              <p>
                {intl.t(
                  '某些平台（如Facebook广告）限制图片中文字的数量。一般建议，图片中的文字应少于总图片面积的20%。如需添加大量文字，考虑在帖子描述或标题中添加。'
                )}
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold shine-text mb-4 mt-10">
            {intl.t('使用AI技术提升社交媒体图片质量')}
          </h2>
          <p className="mb-6">
            {intl.t(
              '当你已经按照正确尺寸准备好图片，但仍然需要提升图片质量时，AI图像增强技术可以发挥关键作用。我们的CodeFormer AI图像增强工具专为社交媒体内容创作者设计，可以：'
            )}
          </p>
          <ul className="mb-6 space-y-2">
            <li>
              {intl.t('• 提高图片清晰度和细节，让你的内容在信息流中脱颖而出')}
            </li>
            <li>{intl.t('• 消除压缩导致的图片质量下降问题')}</li>
            <li>{intl.t('• 修复面部细节，使人像更加生动自然')}</li>
            <li>{intl.t('• 在不失真的情况下放大小尺寸图片')}</li>
            <li>{intl.t('• 优化照片色彩和对比度，创造更吸引人的视觉效果')}</li>
          </ul>
          <p className="mb-10">
            {intl.t(
              '无需复杂的图像编辑经验，只需简单上传图片，选择增强选项，即可获得专业级的视觉效果。'
            )}
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              {intl.t('立即尝试我们的在线工具')}
            </Link>
            {intl.t('，让你的社交媒体图片质量提升到新高度。')}
          </p>

          <h2 className="text-2xl font-bold shine-text mb-4 mt-10">
            {intl.t('结论')}
          </h2>
          <p className="mb-6">
            {intl.t(
              '在社交媒体营销中，正确的图片尺寸是基础，高质量的视觉内容是关键。通过遵循这份2024年最新图片尺寸指南，你可以确保你的内容在各大平台上都能完美展示，吸引更多用户的关注和互动。'
            )}
          </p>
          <p className="mb-6">
            {intl.t(
              '记住，社交媒体平台会不断更新其图片规格要求，定期检查官方指南以获取最新信息。最终，成功的社交媒体视觉内容不仅取决于技术规格，还取决于创意、相关性和与目标受众的共鸣。'
            )}
          </p>
          <p className="mb-6">
            {intl.t(
              '希望这份指南能帮助你创建更加专业、吸引人的社交媒体视觉内容！如果你有任何问题，欢迎在评论区留言。'
            )}
          </p>

          {/* 分享按钮 */}
          <div className="mt-10 flex justify-center">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 transition-all duration-300 rounded-full flex items-center gap-2 px-5 py-2"
            >
              <Share2 className="w-4 h-4" />
              {intl.t('分享这篇文章')}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

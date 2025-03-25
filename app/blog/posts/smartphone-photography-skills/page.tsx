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
  Camera,
  Aperture,
  Image,
} from 'lucide-react';

export default function SmartphonePhotographySkillsPost() {
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
            {intl.t('手机摄影进阶：让你的照片秒变专业级')}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>2024-03-15</span>
            </div>
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              <span>{intl.t('手机摄影, 构图技巧, 后期处理')}</span>
            </div>
          </div>
        </div>

        {/* 文章内容 */}
        <div className="prose prose-lg prose-invert max-w-none">
          <h2 className="text-2xl font-bold shine-text mb-4 flex items-center">
            <Camera className="mr-2" />
            {intl.t('现代手机摄影的可能性')}
          </h2>
          <p className="mb-6">
            {intl.t(
              '智能手机摄影技术的飞速发展，正在不断缩小与专业相机之间的差距。如今的旗舰手机已经配备了多镜头系统、计算摄影技术和强大的图像处理能力，使得人人都能拍出令人惊艳的照片。事实上，许多知名摄影师和社交媒体创作者已经开始使用手机作为主要的创作工具。'
            )}
          </p>
          <p className="mb-6">
            {intl.t(
              '本文将分享7个专业摄影师常用的手机摄影技巧，帮助你无需昂贵设备也能拍出高质量照片，在社交媒体上脱颖而出。'
            )}
          </p>

          <h2 className="text-2xl font-bold shine-text mb-4 mt-10 flex items-center">
            <Aperture className="mr-2" />
            {intl.t('专业手机摄影的七大秘诀')}
          </h2>

          <h3 className="text-xl font-bold mb-4">
            {intl.t('1. 掌握光线，而非屈服于光线')}
          </h3>
          <p className="mb-6">
            {intl.t(
              '光线是摄影的灵魂，无论使用何种设备。与专业相机相比，手机感光元件较小，在弱光环境下表现受限。因此，掌握光线尤为重要。'
            )}
          </p>
          <div className="bg-white/10 p-4 rounded-lg mb-6">
            <h4 className="font-bold">{intl.t('实用技巧：')}</h4>
            <ul className="space-y-2 mt-2">
              <li>
                • <strong>{intl.t('黄金时段拍摄')}</strong>
                {intl.t('：日出后和日落前的1小时左右，光线柔和，颜色丰富')}
              </li>
              <li>
                • <strong>{intl.t('避开正午强光')}</strong>
                {intl.t('：会造成过度曝光和harsh阴影')}
              </li>
              <li>
                • <strong>{intl.t('背光拍摄')}</strong>
                {intl.t('：尝试将光源放在被摄主体后方，创造剪影效果')}
              </li>
              <li>
                • <strong>{intl.t('利用反光板')}</strong>
                {intl.t('：可以用白纸或铝箔纸制作简易反光板，填充阴影')}
              </li>
              <li>
                • <strong>{intl.t('窗户光')}</strong>
                {intl.t('：室内拍摄时靠近窗户，利用自然散射光')}
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-bold mb-4">
            {intl.t('2. 遵循构图原则，但不囿于规则')}
          </h3>
          <p className="mb-6">
            {intl.t(
              '即使是最简单的场景，通过巧妙的构图也能变得引人注目。手机屏幕的优势在于可以直观地预览和调整构图。'
            )}
          </p>
          <div className="bg-white/10 p-4 rounded-lg mb-6">
            <h4 className="font-bold">{intl.t('基础构图技巧：')}</h4>
            <ul className="space-y-2 mt-2">
              <li>
                • <strong>{intl.t('三分法则')}</strong>
                {intl.t('：将画面划分为九宫格，在线条交叉点放置主体')}
              </li>
              <li>
                • <strong>{intl.t('引导线')}</strong>
                {intl.t('：利用道路、栏杆等自然线条引导视线')}
              </li>
              <li>
                • <strong>{intl.t('对称与平衡')}</strong>
                {intl.t('：水面反射、建筑对称性能创造视觉平衡')}
              </li>
              <li>
                • <strong>{intl.t('框架构图')}</strong>
                {intl.t('：使用窗户、拱门等自然框架围绕主体')}
              </li>
              <li>
                • <strong>{intl.t('前景添加')}</strong>
                {intl.t('：增加前景元素增强画面深度感')}
              </li>
            </ul>
          </div>
          <p className="mb-6">
            {intl.t(
              '记住，构图规则是指南而非教条。了解这些原则后，可以有意识地打破规则，创造独特效果。'
            )}
          </p>

          <h3 className="text-xl font-bold mb-4">
            {intl.t('3. 锁定焦点和曝光，控制画面')}
          </h3>
          <p className="mb-6">
            {intl.t(
              '大多数用户只是简单地按下快门，让手机自动决定焦点和曝光。而专业摄影师则会完全控制这两个关键参数。'
            )}
          </p>
          <div className="bg-white/10 p-4 rounded-lg mb-6">
            <h4 className="font-bold">{intl.t('操作方法：')}</h4>
            <ol className="space-y-2 mt-2">
              <li>{intl.t('1. 长按屏幕上的主体位置锁定焦点')}</li>
              <li>
                {intl.t('2. 大多数手机会显示一个曝光滑块，上下滑动调整亮度')}
              </li>
              <li>{intl.t('3. 某些手机还支持分离对焦点和曝光点')}</li>
            </ol>
          </div>
          <p className="mb-6">
            {intl.t(
              '这个简单技巧能解决逆光拍摄、高对比度场景等常见问题，确保你的主体清晰且曝光合适。'
            )}
          </p>

          <h3 className="text-xl font-bold mb-4">
            {intl.t('4. 使用手机原生变焦功能，但有技巧地使用')}
          </h3>
          <p className="mb-6">
            {intl.t(
              '现代旗舰手机通常配备多个镜头，包括超广角、标准和长焦镜头。但需要知道，并非所有变焦都是光学变焦。'
            )}
          </p>
          <div className="bg-white/10 p-4 rounded-lg mb-6">
            <h4 className="font-bold">{intl.t('变焦使用指南：')}</h4>
            <ul className="space-y-2 mt-2">
              <li>
                • <strong>{intl.t('了解你的手机镜头配置')}</strong>
                {intl.t('：确认哪些焦段是光学变焦，哪些是数字变焦')}
              </li>
              <li>
                • <strong>{intl.t('优先使用光学变焦')}</strong>
                {intl.t('：如0.5x、1x、2x、3x等标注的变焦倍率')}
              </li>
              <li>
                • <strong>{intl.t('避免高倍数字变焦')}</strong>
                {intl.t('：超过光学变焦范围会导致画质下降')}
              </li>
              <li>
                • <strong>{intl.t('用脚步代替变焦')}</strong>
                {intl.t('：条件允许时，靠近被摄主体比使用数字变焦效果更好')}
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-bold mb-4">
            {intl.t('5. 探索专业模式，突破自动模式的限制')}
          </h3>
          <p className="mb-6">
            {intl.t(
              '大多数现代智能手机都提供专业/Pro模式，让用户可以手动调整拍摄参数，就像使用单反相机一样。'
            )}
          </p>
          <div className="bg-white/10 p-4 rounded-lg mb-6">
            <h4 className="font-bold">{intl.t('关键参数解析：')}</h4>
            <ul className="space-y-2 mt-2">
              <li>
                • <strong>ISO</strong>
                {intl.t(
                  '：控制感光度，低ISO（如100-400）噪点少但需要更多光线；高ISO可在暗处拍摄但会增加噪点'
                )}
              </li>
              <li>
                • <strong>{intl.t('快门速度')}</strong>
                {intl.t(
                  '：控制曝光时间，高速快门（如1/1000秒）可冻结动作，低速快门可捕捉光轨、流水效果'
                )}
              </li>
              <li>
                • <strong>{intl.t('白平衡')}</strong>
                {intl.t(
                  '：调整色温，确保白色物体在照片中显示为白色，不受环境光源影响'
                )}
              </li>
              <li>
                • <strong>{intl.t('RAW格式')}</strong>
                {intl.t('：保存未经处理的原始数据，后期调整空间更大')}
              </li>
            </ul>
          </div>
          <p className="mb-6">
            {intl.t(
              '初学者可以从调整单个参数开始，逐步熟悉各参数的效果和相互影响。'
            )}
          </p>

          <h3 className="text-xl font-bold mb-4">
            {intl.t('6. 专注于主体，简化背景')}
          </h3>
          <p className="mb-6">
            {intl.t(
              '专业照片往往有一个清晰的主题和简洁的背景。复杂杂乱的背景会分散注意力，弱化主体的影响力。'
            )}
          </p>
          <div className="bg-white/10 p-4 rounded-lg mb-6">
            <h4 className="font-bold">{intl.t('背景简化技巧：')}</h4>
            <ul className="space-y-2 mt-2">
              <li>
                • <strong>{intl.t('使用人像模式')}</strong>
                {intl.t('：创造背景虚化效果')}
              </li>
              <li>
                • <strong>{intl.t('寻找纯色背景')}</strong>
                {intl.t('：如蓝天、单色墙面')}
              </li>
              <li>
                • <strong>{intl.t('调整拍摄角度')}</strong>
                {intl.t('：换个位置可能会得到更干净的背景')}
              </li>
              <li>
                • <strong>{intl.t('靠近主体')}</strong>
                {intl.t('：减少主体与背景的视觉关联')}
              </li>
              <li>
                • <strong>{intl.t('利用长焦镜头')}</strong>
                {intl.t('：压缩透视，自然虚化背景')}
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-bold mb-4">
            {intl.t('7. 掌握后期编辑，提升照片品质')}
          </h3>
          <p className="mb-6">
            {intl.t(
              '即使是最好的照片也常常需要后期调整才能达到最佳效果。如今，手机上就有许多强大的编辑工具。'
            )}
          </p>
          <div className="bg-white/10 p-4 rounded-lg mb-6">
            <h4 className="font-bold">{intl.t('基础后期调整流程：')}</h4>
            <ol className="space-y-2 mt-2">
              <li>
                1. <strong>{intl.t('裁剪和调整水平')}</strong>
                {intl.t('：确保构图平衡、地平线水平')}
              </li>
              <li>
                2. <strong>{intl.t('调整曝光和对比度')}</strong>
                {intl.t('：确保画面不过曝也不欠曝')}
              </li>
              <li>
                3. <strong>{intl.t('调整亮部和暗部')}</strong>
                {intl.t('：恢复过暗区域的细节，降低过亮区域')}
              </li>
              <li>
                4. <strong>{intl.t('微调色温和色调')}</strong>
                {intl.t('：确保色彩真实或符合创意意图')}
              </li>
              <li>
                5. <strong>{intl.t('增加清晰度和结构')}</strong>
                {intl.t('：提升细节表现')}
              </li>
              <li>
                6. <strong>{intl.t('适当添加晕影')}</strong>
                {intl.t('：引导视线聚焦到主体')}
              </li>
              <li>
                7. <strong>{intl.t('考虑一些创意滤镜')}</strong>
                {intl.t('：根据场景和风格需要')}
              </li>
            </ol>
          </div>
          <p className="mb-6">
            {intl.t(
              '推荐的手机编辑应用包括：Adobe Lightroom Mobile、Snapseed、VSCO和手机自带的编辑工具。找到适合自己的后期风格，并保持一致性。'
            )}
          </p>

          <h2 className="text-2xl font-bold shine-text mb-4 mt-10 flex items-center">
            <Image className="mr-2" />
            {intl.t('提升照片质量的必备工具')}
          </h2>
          <p className="mb-6">
            {intl.t('除了技巧，一些辅助工具可以帮助你拍出更专业的照片：')}
          </p>
          <ul className="mb-6 space-y-2">
            <li>
              • <strong>{intl.t('便携式三脚架')}</strong>
              {intl.t('：稳定拍摄，尤其在弱光环境和长曝光时')}
            </li>
            <li>
              • <strong>{intl.t('外接镜头')}</strong>
              {intl.t('：如微距、鱼眼镜头，扩展手机拍摄能力')}
            </li>
            <li>
              • <strong>{intl.t('便携LED补光灯')}</strong>
              {intl.t('：弱光环境下的救星')}
            </li>
            <li>
              • <strong>{intl.t('遥控快门')}</strong>
              {intl.t('：避免按下快门时的抖动')}
            </li>
            <li>
              • <strong>{intl.t('手机云台')}</strong>
              {intl.t('：拍摄流畅视频的必备工具')}
            </li>
          </ul>

          <h2 className="text-2xl font-bold shine-text mb-4 mt-10">
            {intl.t('用AI技术提升照片质量')}
          </h2>
          <p className="mb-6">
            {intl.t(
              '当常规方法达到极限时，AI技术可以进一步提升照片质量。我们的CodeFormer AI技术专为照片增强设计，能有效解决以下问题：'
            )}
          </p>
          <ul className="mb-6 space-y-2">
            <li>{intl.t('• 提高低光照片的清晰度')}</li>
            <li>{intl.t('• 修复因高ISO引起的噪点')}</li>
            <li>{intl.t('• 增强细节和纹理')}</li>
            <li>{intl.t('• 智能锐化模糊区域')}</li>
            <li>{intl.t('• 提升照片整体分辨率')}</li>
          </ul>
          <p className="mb-6">
            {intl.t(
              '使用AI增强工具只需简单几步：上传照片，选择增强模式，等待处理完成后下载。这一技术特别适合那些因设备限制或拍摄条件导致质量不佳的照片。'
            )}
          </p>

          <h2 className="text-2xl font-bold shine-text mb-4 mt-10">
            {intl.t('结论：实践出真知')}
          </h2>
          <p className="mb-6">
            {intl.t(
              '手机摄影的魅力在于其便携性和即时性，随时随地都能捕捉精彩瞬间。掌握本文分享的技巧后，你的照片质量将迅速提升。但最重要的是持续实践和探索，找到适合自己的风格。'
            )}
          </p>
          <p className="mb-6">
            {intl.t(
              '记住，最好的相机永远是你随身携带的那一个。手机摄影的限制可以激发创意，而非限制创意。期待看到你使用这些技巧后拍摄的精彩照片！'
            )}
          </p>
          <p className="mb-6">
            {intl.t('如果你希望进一步提升照片质量，欢迎尝试我们的')}
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              {intl.t('CodeFormer AI图像增强技术')}
            </Link>
            {intl.t('，让你的手机照片焕发新生。')}
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

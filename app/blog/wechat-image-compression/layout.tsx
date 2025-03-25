import { serverIntl } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '揭秘微信朋友圈图片压缩机制及应对策略 | Social Photo',
  description: '深入分析微信朋友圈的图片压缩算法原理，并提供实用的高清图片发布技巧和工具推荐，帮助您突破微信的压缩限制。',
};

export default function WeChatImageCompressionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
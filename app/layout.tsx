import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Script from 'next/script';
import { metadata as pageMetadata } from './page-metadata';
import I18nProvider from './i18n/I18nProvider';
import LanguageSwitcher from './components/LanguageSwitcher';
import FooterWithTranslation from './components/FooterWithTranslation';

const inter = Inter({ subsets: ['latin'] });

// 合并基本元数据和特定页面元数据
export const metadata: Metadata = {
  ...pageMetadata,
  metadataBase: new URL('https://photochatpro.vercel.app'),
  authors: [{ name: 'Photo Chat Pro Team' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://photochatpro.vercel.app',
  },
  openGraph: {
    title: 'AI 图片增强工具 | 照片超清处理',
    description: '专业的AI图片增强工具，一键修复微信压缩失真，使用CodeFormer技术让您的照片展现完美画质。支持多种社交平台，免费使用。',
    url: 'https://photochatpro.vercel.app',
    siteName: 'Photo Chat Pro',
    images: [
      {
        url: 'https://tuchuang.org.cn/imgs/2025/03/22/89879711d95bbc5d.jpg',
        width: 1200,
        height: 630,
        alt: 'AI图片增强工具展示',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 图片增强工具 | 照片超清处理',
    description: '专业的AI图片增强工具，使用CodeFormer技术提升照片质量，支持微信、小红书等平台图片优化',
    images: ['https://tuchuang.org.cn/imgs/2025/03/22/89879711d95bbc5d.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-CTFFK2YZY9" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CTFFK2YZY9');
          `}
        </Script>
        <meta name="baidu-site-verification" content="codeva-ruHWtJSvnS" />
        <meta name="msvalidate.01" content="D27559B64E907A337CB7F3C0CF655EDB" />
        <meta name="bytedance-verification-code" content="CklYgsH5W4ONWXFxGBO3" />
      </head>
      <body className={inter.className}>
        <I18nProvider>
          <LanguageSwitcher />
          {children}
          <FooterWithTranslation />
        </I18nProvider>
      </body>
    </html>
  );
}
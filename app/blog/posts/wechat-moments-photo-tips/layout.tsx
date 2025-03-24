import type { Metadata } from 'next';
import { metadata as postMetadata } from './metadata';

export const metadata: Metadata = postMetadata;

export default function WechatMomentsPhotoTipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
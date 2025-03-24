import type { Metadata } from 'next';
import { metadata as blogMetadata } from './metadata';

export const metadata: Metadata = blogMetadata;

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
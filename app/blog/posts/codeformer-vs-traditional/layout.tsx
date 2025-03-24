import type { Metadata } from 'next';
import { metadata as postMetadata } from './metadata';

export const metadata: Metadata = postMetadata;

export default function CodeformerVsTraditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
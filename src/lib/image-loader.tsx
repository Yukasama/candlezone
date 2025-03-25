import { ImageLoaderProps } from 'next/image';

export const wsrvLoader = ({ quality, src, width }: ImageLoaderProps) => {
  const encodedSrc = encodeURIComponent(src);
  return `https://wsrv.nl/?url=${encodedSrc}&w=${String(width)}&q=${String(quality ?? 75)}`;
};

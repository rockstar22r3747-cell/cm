import { useState } from 'react';
import { Waves } from 'lucide-react';
import { STAY_IMAGES } from '../data/stays';
import type { ImageKey } from '../types';

interface ImageWithFallbackProps {
  imageKey: ImageKey;
  alt: string;
  className?: string;
}

export function ImageWithFallback({ imageKey, alt, className = '' }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);
  const src = STAY_IMAGES[imageKey];

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#181c1e] via-[#1c2022] to-[#0b0f10] text-[#8a9295] ${className}`}
        role="img"
        aria-label={alt}
      >
        <Waves className="h-7 w-7 text-[#a0cedf]/60 mb-2" strokeWidth={1.5} />
        <span className="text-xs font-medium text-[#c0c8cb] px-4 text-center line-clamp-1">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

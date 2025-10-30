'use client'

import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[Math.min(activeIndex, Math.max(0, images.length - 1))] ?? "/images/placeholder.jpg";

  return (
    <div className="w-full">
      <div className="aspect-square w-full overflow-hidden rounded border bg-gray-50">
        <img src={active} alt="Product image" className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`aspect-square overflow-hidden rounded border ${idx === activeIndex ? "ring-2 ring-primary" : ""}`}
            >
              <img src={src} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}



"use client"

import { ProductCard } from "./product-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./carousel";

export interface ProductSummary {
  id: string;
  name: string;
  price: number | string;
  slug: string;
  images: string[];
  stock: number;
}

interface ProductCarouselProps {
  products: ProductSummary[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  if (!products?.length) return null;
  return (
    <div className="relative">
      <Carousel opts={{ align: "start", slidesToScroll: 1 }}>
        <CarouselContent>
          {products.map(p => (
            <CarouselItem key={p.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
              <ProductCard
                id={p.id}
                name={p.name}
                price={typeof p.price === "string" ? p.price : Number(p.price)}
                slug={p.slug}
                images={p.images}
                stock={p.stock}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}



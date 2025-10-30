import { ProductCard } from "@/components/ui/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const banners = [
  "/images/banner 1.jpg",
  "/images/Banner 2.jpg",
  "/images/Banner 3.jpg",
];

async function getProducts() {
  const res = await fetch("/api/products", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const products = await getProducts();
  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Banner Carousel */}
      <section className="mb-8">
        <div className="relative">
          <Carousel>
            <CarouselContent>
              {banners.map((src, i) => (
                <CarouselItem key={i}>
                  <img
                    src={src}
                    alt={`Banner ${i + 1}`}
                    className="rounded-lg w-full max-h-56 object-cover shadow"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Latest Products */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Latest Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((p: any) => <ProductCard key={p.id} {...p} />)
          ) : (
            <div className="col-span-4 text-center text-gray-400">No products found.</div>
          )}
        </div>
      </section>
    </div>
  );
}

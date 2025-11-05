import { ProductCard } from "@/components/ui/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { PrismaClient } from "@prisma/client";

const banners = [
  "/images/banner 1.jpg",
  "/images/Banner 2.jpg",
  "/images/Banner 3.jpg",
];

export default async function HomePage() {
  const prisma = new PrismaClient();
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      name: true,
      price: true,
      slug: true,
      images: true,
      stock: true,
    },
  });

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Banner Carousel with extra margin on top */}
      <section className="mb-8 mt-8">
        <div className="relative">
          <Carousel>
            <CarouselContent>
              {banners.map((src, i) => (
                <CarouselItem key={i}>
                  <img
                    src={src}
                    alt={`Banner ${i + 1}`}
                    className="rounded-lg w-full max-h-80 h-80 object-cover shadow"
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

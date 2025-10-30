import { PrismaClient } from "@/lib/generated/prisma/client";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/ui/product-gallery";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import Link from "next/link";
import { ProductCarousel } from "@/components/ui/product-carousel";
import { auth } from "@/auth";
import { ProductPurchasePanel } from "@/components/ui/product-purchase-panel";

type tParams = Promise<{ slug: string }>;
interface PageProps {
  params: tParams;
}

export default async function Page(props: PageProps) {
  const { slug } = await props.params;
  const prisma = new PrismaClient();
  const session = await auth();

  const product = await prisma.product.findFirst({
    where: { slug, active: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      compareAtPrice: true,
      images: true,
      stock: true,
      categoryId: true,
    },
  });

  if (!product) return notFound();

  const primaryPrice = Number(product.price as unknown as number);
  const compareAt = product.compareAtPrice ? Number(product.compareAtPrice as unknown as number) : undefined;

  const [related, reviews] = await Promise.all([
    prisma.product.findMany({
      where: { active: true, categoryId: product.categoryId, NOT: { id: product.id } },
      take: 8,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, price: true, slug: true, images: true, stock: true },
    }),
    prisma.review.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, rating: true, title: true, content: true, verified: true, createdAt: true, user: { select: { name: true } } },
      take: 10,
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gallery */}
        <ProductGallery images={product.images && product.images.length > 0 ? product.images : ["/images/placeholder.jpg"]} />

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">{product.name}</h1>
          {/* Stars + count */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            {(() => {
              const count = reviews.length;
              const avg = count ? Math.round((reviews.reduce((a, r) => a + r.rating, 0) / count) * 2) / 2 : 0;
              const stars = [1,2,3,4,5].map(i => (i <= Math.floor(avg) ? '★' : '☆')).join('');
              return (
                <>
                  <span className="text-yellow-500">{stars}</span>
                  <span>({count} {count === 1 ? 'review' : 'reviews'})</span>
                </>
              );
            })()}
          </div>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-2xl font-bold text-primary">${primaryPrice.toFixed(2)}</span>
            {typeof compareAt === "number" && compareAt > primaryPrice && (
              <span className="text-muted-foreground line-through">${compareAt.toFixed(2)}</span>
            )}
          </div>
          <div className={`text-sm mb-4 ${product.stock > 0 ? "text-emerald-600" : "text-red-600"}`}>
            {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
          </div>
          {product.description && (
            <div className="prose max-w-none mb-4 text-sm text-muted-foreground whitespace-pre-line">
              {product.description}
            </div>
          )}
          {/* Quantity + Add to Cart (client component) */}
          <div className="mb-4">
            <ProductPurchasePanel
              productId={product.id}
              name={product.name}
              price={primaryPrice}
              slug={product.slug}
              image={(product.images && product.images[0]) || "/images/placeholder.jpg"}
              stock={product.stock}
            />
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Related products</h2>
            <Link href="/products" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <ProductCarousel products={related.map(r => ({ ...r, price: Number(r.price as unknown as number) }))} />
        </section>
      )}

      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Customer reviews</h2>
          {!session && (
            <Link href="/api/auth/signin" className="text-sm text-primary hover:underline">Please sign in to leave a review</Link>
          )}
        </div>
        {reviews.length === 0 ? (
          <div className="text-sm text-muted-foreground">No reviews yet.</div>
        ) : (
          <ul className="space-y-4">
            {reviews.map(rv => (
              <li key={rv.id} className="border rounded p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm">{rv.user?.name || "Anonymous"}</div>
                  <div className="text-xs text-muted-foreground">{new Date(rv.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="text-yellow-500 text-sm mb-1">{"★".repeat(rv.rating)}{"☆".repeat(Math.max(0, 5 - rv.rating))}</div>
                {rv.title && <div className="font-semibold text-sm mb-1">{rv.title}</div>}
                {rv.content && <p className="text-sm text-muted-foreground">{rv.content}</p>}
                {rv.verified && <div className="mt-2 text-xs text-emerald-600">Verified purchase</div>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}



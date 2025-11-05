import Link from "next/link";
import { ProductCard } from "@/components/ui/product-card";
import { SidebarFilters } from "@/components/ui/SidebarFilters";
import { Suspense } from "react";
import { PrismaClient } from "@prisma/client";

type SearchParams = {
  q?: string;
  category?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
};

function parseNumber(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function getOrderBy(sort?: string) {
  switch (sort) {
    case "price_asc":
      return { price: "asc" as const };
    case "price_desc":
      return { price: "desc" as const };
    case "name_asc":
      return { name: "asc" as const };
    case "name_desc":
      return { name: "desc" as const };
    default:
      return { createdAt: "desc" as const };
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const prisma = new PrismaClient();

  const q = (searchParams.q || "").trim();
  const categoryId = searchParams.category && searchParams.category !== "all" ? searchParams.category : undefined;
  const minPrice = parseNumber(searchParams.minPrice, 0);
  const maxPrice = parseNumber(searchParams.maxPrice, 1_000_000);
  const sort = searchParams.sort;
  const pageSize = 12;
  const page = Math.max(1, parseNumber(searchParams.page, 1));
  const skip = (page - 1) * pageSize;

  const where = {
    active: true,
    ...(categoryId ? { categoryId } : {}),
    price: { gte: minPrice, lte: maxPrice },
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  } as const;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: getOrderBy(sort),
      skip,
      take: pageSize,
      select: {
        id: true,
        name: true,
        price: true,
        slug: true,
        images: true,
        stock: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // helpers to build pagination/search URLs preserving filters
  const buildQuery = (overrides: Partial<SearchParams> = {}) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categoryId) params.set("category", categoryId);
    if (sort) params.set("sort", sort);
    if (minPrice) params.set("minPrice", String(minPrice));
    if (maxPrice && maxPrice !== 1_000_000) params.set("maxPrice", String(maxPrice));
    const nextPage = overrides.page ?? String(page);
    params.set("page", String(nextPage));
    return `/products?${params.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto flex gap-8 p-4">
      {/* Sidebar: Filters and Categories */}
      <aside className="hidden md:block w-64 flex-shrink-0">
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading filters…</div>}>
          <SidebarFilters />
        </Suspense>
      </aside>
      {/* Main product area */}
      <main className="flex-1 min-w-0">
        {/* Search bar as GET, preserving current filters via hidden inputs */}
        <form className="mb-6" action="/products" method="get">
          <input type="hidden" name="category" value={categoryId || "all"} />
          <input type="hidden" name="sort" value={sort || "default"} />
          <input type="hidden" name="minPrice" value={String(minPrice)} />
          <input type="hidden" name="maxPrice" value={String(maxPrice)} />
          <input type="hidden" name="page" value="1" />
          <input
            type="search"
            name="q"
            placeholder="Search..."
            defaultValue={q}
            className="border shadow px-4 py-2 rounded w-full max-w-md"
            autoComplete="off"
          />
        </form>
        {/* Product Grid */}
        <div className="mb-6">
          {products.length === 0 ? (
            <div className="text-sm text-muted-foreground">No products match your filters.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => (
                <ProductCard key={p.id} id={p.id} name={p.name} slug={p.slug} images={p.images} stock={p.stock} price={Number(p.price as unknown as number)} />
              ))}
            </div>
          )}
        </div>
        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
          <Link
            href={buildQuery({ page: String(Math.max(1, page - 1)) })}
            className={`px-4 py-2 rounded ${page <= 1 ? "pointer-events-none opacity-50 bg-muted" : "bg-muted hover:bg-muted/80"}`}
          >
            Previous
          </Link>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <Link
            href={buildQuery({ page: String(Math.min(totalPages, page + 1)) })}
            className={`px-4 py-2 rounded ${page >= totalPages ? "pointer-events-none opacity-50 bg-muted" : "bg-primary text-white hover:bg-primary/90"}`}
          >
            Next
          </Link>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";

interface ProductCardProps {
  id: string;
  name: string;
  price: number | string;
  slug: string;
  images: string[];
  stock: number;
}

export function ProductCard({ id, name, price, slug, images, stock }: ProductCardProps) {
  const imgSrc = images?.[0] || "/images/placeholder.jpg";
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col">
      <Link href={`/products/${slug}`} className="block mb-2">
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-32 object-cover rounded mb-2 bg-gray-100"
          loading="lazy"
        />
      </Link>
      <h3 className="font-semibold text-base mb-1 line-clamp-1">{name}</h3>
      <div className="text-primary font-bold text-lg mb-1">${typeof price === "string" ? price : price.toFixed(2)}</div>
      <div className="text-xs mb-2 text-gray-500">{stock > 0 ? `In stock (${stock})` : "Out of stock"}</div>
      <div className="mt-auto grid grid-cols-2 gap-2">
        <Link
          href={`/products/${slug}`}
          className="px-4 py-1 text-sm bg-muted text-foreground rounded hover:bg-muted/80 text-center transition"
        >
          View
        </Link>
        <AddToCartButton
          productId={id}
          name={name}
          price={typeof price === 'string' ? Number(price) || 0 : price}
          slug={slug}
          image={imgSrc}
          stock={stock}
          disabled={stock <= 0}
          className="px-4 py-1 text-sm"
        />
      </div>
    </div>
  );
}

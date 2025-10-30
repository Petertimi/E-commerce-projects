'use client'

import { Button } from "./button";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productId: string;
  name?: string;
  price?: number;
  slug?: string;
  image?: string;
  stock?: number;
  disabled?: boolean;
  quantity?: number;
  className?: string;
}

export function AddToCartButton({ productId, name, price, slug, image, stock = 9999, disabled, quantity = 1, className }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const router = useRouter();

  async function handleClick() {
    try {
      setLoading(true);
      await new Promise(r => setTimeout(r, 150));
      addItem({ productId, name: name ?? "", price: price ?? 0, slug: slug ?? "", image: image ?? "/images/placeholder.jpg", stock }, quantity);
      toast.success("Added to cart", {
        action: {
          label: "View cart",
          onClick: () => router.push("/cart"),
        },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" onClick={handleClick} disabled={disabled || loading} className={className}>
      {disabled ? "Unavailable" : loading ? "Adding..." : "Add to cart"}
    </Button>
  );
}



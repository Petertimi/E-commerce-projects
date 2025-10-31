'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type CartItem = {
  productId: string
  name: string
  price: number
  slug: string
  image: string
  stock: number
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        set(state => {
          const existing = state.items.find(i => i.productId === item.productId)
          if (existing) {
            const nextQty = Math.min(existing.stock, existing.quantity + quantity)
            return {
              items: state.items.map(i => i.productId === item.productId ? { ...i, quantity: nextQty } : i),
            }
          }
          return {
            items: [
              ...state.items,
              { productId: item.productId, name: item.name, price: item.price, slug: item.slug, image: item.image, stock: item.stock, quantity: Math.min(item.stock, quantity) },
            ],
          }
        })
      },
      removeItem: (productId) => set(state => ({ items: state.items.filter(i => i.productId !== productId) })),
      updateQuantity: (productId, quantity) => set(state => ({
        items: state.items.map(i => i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(i.stock, quantity)) } : i),
      })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
)

export function getCartTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, i) => sum + (typeof i.price === 'number' ? i.price : Number(i.price) || 0) * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  return { subtotal, count }
}



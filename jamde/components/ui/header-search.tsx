'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useCallback, useMemo, useState } from 'react'
import { Search } from 'lucide-react'

export default function HeaderSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQ = useMemo(() => searchParams.get('q') ?? '', [searchParams])
  const [query, setQuery] = useState(initialQ)

  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = query.trim()
    const url = q ? `/products?q=${encodeURIComponent(q)}` : '/products'
    router.push(url)
  }, [query, router])

  return (
    <form className="w-full max-w-xl relative" onSubmit={onSubmit} role="search" aria-label="Site">
      <input
        type="search"
        name="q"
        placeholder="Search products..."
        className="w-full border rounded-lg py-2 pl-10 pr-4 text-base focus:ring-2 focus:ring-primary shadow focus:outline-none bg-white"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
    </form>
  )
}



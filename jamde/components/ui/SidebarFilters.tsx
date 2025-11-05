'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Category {
  id: string
  name: string
}

export function ProductSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  )
  const [selectedSort, setSelectedSort] = useState(
    searchParams.get('sort') || 'default'
  )

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories', { cache: 'no-store' })
        const contentType = response.headers.get('content-type') || ''
        if (!response.ok || !contentType.includes('application/json')) {
          setCategories([])
          return
        }
        const data = await response.json()
        if (Array.isArray(data)) setCategories(data)
      } catch (error) {
        // swallow to avoid console JSON parse error disrupting UX
        setCategories([])
      }
    }

    fetchCategories()
  }, [])

  // Sync initial slider/category/sort with URL params so UI reflects current filters
  useEffect(() => {
    const min = Number(searchParams.get('minPrice'))
    const max = Number(searchParams.get('maxPrice'))
    const cat = searchParams.get('category') || 'all'
    const sort = searchParams.get('sort') || 'default'

    const nextRange: [number, number] = [
      Number.isFinite(min) ? Math.max(0, Math.floor(min)) : 0,
      Number.isFinite(max) ? Math.min(1000000, Math.ceil(max)) : 1000,
    ]
    setPriceRange(nextRange)
    setSelectedCategory(cat)
    setSelectedSort(sort)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (selectedCategory && selectedCategory !== 'all')
      params.set('category', selectedCategory)
    if (selectedSort && selectedSort !== 'default')
      params.set('sort', selectedSort)
    params.set('minPrice', priceRange[0].toString())
    params.set('maxPrice', priceRange[1].toString())

    router.push(`/products?${params.toString()}`)
  }

  const handleReset = () => {
    setSelectedCategory('all')
    setSelectedSort('default')
    setPriceRange([0, 1000])
    router.push('/products')
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Label>Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder='Select category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label>Price Range</Label>
        <div className='pt-2'>
          <Slider
            value={priceRange}
            min={0}
            max={1000}
            step={1}
            onValueChange={setPriceRange}
          />
        </div>
        <div className='flex justify-between text-sm'>
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div className='space-y-2'>
        <Label>Sort By</Label>
        <Select value={selectedSort} onValueChange={setSelectedSort}>
          <SelectTrigger>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='default'>Default</SelectItem>
            <SelectItem value='price_asc'>Price: Low to High</SelectItem>
            <SelectItem value='price_desc'>Price: High to Low</SelectItem>
            <SelectItem value='name_asc'>Name: A to Z</SelectItem>
            <SelectItem value='name_desc'>Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Button onClick={handleFilter} className='w-full'>
          Apply Filters
        </Button>
        <Button onClick={handleReset} variant='outline' className='w-full'>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}

export { ProductSidebar as SidebarFilters }

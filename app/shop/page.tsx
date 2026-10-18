"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Product, Category } from '../../lib/types';
import ProductCard from '../../components/ProductCard';
import { ProductCardSkeleton } from '../../components/ShimmerSkeleton';
import {
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Check,
  Search,
} from 'lucide-react';

const PRODUCTS_PER_PAGE = 8;

function ShopCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Load Categories & Subcategories
  useEffect(() => {
    async function loadCategories() {
      try {
        const { data } = await supabase
          .from('categories')
          .select('id, name, slug, parent_id, sort_order, is_active')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (data) {
          const parents = data.filter((c: Category) => !c.parent_id);
          const subs = data.filter((c: Category) => c.parent_id);
          setCategories(parents);
          setSubcategories(subs);
        }
      } catch (e) {
        console.warn('Error loading categories:', e);
      }
    }
    loadCategories();
  }, []);

  // Fetch Products with Strict Pagination of 8 items
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const from = (pageParam - 1) * PRODUCTS_PER_PAGE;
        const to = from + PRODUCTS_PER_PAGE - 1;

        let query = supabase
          .from('products')
          .select(
            'id, name, slug, sku, category_id, subcategory_id, description, price, compare_price, stock, weight_options, cover_image, is_featured, is_active, rating, review_count',
            { count: 'exact' }
          )
          .eq('is_active', true);

        // Filter by parent category
        if (selectedCategory) {
          const foundCat = categories.find((c) => c.slug === selectedCategory);
          if (foundCat) {
            query = query.eq('category_id', foundCat.id);
          }
        }

        // Filter by subcategory
        if (selectedSubcategory) {
          const foundSub = subcategories.find((c) => c.slug === selectedSubcategory);
          if (foundSub) {
            query = query.eq('subcategory_id', foundSub.id);
          }
        }

        // Search text
        if (searchParam) {
          query = query.ilike('name', `%${searchParam}%`);
        }

        // Sorting
        if (sortBy === 'price_asc') {
          query = query.order('price', { ascending: true });
        } else if (sortBy === 'price_desc') {
          query = query.order('price', { ascending: false });
        } else if (sortBy === 'rating') {
          query = query.order('rating', { ascending: false });
        } else {
          query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        }

        // Range pagination (8 per page)
        const { data, count, error } = await query.range(from, to);

        if (!error && data) {
          setProducts(data as Product[]);
          setTotalCount(count || 0);
        }
      } catch (err) {
        console.warn('Error querying products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, selectedSubcategory, searchParam, pageParam, sortBy, categories, subcategories]);

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE) || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/shop?${params.toString()}`);
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setSelectedSubcategory('');
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    router.push(`/shop?${params.toString()}`);
  };

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const relevantSubcategories = subcategories.filter(
    (s) => activeCategoryObj && s.parent_id === activeCategoryObj.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E1D6] gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF55]">
            Product Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B3826]">
            {activeCategoryObj ? activeCategoryObj.name : searchParam ? `Search: "${searchParam}"` : 'All Products'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing {products.length} of {totalCount} authentic food items (Page {pageParam} of {totalPages})
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center space-x-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2 bg-white border border-[#E5E1D6] rounded-xl text-xs font-bold text-[#0B3826] flex items-center space-x-1.5 shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF55]" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 bg-white border border-[#E5E1D6] rounded-xl px-3 py-1.5 shadow-xs text-xs">
            <span className="text-gray-500 font-medium hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-[#0B3826] focus:outline-hidden cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP SIDEBAR FILTERS (NO CRAMPED MAX-H-64 SCROLL TRAPS) */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-[#E5E1D6] shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D6]">
              <h3 className="font-bold text-sm text-[#0B3826] flex items-center space-x-2">
                <Filter className="w-4 h-4 text-[#D4AF55]" />
                <span>Departments</span>
              </h3>
              {selectedCategory && (
                <button
                  onClick={() => handleCategorySelect('')}
                  className="text-[11px] font-semibold text-red-600 hover:underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Parent Categories List */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleCategorySelect('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  !selectedCategory
                    ? 'bg-[#0B3826] text-white shadow-xs'
                    : 'text-gray-700 hover:bg-[#FAF6EC]'
                }`}
              >
                <span>All Departments</span>
                {!selectedCategory && <Check className="w-3.5 h-3.5" />}
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-[#0B3826] text-white shadow-xs'
                      : 'text-gray-700 hover:bg-[#FAF6EC]'
                  }`}
                >
                  <span>{cat.name}</span>
                  {selectedCategory === cat.slug && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>

            {/* Subcategories (if selected parent has subcategories) */}
            {relevantSubcategories.length > 0 && (
              <div className="pt-4 border-t border-[#E5E1D6]">
                <h4 className="font-bold text-xs text-[#D4AF55] uppercase tracking-wider mb-2">
                  Sub-Categories
                </h4>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategory('')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      !selectedSubcategory
                        ? 'bg-[#D4AF55] text-[#06291B]'
                        : 'text-gray-600 hover:bg-[#FAF6EC]'
                    }`}
                  >
                    All Subcategories
                  </button>
                  {relevantSubcategories.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubcategory(sub.slug)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        selectedSubcategory === sub.slug
                          ? 'bg-[#D4AF55] text-[#06291B]'
                          : 'text-gray-600 hover:bg-[#FAF6EC]'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* PRODUCTS GRID (STRICT 8 ITEMS PER PAGE) */}
        <main className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E1D6] p-8 space-y-4">
              <Search className="w-12 h-12 mx-auto text-gray-300" />
              <h3 className="text-lg font-bold text-[#0B3826]">No products found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No items match your filter selection. Try selecting a different category or clearing search parameters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedSubcategory('');
                  router.push('/shop');
                }}
                className="px-5 py-2.5 bg-[#0B3826] text-white text-xs font-bold rounded-xl hover:bg-[#18583A] transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* STRICT PAGINATION (PAGE 1, 2, 3...) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6 border-t border-[#E5E1D6]">
              {/* Prev Button */}
              <button
                onClick={() => handlePageChange(pageParam - 1)}
                disabled={pageParam <= 1}
                className="p-2 rounded-xl border border-[#E5E1D6] bg-white text-gray-700 hover:bg-[#FAF6EC] disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      pageParam === pageNum
                        ? 'bg-[#0B3826] text-white shadow-md'
                        : 'bg-white text-gray-700 border border-[#E5E1D6] hover:bg-[#FAF6EC]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(pageParam + 1)}
                disabled={pageParam >= totalPages}
                className="p-2 rounded-xl border border-[#E5E1D6] bg-white text-gray-700 hover:bg-[#FAF6EC] disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTER MODAL (WITH DONE BUTTON — NO PREMATURE CLOSING) */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[#E5E1D6] flex justify-between items-center bg-[#FAF6EC]">
              <h3 className="font-bold text-base text-[#0B3826] flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF55]" />
                <span>Filter Categories</span>
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Departments
              </span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleCategorySelect('')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex justify-between items-center ${
                    !selectedCategory ? 'bg-[#0B3826] text-white' : 'bg-[#FAF6EC] text-gray-800'
                  }`}
                >
                  <span>All Categories</span>
                  {!selectedCategory && <Check className="w-4 h-4" />}
                </button>

                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCategorySelect(c.slug)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex justify-between items-center ${
                      selectedCategory === c.slug ? 'bg-[#0B3826] text-white' : 'bg-[#FAF6EC] text-gray-800'
                    }`}
                  >
                    <span>{c.name}</span>
                    {selectedCategory === c.slug && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer with "Done" action (Only closes when user taps Done!) */}
            <div className="p-4 border-t border-[#E5E1D6] bg-gray-50">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-[#0B3826] hover:bg-[#18583A] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Done ({totalCount} Products)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopCatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center">Loading catalog...</div>}>
      <ShopCatalogContent />
    </Suspense>
  );
}

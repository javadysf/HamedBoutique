"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  discount?: number;
  description?: string;
  inventory?: any[];
}

const sortOptions = [
  { value: "default", label: "پیشفرض" },
  { value: "price-asc", label: "ارزانترین" },
  { value: "price-desc", label: "گرانترین" },
  { value: "newest", label: "جدیدترین" },
  { value: "title-asc", label: "الفبایی (الف تا ی)" },
  { value: "title-desc", label: "الفبایی (ی تا الف)" },
];

const categories = [
  'پوشاک مردانه',
  'پوشاک زنانه', 
  'کفش',
  'اکسسوری',
  'کیف و کوله',
  'عطر و ادکلن',
  'ساعت',
  'جواهرات'
];

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sort, setSort] = useState<string>("default");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...products];
    
    if (searchTerm) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title, "fa"));
        break;
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title, "fa"));
        break;
      default:
        break;
    }
    setFiltered(result);
  }, [products, selectedCategory, sort, searchTerm]);

  const getTotalInventory = (inventory: any) => {
    if (!inventory) return 0;
    
    let parsedInventory = inventory;
    
    // اگر inventory یک string است، آن را پارس کن
    if (typeof inventory === 'string') {
      try {
        parsedInventory = JSON.parse(inventory);
      } catch (e) {
        return 0;
      }
    }
    
    // اگر array نیست، 0 برگردان
    if (!Array.isArray(parsedInventory)) return 0;
    
    // مجموع تعداد همه آیتمها را محاسبه کن
    return parsedInventory.reduce((total, item) => {
      return total + (Number(item.quantity) || 0);
    }, 0);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setSort("default");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 flex items-center space-x-4 space-x-reverse">
          <div className="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-gray-700">در حال بارگذاری محصولات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
            <div className="flex items-center space-x-4 space-x-reverse mb-4 lg:mb-0">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  فروشگاه محصولات
                </h1>
                <p className="text-gray-600 mt-1">کیفیت برتر، انتخاب هوشمندانه ({products.length} محصول)</p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6 lg:space-x-reverse">
              {/* Search */}
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="جستجو در محصولات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/70 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                  />
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full lg:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full lg:w-48 px-4 py-3 bg-white/70 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">همه دستهها</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="w-full lg:w-auto">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full lg:w-48 px-4 py-3 bg-white/70 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white/50 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Results and Clear Filters */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <span className="text-gray-600 font-medium">{filtered.length} محصول یافت شد</span>
              {(selectedCategory !== "all" || searchTerm || sort !== "default") && (
                <button
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  پاک کردن فیلترها
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Display */}
        {filtered.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {searchTerm || selectedCategory !== "all" ? 'محصولی یافت نشد' : 'هیچ محصولی وجود ندارد'}
            </h3>
            <p className="text-gray-600 mb-8">
              {searchTerm || selectedCategory !== "all" 
                ? 'فیلترهای جستجو را تغییر دهید'
                : 'محصولات به زودی اضافه خواهند شد'
              }
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <button 
                onClick={clearFilters}
                className="inline-flex items-center bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <div key={product.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden hover:shadow-xl transition-all duration-300 group h-[480px] flex flex-col">
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
                  {product.image ? (
                    <Image 
                      src={product.image} 
                      alt={product.title} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Discount Badge */}
                  {product.discount && product.discount > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      {product.discount}% تخفیف
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Title - Fixed Height */}
                  <div className="h-14 mb-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{product.title}</h3>
                  </div>

                  {/* Description - Fixed Height */}
                  <div className="h-10 mb-4">
                    {product.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Price and Category - Fixed Height */}
                  <div className="flex items-center justify-between mb-4 h-16">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-gray-900">
                        {product.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">تومان</span>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {product.category && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {product.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Inventory and Actions - Fixed at Bottom */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      موجودی: {getTotalInventory(product.inventory)} عدد
                    </div>
                    
                    <Link 
                      href={`/products/${product.id}`}
                      className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium text-sm flex-shrink-0"
                    >
                      مشاهده
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300">
                  <tr>
                    <th className="text-right px-6 py-4 text-sm font-bold text-gray-900">محصول</th>
                    <th className="text-right px-6 py-4 text-sm font-bold text-gray-900">قیمت</th>
                    <th className="text-right px-6 py-4 text-sm font-bold text-gray-900">تخفیف</th>
                    <th className="text-right px-6 py-4 text-sm font-bold text-gray-900">دستهبندی</th>
                    <th className="text-right px-6 py-4 text-sm font-bold text-gray-900">موجودی</th>
                    <th className="text-center px-6 py-4 text-sm font-bold text-gray-900">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden ml-4 flex-shrink-0">
                            {product.image ? (
                              <Image 
                                src={product.image} 
                                alt={product.title} 
                                width={64} 
                                height={64} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 mb-1">{product.title}</div>
                            {product.description && (
                              <div className="text-sm text-gray-500 max-w-xs line-clamp-2">
                                {product.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-gray-900">
                          {product.price.toLocaleString()} تومان
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product.discount && product.discount > 0 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                            {product.discount}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {product.category ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {product.category}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <svg className="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          {getTotalInventory(product.inventory)} عدد
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link 
                          href={`/products/${product.id}`} 
                          className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium text-sm"
                        >
                          مشاهده جزئیات
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
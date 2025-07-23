"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Loading } from "@/components/common";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: { rate: number; count: number };
}

const sortOptions = [
  { value: "default", label: "پیش‌فرض" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "rate-desc", label: "بالاترین امتیاز" },
  { value: "rate-asc", label: "پایین‌ترین امتیاز" },
  { value: "title-asc", label: "مرتب‌سازی الفبایی (الف تا ی)" },
  { value: "title-desc", label: "مرتب‌سازی الفبایی (ی تا الف)" },
];

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sort, setSort] = useState<string>("default");

  useEffect(() => {
    setLoading(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setFiltered(data);
        setLoading(false);
      });
    // اگر دسته‌بندی‌ها را هم از دیتابیس می‌خواهید، اینجا اضافه کنید
  }, []);

  useEffect(() => {
    let result = [...products];
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rate-desc":
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "rate-asc":
        result.sort((a, b) => a.rating.rate - b.rating.rate);
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
  }, [products, selectedCategory, sort]);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-8 text-primary">محصولات بوتیک</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="flex gap-2 items-center">
          <label htmlFor="category" className="font-bold text-secondary">دسته‌بندی:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">همه</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <label htmlFor="sort" className="font-bold text-secondary">مرتب‌سازی:</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <Loading size="large" text="در حال بارگذاری محصولات..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-red-600">محصولی یافت نشد.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              id={String(product.id)}
              name={product.title}
              price={product.price}
              image={product.image}
              category={product.category}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default ProductsPage; 
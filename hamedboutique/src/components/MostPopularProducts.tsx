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
  discount?: number;
  description?: string;
  inventory?: any[];
}

const MostPopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        // محبوبترینها: محصولات با تخفیف یا جدیدترین محصولات
        const sorted = [...data]
          .sort((a, b) => {
            // اولویت با محصولات تخفیف دار
            if (a.discount && !b.discount) return -1;
            if (!a.discount && b.discount) return 1;
            // سپس بر اساس ID (جدیدترین)
            return b.id - a.id;
          });
        setProducts(sorted.slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="w-full max-w-6xl mb-8 sm:mb-12 px-4 mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4 sm:mb-6 text-center">محبوبترین محصولات</h2>
      {loading ? (
        <Loading size="medium" text="در حال بارگذاری محصولات محبوب..." />
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          محصولی برای نمایش وجود ندارد
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {products.map((product) => (
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
    </section>
  );
};

export default MostPopularProducts;
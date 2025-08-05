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

const MostPopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        // محبوب‌ترین‌ها: بالاترین امتیاز
        const sorted = [...data].sort((a, b) => b.rating.rate - a.rating.rate);
        setProducts(sorted.slice(0, 3));
        setLoading(false);
      });
  }, []);

  return (
    <section className="w-full max-w-6xl mb-8 sm:mb-12 px-4 mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4 sm:mb-6 text-center">محبوب‌ترین محصولات</h2>
      {loading ? (
        <Loading size="medium" text="در حال بارگذاری محصولات محبوب..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
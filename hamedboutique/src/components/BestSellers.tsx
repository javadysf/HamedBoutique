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

const BestSellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        // پرفروش‌ترین‌ها: بیشترین تعداد رای
        const sorted = [...data].sort((a, b) => b.rating.count - a.rating.count);
        setProducts(sorted.slice(0, 3));
        setLoading(false);
      });
  }, []);

  return (
    <section className="w-full max-w-6xl mb-12 px-4">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">پرفروش‌ترین محصولات</h2>
      {loading ? (
        <Loading size="medium" text="در حال بارگذاری محصولات پرفروش..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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

export default BestSellers; 
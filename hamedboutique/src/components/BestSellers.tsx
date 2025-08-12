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

const BestSellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getTotalInventory = (inventory: any) => {
    if (!inventory) return 0;
    
    let parsedInventory = inventory;
    
    if (typeof inventory === 'string') {
      try {
        parsedInventory = JSON.parse(inventory);
      } catch (e) {
        return 0;
      }
    }
    
    if (!Array.isArray(parsedInventory)) return 0;
    
    return parsedInventory.reduce((total, item) => {
      return total + (Number(item.quantity) || 0);
    }, 0);
  };

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        // پرفروشترینها: محصولات با بیشترین موجودی (فرض میکنیم موجودی کم = فروش زیاد)
        const sorted = [...data]
          .filter(product => getTotalInventory(product.inventory) > 0) // فقط محصولات موجود
          .sort((a, b) => {
            const inventoryA = getTotalInventory(a.inventory);
            const inventoryB = getTotalInventory(b.inventory);
            // محصولات با موجودی کمتر = پرفروشتر
            return inventoryA - inventoryB;
          });
        setProducts(sorted.slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="w-full max-w-6xl mb-8 sm:mb-12 px-4 mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4 sm:mb-6 text-center">پرفروشترین محصولات</h2>
      {loading ? (
        <Loading size="medium" text="در حال بارگذاری محصولات پرفروش..." />
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

export default BestSellers;
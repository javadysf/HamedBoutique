import React from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import HeroSection from "@/components/HeroSection";
import MostPopularProducts from "@/components/MostPopularProducts";
import BestSellers from "@/components/BestSellers";
import { Divider } from "@/components/common";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-100 text-gray-700 py-0 px-0">
      <HeroSection />
      <MostPopularProducts />
      <Divider />
      <BestSellers />
    </main>
  );
}

"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image, category }) => {
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(addToCart({
      id: parseInt(id),
      title: name,
      price,
      image,
      category
    }));
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="relative overflow-hidden group h-56">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative h-full w-full">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-contain transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            priority
          />
        </div>
        {category && (
          <span className="absolute top-3 right-3 bg-navy-900/80 text-white text-xs px-2 py-1 rounded-full z-20">
            {category}
          </span>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2">{name}</h2>
          <div className="flex items-center justify-between mb-4">
            <p className="text-navy-700 font-extrabold text-lg">
              {price.toLocaleString()} تومان
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Link
            href={`/products/${id}`}
            className="flex-1 inline-flex justify-center items-center bg-gray-400 transition-colors text-white rounded-xl px-4 py-3 text-center hover:bg-blue-700 transition-all duration-300 font-bold text-sm shadow-md"
          >
            <span className="text-white text-base">مشاهده جزئیات</span>
          </Link>
          <motion.button
            onClick={handleAddToCart}
            className="bg-gray-100 text-gray-800 rounded-xl px-4 py-3 hover:bg-gray-800 hover:text-white transition-all duration-300 font-bold text-sm flex items-center justify-center shadow-md"
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
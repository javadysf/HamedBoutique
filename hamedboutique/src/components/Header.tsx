"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser, selectUserLoading, logout, setToken, setUser, setLoading } from "@/store/slices/userSlice";
import { selectTotalItems } from "@/store/slices/cartSlice";
import basket from "../../public/assets/pics/Basket.png"
import Image from "next/image";
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Logo from "../../public/assets/pics/logo.png"

const navLinks = [
  { href: "/", label: "خانه" },
  { href: "/products", label: "محصولات" },
  { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "تماس با ما" },
];

const Header = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectUserLoading);
  const totalItems = useAppSelector(selectTotalItems);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    // Check for existing token on app load
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      dispatch(setToken(storedToken));
      fetchCurrentUser(storedToken);
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchCurrentUser = async (userToken: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        dispatch(setUser(userData));
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('token');
        dispatch(logout());
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
  };

  return (
    <header className="w-full bg-white shadow-md transition-colors duration-500 sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-2 px-4">
        <div className="flex items-center gap-8 md:gap-16">
          <div className="text-2xl font-extrabold text-gray-800 drop-shadow-sm tracking-tight select-none">
             <Image src={Logo} alt="logo" width={64} height={64} className="inline-block ml-2" />
             حامد بوتیک
          </div>
          <ul className="hidden md:flex gap-1 sm:gap-4 font-normal text-xl">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative px-3 py-2 rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 active:scale-95"
                >
                  <span className="transition-colors duration-200">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cart and Authentication Section */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative text-gray-700 hover:text-gray-900 transition-colors p-2 bg-gray-100 rounded-full"
          >
            <Image width={28} height={28} src={basket} alt="basket" className="min-w-[28px]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {loading ? (
            <div className="text-gray-600 text-sm flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              در حال بارگذاری...
            </div>
          ) : user ? (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full p-1 pr-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 border border-gray-300">
                  {user.profileImage ? (
                    <Image 
                      src={user.profileImage} 
                      alt="پروفایل کاربر" 
                      width={32} 
                      height={32} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : 
                       user.username ? user.username.charAt(0).toUpperCase() : 
                       user.email ? user.email.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
                <span className="text-gray-800 text-sm font-medium hidden sm:block">
                  {user.name || user.username || user.email || "کاربر"}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Menu.Button>
              
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 mt-2 w-48 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          پروفایل من
                        </Link>
                      )}
                    </Menu.Item>
                    
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/orders"
                          className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          سفارش‌های من
                        </Link>
                      )}
                    </Menu.Item>
                    
                    {user.isAdmin && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/admin"
                            className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            پنل مدیریت
                          </Link>
                        )}
                      </Menu.Item>
                    )}
                  </div>
                  
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-600`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          خروج از حساب
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth"
                className="bg-gradient-to-l border border-gray-500 from-gray-400 via-gray-100 to-white text-black  hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm"
              >
                ورود
              </Link>
              <Link
                href="/auth?mode=register"
                className="hidden sm:block bg-transparent border border-gray-500 text-black bg-gray-100 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                ثبت‌نام
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header; 
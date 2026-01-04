'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };
    const userToken = getCookie('user_token');
    const adminToken = getCookie('admin_token');
    const name = getCookie('user_name');
    setUserLoggedIn(!!userToken);
    setAdminLoggedIn(!!adminToken);
    setUserName(name ? decodeURIComponent(name) : null);
  }, []);

  const handleUserLogout = () => {
    document.cookie = 'user_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/';
  };

  const handleAdminLogout = () => {
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/';
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full">
          AVB
        </div>
        <span className="font-bold text-xl tracking-wide">CABS</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
        <Link href="#services" className="hover:text-black">Services</Link>
        <Link href="#why-us" className="hover:text-black">Why Us</Link>
        <Link href="#reviews" className="hover:text-black">Reviews</Link>
      </div>

      <div className="flex items-center gap-4">
        {!userLoggedIn && !adminLoggedIn && (
          <>
            <Link href="/admin/login" className="text-sm font-medium text-gray-700 hover:text-black">
              Admin
            </Link>
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black">
              Login
            </Link>
            <Link href="/signup" className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
              Sign Up
            </Link>
          </>
        )}

        {userLoggedIn && !adminLoggedIn && (
          <>
            <span className="text-sm font-medium text-gray-700">Hello, {userName || 'User'}</span>
            <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-black">
              My Dashboard
            </Link>
            <button onClick={handleUserLogout} className="text-sm font-medium text-red-600 hover:text-red-800">
              Logout
            </button>
          </>
        )}

        {adminLoggedIn && !userLoggedIn && (
          <>
            <Link href="/admin/dashboard" className="text-sm font-medium text-gray-700 hover:text-black">
              Admin Dashboard
            </Link>
            <button onClick={handleAdminLogout} className="text-sm font-medium text-red-600 hover:text-red-800">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

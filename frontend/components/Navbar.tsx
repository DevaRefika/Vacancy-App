"use client";

import Link from "next/link";
import { myAppHook } from "@/context/AppProvider";

const Navbar = () => {
  const { authToken, user, logout } = myAppHook(); 
  const isLoggedIn = !!authToken;

  return (
    <nav className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-8">
        <Link className="Navbar-brand no-underline" href="/">
          <img 
            src="https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/commons/new-ui-logo.png" 
            alt="Dicoding Logo" 
            className="h-8" 
          />
        </Link>
        
        <div className="flex space-x-6 text-sm font-medium">
          <Link href="/" className="text-gray-500 hover:text-black transition py-1 no-underline">
            Lowongan Kerja
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard" className="text-gray-500 hover:text-black transition py-1 no-underline">
              Dashboard
            </Link>
          )}
        </div>
      </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
          <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-gray-800 capitalize">
          {user?.name || "User"}
          </span>
          <button 
          onClick={logout} 
          className="text-sm font-medium text-red-600 hover:text-red-700 transition border-none bg-transparent cursor-pointer"
          >
          Logout
          </button>

      <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 overflow-hidden shadow-sm">
        <img 
          src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
      </div>  
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <Link 
        href="/auth" 
        className="bg-[#2d3e50] text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition no-underline"
      >
        Masuk
      </Link>
    </div>
  )}
</div>
    </nav>
  );
};

export default Navbar;
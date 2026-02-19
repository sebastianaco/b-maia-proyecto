"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
  excerpt: string;
  image: string | null;
}

export default function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/categories/");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error", error);
      }
    }
    fetchCategories();

    const storedUser = localStorage.getItem("username");
    if (storedUser) setUser(storedUser);

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    // Eliminamos localStorage de favoritos por limpieza (opcional)
    localStorage.removeItem("favorites");
    setUser(null);
    window.location.href = "/"; 
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-yellow-50 text-gray-900 shadow-md sticky top-0 z-50 border-b-4 border-yellow-600">
      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <div className="w-full px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center shrink-0 z-50" onClick={closeMenu}>
            <img 
                src="/logo-maia.png" 
                alt="Logo MaiA" 
                className="object-contain hover:scale-105 transition-transform duration-300" 
                style={{ height: '40px', width: 'auto' }}
            />
          </Link>

          {/* MENÚ CENTRAL */}
          <div className="hidden md:flex items-center justify-center gap-5 overflow-x-auto no-scrollbar flex-1 px-4">
            <Link 
                href="/" 
                className={`font-bold uppercase text-xs tracking-wide hover:text-yellow-600 transition-colors shrink-0 ${pathname === '/' ? 'text-yellow-700 underline decoration-2 underline-offset-4' : 'text-gray-700'}`}
            >
              INICIO
            </Link>

            {categories.map((cat) => (
                <Link 
                  key={cat.id}
                  href={cat.name.toLowerCase().includes('noticias') ? '/noticias' : `/categoria/${cat.slug}`}
                  className={`font-bold uppercase text-xs tracking-wide hover:text-yellow-600 transition-colors whitespace-nowrap shrink-0 ${pathname.includes(cat.slug) ? 'text-yellow-700' : 'text-gray-700'}`}
                >
                    {cat.name}
                </Link>
            ))}
          </div>

          {/* DERECHA: USUARIO / LOGIN */}
          <div className="hidden md:flex shrink-0 items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-full px-3 py-1 hover:shadow-md transition-all"
                >
                  <span className="text-xs font-bold text-yellow-800">
                    👋 Hola, {user}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-yellow-700 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-yellow-200 overflow-hidden z-50">
                    <div className="p-1">
                      {/* SOLO PERFIL, SIN FAVORITOS */}
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 rounded font-medium" onClick={closeMenu}>👤 Mi Perfil</Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded font-bold">🚪 Salir</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                  href="/login" 
                  className="bg-yellow-600 text-white px-4 py-1.5 rounded-full font-bold text-xs hover:bg-yellow-700 transition-colors shadow-md flex items-center gap-2 uppercase"
              >
                  <span>👤</span> <span className="hidden lg:inline">Ingresar</span>
              </Link>
            )}
          </div>

          {/* HAMBURGUESA MÓVIL */}
          <button 
            className="md:hidden text-gray-700 hover:text-yellow-700 focus:outline-none z-50 ml-auto"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <span className="text-2xl font-bold">✕</span> : <span className="text-2xl font-bold">☰</span>}
          </button>

        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      <div className={`md:hidden bg-yellow-50 absolute top-16 left-0 w-full shadow-lg transition-all duration-300 ease-in-out z-40 border-b-4 border-yellow-600 ${isOpen ? 'max-h-screen opacity-100 py-6' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="flex flex-col space-y-4 px-6">
            <Link href="/" className="text-sm font-bold text-gray-800 hover:text-yellow-600 border-b border-yellow-200 pb-2 uppercase" onClick={closeMenu}>INICIO</Link>
            {categories.map((cat) => (
                <Link key={cat.id} href={cat.name.toLowerCase().includes('noticias') ? '/noticias' : `/categoria/${cat.slug}`} className="block text-gray-700 font-semibold hover:text-yellow-700 py-1 uppercase text-xs" onClick={closeMenu}>{cat.name}</Link>
            ))}
            {user ? (
              <div className="pt-4 border-t border-yellow-200 flex flex-col gap-2">
                <span className="text-sm font-bold text-yellow-800">Usuario: {user}</span>
                {/* SOLO PERFIL, SIN FAVORITOS */}
                <Link href="/profile" onClick={closeMenu} className="text-sm text-gray-700 font-medium hover:text-yellow-700">👤 Mi Perfil</Link>
                <button onClick={() => { handleLogout(); closeMenu(); }} className="text-left text-red-600 font-bold text-sm hover:underline mt-2">Cerrar Sesión</button>
              </div>
            ) : (
              <Link href="/login" className="mt-4 bg-yellow-600 text-white text-center py-2 rounded-lg font-bold text-xs hover:bg-yellow-700 transition-colors shadow-sm uppercase" onClick={closeMenu}>Iniciar Sesión</Link>
            )}
        </div>
      </div>
    </nav>
  );
}
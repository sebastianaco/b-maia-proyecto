"use client"; 

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const pathname = usePathname();

  // Traemos las categorías al cargar la página en el navegador
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/categories/");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error cargando categorías", error);
      }
    }
    fetchCategories();
  }, []);

  
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-gray-900 text-white shadow-xl sticky top-0 z-50 border-b-4 border-yellow-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* --- LOGO --- */}
          <Link href="/" className="flex items-center gap-2 group z-50" onClick={closeMenu}>
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform">
              🐝
            </div>
            <span className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
              b-maia
            </span>
          </Link>

          {/* --- MENÚ DE ESCRITORIO (Se oculta en móvil) --- */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
                href="/" 
                className={`font-bold hover:text-yellow-400 transition-colors ${pathname === '/' ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              Inicio
            </Link>

            
            <div className="relative group h-20 flex items-center cursor-pointer">
                <span className="font-bold text-gray-300 group-hover:text-yellow-400 transition-colors flex items-center gap-1">
                    NOTICIAS ▼
                </span>
                
                <div className="absolute top-20 left-0 w-56 bg-white text-gray-800 rounded-b-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="py-2">
                        {categories.length > 0 ? categories.map((cat) => (
                            <Link 
                                key={cat.id}
                                href={cat.name.toLowerCase().includes('noticias') ? '/noticias' : `/categoria/${cat.slug}`}
                                className="block px-6 py-3 hover:bg-yellow-100 hover:text-yellow-800 transition-colors text-sm font-semibold"
                            >
                                🍯 {cat.name}
                            </Link>
                        )) : (
                            <span className="block px-6 py-3 text-xs text-gray-400">Cargando...</span>
                        )}
                    </div>
                </div>
            </div>

            <Link 
                href="/login" 
                className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-colors shadow-md flex items-center gap-2"
            >
                <span>👤</span> Iniciar Sesión
            </Link>
          </div>

          {/* --- BOTÓN HAMBURGUESA (Solo visible en móvil) --- */}
          <button 
            className="md:hidden text-gray-300 hover:text-white focus:outline-none z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            
            {isOpen ? (
                <span className="text-3xl font-bold">✕</span>
            ) : (
                <span className="text-3xl font-bold">☰</span>
            )}
          </button>

        </div>
      </div>

      {/* --- MENÚ MÓVIL DESPLEGABLE --- */}
      {/* Se muestra solo si isOpen es true */}
      <div className={`md:hidden bg-gray-800 absolute top-20 left-0 w-full shadow-2xl transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100 py-6' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="flex flex-col space-y-4 px-6">
            
            <Link 
                href="/" 
                className="text-lg font-bold text-white hover:text-yellow-400 border-b border-gray-700 pb-2"
                onClick={closeMenu}
            >
                Inicio
            </Link>

            {/* Submenú Móvil */}
            <div>
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex justify-between w-full text-lg font-bold text-white hover:text-yellow-400 border-b border-gray-700 pb-2"
                >
                    Temas Apícolas <span>{isDropdownOpen ? '▲' : '▼'}</span>
                </button>
                
                {/* Lista de categorías en móvil */}
                <div className={`${isDropdownOpen ? 'block' : 'hidden'} pl-4 mt-2 space-y-2`}>
                    {categories.map((cat) => (
                        <Link 
                            key={cat.id}
                            href={cat.name.toLowerCase().includes('noticias') ? '/noticias' : `/categoria/${cat.slug}`}
                            className="block text-gray-300 hover:text-yellow-500 py-1"
                            onClick={closeMenu}
                        >
                            🍯 {cat.name}
                        </Link>
                    ))}
                </div>
            </div>

            <Link 
                href="/login" 
                className="bg-yellow-500 text-gray-900 text-center py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
                onClick={closeMenu}
            >
                Iniciar Sesión
            </Link>

        </div>
      </div>
    </nav>
  );
}
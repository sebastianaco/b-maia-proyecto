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
        console.error("Error cargando categorías", error);
      }
    }
    fetchCategories();
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-yellow-50 text-gray-900 shadow-md sticky top-0 z-50 border-b-4 border-yellow-600">
      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      
      <div className="w-full px-4 md:px-6">
        
        
        <div className="flex items-center justify-between h-16">
          
          
          <Link href="/" className="flex items-center shrink-0 z-50" onClick={closeMenu}>
            <img 
                src="/logo-maia.png" 
                alt="Logo MaiA" 
                className="h-10 w-auto object-contain hover:scale-105 transition-transform duration-300" 
            />
          </Link>

          
          <div className="hidden md:flex items-center justify-center gap-5 overflow-x-auto no-scrollbar flex-1 px-4">
            
            <Link 
                href="/" 
                className={`font-bold uppercase text-xs tracking-wide hover:text-yellow-600 transition-colors shrink-0 ${pathname === '/' ? 'text-yellow-700 underline decoration-2 underline-offset-4' : 'text-gray-700'}`}
            >
              INICIO
            </Link>

            {categories.length > 0 ? categories.map((cat) => (
                <Link 
                    key={cat.id}
                    href={cat.name.toLowerCase().includes('noticias') ? '/noticias' : `/categoria/${cat.slug}`}
                    className={`font-bold uppercase text-xs tracking-wide hover:text-yellow-600 transition-colors whitespace-nowrap shrink-0 ${pathname.includes(cat.slug) ? 'text-yellow-700' : 'text-gray-700'}`}
                >
                    {cat.name}
                </Link>
            )) : (
                <span className="text-[10px] text-gray-400 animate-pulse whitespace-nowrap">Cargando...</span>
            )}

          </div>

          
          <div className="hidden md:flex shrink-0">
            <Link 
                href="/login" 
                className="bg-yellow-600 text-white px-4 py-1.5 rounded-full font-bold text-xs hover:bg-yellow-700 transition-colors shadow-md flex items-center gap-2"
            >
                <span>👤</span> <span className="hidden lg:inline">Ingresar</span>
            </Link>
          </div>

          {/* Botón Hamburguesa (Móvil) */}
          <button 
            className="md:hidden text-gray-700 hover:text-yellow-700 focus:outline-none z-50 ml-auto"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
                <span className="text-2xl font-bold">✕</span>
            ) : (
                <span className="text-2xl font-bold">☰</span>
            )}
          </button>

        </div>
      </div>

     
      <div className={`md:hidden bg-yellow-50 absolute top-16 left-0 w-full shadow-lg transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100 py-6 border-b-4 border-yellow-600' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="flex flex-col space-y-4 px-6">
            <Link 
                href="/" 
                className="text-sm font-bold text-gray-800 hover:text-yellow-600 border-b border-yellow-200 pb-2 uppercase"
                onClick={closeMenu}
            >
                INICIO
            </Link>

            {categories.map((cat) => (
                <Link 
                    key={cat.id}
                    href={cat.name.toLowerCase().includes('noticias') ? '/noticias' : `/categoria/${cat.slug}`}
                    className="block text-gray-700 font-semibold hover:text-yellow-700 py-1 uppercase text-xs"
                    onClick={closeMenu}
                >
                    {cat.name}
                </Link>
            ))}

            <Link 
                href="/login" 
                className="mt-4 bg-yellow-600 text-white text-center py-2 rounded-lg font-bold text-xs hover:bg-yellow-700 transition-colors shadow-sm uppercase"
                onClick={closeMenu}
            >
                Iniciar Sesión
            </Link>
        </div>
      </div>
    </nav>
  );
}
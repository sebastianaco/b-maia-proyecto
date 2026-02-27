"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
}

interface CategoryNode extends Category {
  children: Category[];
}

export default function Navbar() {
  const [categoriesTree, setCategoriesTree] = useState<CategoryNode[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/categories/");
        if (res.ok) {
          const data: Category[] = await res.json();
          const categoriasFiltradas = data.filter(cat => cat.name.toLowerCase() !== "apicultura");

          const parents = categoriasFiltradas.filter(cat => cat.parent === null);
          const children = categoriasFiltradas.filter(cat => cat.parent !== null);

          const tree = parents.map(parent => ({
            ...parent,
            children: children.filter(child => 
                Number(child.parent) === Number(parent.id) && !child.name.startsWith('-')
            )
          }));

          setCategoriesTree(tree);
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
    setUser(null);
    window.location.href = "/"; 
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
    setHoveredCategory(null);
  };

  return (
    <nav className="bg-yellow-50 text-gray-900 shadow-md sticky top-0 z-50 border-b-4 border-yellow-600">
      <style jsx global>{`
        @keyframes slideDownAndFade {
          from { opacity: 0; transform: translateY(-12px) translateX(-50%); }
          to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
        .maia-dropdown {
          animation: slideDownAndFade 0.3s ease-out forwards;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <div className="w-full px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          
          <Link href="/" className="flex items-center shrink-0 z-50" onClick={closeMenu}>
            <img 
                src="/logo-maia.png" 
                alt="Logo MaiA" 
                className="object-contain hover:scale-105 transition-transform duration-300" 
                style={{ height: '40px', width: 'auto' }}
            />
          </Link>

          <div className="hidden md:flex items-center justify-center flex-1 px-4 h-full">
            <Link 
                href="/" 
                className={`px-4 font-bold uppercase text-xs tracking-wide hover:text-yellow-600 transition-colors flex items-center h-full shrink-0 ${pathname === '/' ? 'text-yellow-700 underline decoration-2 underline-offset-4' : 'text-gray-700'}`}
            >
              INICIO
            </Link>

            {categoriesTree.map((cat) => {
              if (cat.children.length > 0) {
                return (
                  <div 
                    key={cat.id} 
                    className="relative h-full flex items-center px-2 cursor-pointer shrink-0"
                    onMouseEnter={() => setHoveredCategory(cat.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className={`font-bold uppercase text-xs tracking-wide transition-colors flex items-center gap-1 h-full px-2 ${hoveredCategory === cat.id || pathname.includes(cat.slug) ? 'text-yellow-600' : 'text-gray-700'}`}>
                        {cat.name}
                        <span className="text-[10px] opacity-50">▼</span>
                    </div>
                    
                    {hoveredCategory === cat.id && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-56 z-[1000] maia-dropdown">
                        <div className="bg-white/95 backdrop-blur-sm border-2 border-yellow-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                          {cat.children.map((child) => (
                             <Link 
                               key={child.id}
                               href={`/categoria/${child.slug}`}
                               className="px-6 py-4 text-sm font-bold text-gray-800 hover:bg-yellow-50 hover:text-yellow-700 border-b border-yellow-100 last:border-none uppercase text-center w-full transition-all duration-200 block"
                             >
                               {child.name}
                             </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link 
                  key={cat.id}
                  href={cat.name.toLowerCase().includes('noticias') ? '/noticias' : `/categoria/${cat.slug}`}
                  className={`px-4 font-bold uppercase text-xs tracking-wide hover:text-yellow-600 transition-colors flex items-center h-full whitespace-nowrap shrink-0 ${pathname.includes(cat.slug) ? 'text-yellow-700' : 'text-gray-700'}`}
                >
                    {cat.name}
                </Link>
              );
            })}
          </div>

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

          <button 
            className="md:hidden text-gray-700 hover:text-yellow-700 focus:outline-none z-50 ml-auto"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <span className="text-2xl font-bold">✕</span> : <span className="text-2xl font-bold">☰</span>}
          </button>

        </div>
      </div>

      <div className={`md:hidden bg-yellow-50 absolute top-16 left-0 w-full shadow-lg transition-all duration-300 ease-in-out z-40 border-b-4 border-yellow-600 ${isOpen ? 'max-h-screen opacity-100 py-6 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="flex flex-col space-y-4 px-6">
            <Link href="/" className="text-sm font-bold text-gray-800 hover:text-yellow-600 border-b border-yellow-200 pb-2 uppercase" onClick={closeMenu}>INICIO</Link>
            
            {categoriesTree.map((cat) => {
               return (
                 <div key={cat.id} className="flex flex-col">
                   {cat.children.length > 0 ? (
                     <div className="text-gray-700 font-bold py-2 uppercase text-xs flex items-center gap-2">
                       {cat.name} <span className="text-[10px] opacity-50">▼</span>
                     </div>
                   ) : (
                     <Link href={`/categoria/${cat.slug}`} className="block text-gray-700 font-bold hover:text-yellow-700 py-2 uppercase text-xs" onClick={closeMenu}>
                       {cat.name}
                     </Link>
                   )}
                   
                   {cat.children.length > 0 && (
                     <div className="flex flex-col pl-4 mt-1 border-l-2 border-yellow-200 gap-1">
                       {cat.children.map(child => (
                         <Link key={child.id} href={`/categoria/${child.slug}`} className="text-gray-500 font-medium text-[11px] uppercase hover:text-yellow-600 py-2 block" onClick={closeMenu}>
                           ↳ {child.name}
                         </Link>
                       ))}
                     </div>
                   )}
                 </div>
               );
            })}

            {user ? (
              <div className="pt-4 border-t border-yellow-200 flex flex-col gap-2">
                <span className="text-sm font-bold text-yellow-800">Usuario: {user}</span>
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
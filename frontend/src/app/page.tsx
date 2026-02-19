"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import React from "react";

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string | null;
  category_name: string;
  created_at: string;
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/articles/");
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
          setFilteredArticles(data);
        }
      } catch (error) {
        console.error("Error al cargar noticias", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === "") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter((article) =>
        article.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
    setVisibleCount(12);
  };

  const showMoreArticles = () => {
    setVisibleCount((prev) => prev + 12);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-yellow-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-yellow-50">
      
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-6xl"> 
          
          
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-serif font-black text-yellow-600 mb-3 tracking-tight">
              b-maia
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 font-medium italic">
              el corazón de la apicultura 🐝
            </p>
          </div>

          {/* BUSCADOR */}
          <div className="mb-12 max-w-xl mx-auto relative">
            <input 
              type="text" 
              placeholder="🔍 Buscar noticias..." 
              className="w-full py-4 px-8 rounded-full border-2 border-yellow-400 focus:border-yellow-600 focus:ring-4 focus:ring-yellow-100 outline-none shadow-md text-gray-700 transition-all text-lg"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* GRID DE NOTICIAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {filteredArticles.slice(0, visibleCount).map((article, index) => {
              return (
                <React.Fragment key={article.id}>
                  
                  
                  <article className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group overflow-hidden">
                    
                    
                    <div className="relative h-48 w-full overflow-hidden">
                      <Link href={`/articles/${article.slug}`}>
                        <img 
                          src={article.image || "https://images.unsplash.com/photo-1586194080857-4c24808227f7?q=80&w=687"} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <span className="absolute bottom-3 left-3 bg-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-md pointer-events-none z-10">
                        {article.category_name}
                      </span>
                    </div>

                    
                    <div className="p-5 flex flex-col flex-1">
                      <h2 className="text-lg font-bold text-gray-800 mb-3 leading-snug group-hover:text-yellow-700 transition-colors line-clamp-2">
                        <Link href={`/articles/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h2>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
                        <span className="text-xs text-gray-400 font-medium">
                          {new Date(article.created_at).toLocaleDateString()}
                        </span>
                        <Link 
                          href={`/articles/${article.slug}`} 
                          className="text-yellow-700 font-bold text-xs hover:text-yellow-900 transition-colors uppercase tracking-wide flex items-center gap-1"
                        >
                          Leer más ➝
                        </Link>
                      </div>
                    </div>
                  </article>

                  
                  {index === 4 && (
                     <div className="bg-yellow-500 rounded-xl shadow-lg border-2 border-yellow-600 overflow-hidden flex flex-col h-full relative group cursor-pointer hover:scale-[1.02] transition-transform">
                        <div className="absolute top-0 right-0 bg-black text-yellow-500 text-[10px] font-black px-3 py-1 rounded-bl-lg z-10 uppercase tracking-wider">
                          Destacado
                        </div>
                        <div className="h-48 relative overflow-hidden bg-yellow-600">
                          <img 
                            src="https://plus.unsplash.com/premium_photo-1661851293346-dfd1f54773bc?q=80&w=600" 
                            alt="Miel Pura" 
                            className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-5 flex flex-col flex-1 justify-center items-center text-center bg-yellow-500">
                           <h3 className="text-xl font-black text-black mb-2 uppercase tracking-wide leading-tight">
                             Miel 100% Orgánica
                           </h3>
                           <p className="text-gray-900 text-sm mb-4 font-bold px-2 leading-snug">
                             Directo del apicultor a tu mesa. Sin intermediarios.
                           </p>
                           <button className="bg-black text-white font-bold py-3 px-8 rounded-full text-xs hover:bg-gray-800 transition-colors shadow-md uppercase tracking-wider w-full border border-black">
                             VER OFERTAS
                           </button>
                        </div>
                     </div>
                  )}

                  
                  {index === 8 && (
                     <div className="bg-yellow-500 rounded-xl shadow-lg border-2 border-yellow-600 overflow-hidden flex flex-col h-full relative group hover:scale-[1.02] transition-all">
                        <div className="absolute top-0 right-0 bg-black text-yellow-500 text-[10px] font-bold px-3 py-1 rounded-bl-lg z-10 uppercase tracking-wider">
                          Gratis
                        </div>
                        <div className="h-40 relative overflow-hidden flex items-center justify-center bg-yellow-400">
                           <span className="text-7xl drop-shadow-md">📩</span>
                        </div>
                        <div className="p-6 flex flex-col flex-1 justify-center items-center text-center bg-yellow-500">
                           <h3 className="text-xl font-black text-black mb-2 uppercase leading-tight">
                             Boletín Semanal
                           </h3>
                           <p className="text-gray-900 text-sm mb-4 px-2 font-bold leading-snug">
                             Recibe precios y noticias en tu correo.
                           </p>
                           <input 
                             type="email" 
                             placeholder="Tu correo..." 
                             className="w-full p-3 mb-3 rounded border-2 border-black text-sm text-center text-black bg-white focus:ring-2 focus:ring-black outline-none font-bold placeholder-gray-500"
                           />
                           <button className="bg-black text-white font-bold py-3 px-6 rounded-full text-xs hover:bg-gray-800 transition-colors shadow-md w-full uppercase tracking-wider">
                             SUSCRIBIRME
                           </button>
                        </div>
                     </div>
                  )}

                </React.Fragment>
              );
            })}

          </div>

          
          {visibleCount < filteredArticles.length && (
            <div className="flex justify-center mt-12 mb-8">
              <button 
                onClick={showMoreArticles}
                className="bg-white border-2 border-yellow-600 text-yellow-700 font-bold py-3 px-10 rounded-full hover:bg-yellow-600 hover:text-white transition-all text-sm uppercase shadow-md tracking-widest transform hover:-translate-y-1"
              >
                ⬇ Cargar más noticias
              </button>
            </div>
          )}

        </div>
      </main>

      
      <footer className="bg-yellow-100 text-gray-800 py-12 border-t-4 border-yellow-500 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/*  BRANDING */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
               <img src="/logo-maia.png" alt="MaiA" className="h-10 bg-white rounded-full p-1 shadow-sm" />
               <h3 className="text-2xl font-serif font-black text-yellow-700 tracking-wide"></h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto md:mx-0 font-medium">
              El corazón de la apicultura. Conectando a la comunidad global con información veraz.
            </p>
          </div>

          {/*  ENLACES */}
          <div>
            <h3 className="text-lg font-black text-yellow-800 mb-4 uppercase tracking-wider">Enlaces</h3>
            <ul className="space-y-3 text-sm text-gray-600 font-bold">
              <li>
                <Link href="/" className="hover:text-yellow-600 transition-colors flex items-center justify-center md:justify-start gap-2">
                  <span>🏠</span> Inicio
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="hover:text-yellow-600 transition-colors flex items-center justify-center md:justify-start gap-2">
                  <span>📰</span> Noticias
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-yellow-600 transition-colors flex items-center justify-center md:justify-start gap-2">
                  <span>👤</span> Ingresar
                </Link>
              </li>
            </ul>
          </div>

          {/*  CONTACTO */}
          <div>
            <h3 className="text-lg font-black text-yellow-800 mb-4 uppercase tracking-wider">Contacto</h3>
            <p className="text-gray-700 font-bold text-base mb-6 bg-white/50 py-2 rounded-lg inline-block px-4">
              beefractal@gmail.com
            </p>
            <div className="flex justify-center md:justify-start gap-4">
               <div className="w-10 h-10 bg-yellow-200 text-yellow-800 rounded-full flex items-center justify-center hover:bg-yellow-600 hover:text-white transition-all cursor-pointer shadow-sm">
                 📷
               </div>
               <div className="w-10 h-10 bg-yellow-200 text-yellow-800 rounded-full flex items-center justify-center hover:bg-yellow-600 hover:text-white transition-all cursor-pointer shadow-sm">
                 🐦
               </div>
            </div>
          </div>

        </div>
        
        {/* COPYRIGHT */}
        <div className="text-center text-yellow-800/60 text-xs mt-10 border-t border-yellow-200 pt-6 font-bold uppercase tracking-widest">
          © 2026 b-maia. Todos los derechos reservados.
        </div>
      </footer>

    </div>
  );
}
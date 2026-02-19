"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  content: string; // El contenido HTML que viene de la IA
  image: string | null;
  category_name: string;
  created_at: string;
  author_name: string;
}

export default function ArticleDetailPage() {
  const { slug } = useParams(); // Obtenemos el slug de la URL
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      if (!slug) return;
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/articles/${slug}/`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
        }
      } catch (error) {
        console.error("Error cargando la noticia", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  if (isLoading) return <div className="text-center py-20">Cargando noticia... 🐝</div>;
  if (!article) return <div className="text-center py-20 text-red-500">Noticia no encontrada (404)</div>;

  return (
    <main className="min-h-screen bg-yellow-50 py-10 px-4">
      <div className="container mx-auto max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        
        {/* IMAGEN DE PORTADA */}
        <div className="h-64 md:h-96 w-full relative">
          <img 
            src={article.image || "https://images.unsplash.com/photo-1586194080857-4c24808227f7?q=80&w=687"} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <Link href="/" className="bg-yellow-600 text-white px-4 py-2 rounded-full font-bold shadow-md hover:bg-yellow-700 transition">
              ⬅ Volver
            </Link>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="p-8 md:p-12">
          <span className="text-yellow-600 font-bold uppercase tracking-wide text-sm">
            {article.category_name}
          </span>
          
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mt-2 mb-4 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center text-gray-500 text-sm mb-8 border-b border-gray-100 pb-6">
            <span className="mr-4">📅 {new Date(article.created_at).toLocaleDateString()}</span>
            <span>✍ Por: {article.author_name || "Redacción b-maia"}</span>
          </div>

          {/* CUERPO DE LA NOTICIA (Renderizamos el HTML que manda la IA) */}
          <div 
            className="prose prose-yellow max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        </div>

      </div>
    </main>
  );
}
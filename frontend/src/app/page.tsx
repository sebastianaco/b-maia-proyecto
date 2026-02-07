import Link from "next/link";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  image: string | null;
  category_name: string;
  created_at: string;
}

async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/articles/", {
      cache: "no-store", 
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* --- SECCIÓN 1: BIENVENIDA (Hero) --- */}
      <section className="bg-white pt-12 pb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6 tracking-tight">
            b-maia: El corazón de la apicultura
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Descubre toda la información sobre la apicultura. 
            Actualidad, noticias, reportajes y mucho más sobre el mundo apícola.
            <br />
            <span className="font-bold text-yellow-600 mt-2 block">
              ¡Bienvenido a la comunidad de b-maia!
            </span>
          </p>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mt-8 rounded-full"></div>
        </div>
      </section>

      {/* --- SECCIÓN 2: BANNER --- */}
      <section className="bg-white pb-16">
        <div className="container mx-auto px-4">
            <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden shadow-xl mt-8">
                <img
                  src="/banner.jpg" 
                  alt="Abejas en el panal"
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                />
            </div>
        </div>
      </section>

      {/* --- SECCIÓN 3: ÚLTIMAS NOTICIAS --- */}
      <section className="container mx-auto px-4 py-12" id="noticias">
        
        <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-10 bg-yellow-500 rounded-sm"></div>
            <h2 className="text-3xl font-bold text-gray-800 font-serif">
            Últimas Noticias
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length > 0 ? (
            articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col"
              >
                <div className="relative h-56 w-full bg-gray-200">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                        <span className="text-4xl">🐝</span>
                    </div>
                  )}
                  <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {article.category_name || "General"}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif leading-tight hover:text-yellow-600 transition-colors">
                      <Link href={`/noticia/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    <Link 
                        href={`/noticia/${article.slug}`}
                        className="text-yellow-600 font-bold hover:underline"
                    >
                        Leer más →
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">
                No hay noticias recientes. <br/>
                <span className="text-sm text-gray-400">Nuestro robot periodista está buscando polen... 🐝</span>
              </p>
            </div>
          )}
        </div>
      </section>

    </main>
  );
}
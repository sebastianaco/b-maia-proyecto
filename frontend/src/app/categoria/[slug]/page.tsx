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

interface Props {
  params: Promise<{
    slug: string;
  }>;
}


async function getCategoryArticles(slug: string): Promise<Article[]> {
  try {
    
    const res = await fetch("http://127.0.0.1:8000/api/articles/", {
      cache: "no-store",
    });
    
    if (!res.ok) return [];
    
    const allArticles: Article[] = await res.json();

    
    const normalize = (text: string) => 
      text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-");

    const decodedSlug = decodeURIComponent(slug);

    
    return allArticles.filter(article => {
      const normalizedCategory = normalize(article.category_name);
      return decodedSlug.includes(normalizedCategory) || normalizedCategory.includes(decodedSlug);
    });

  } catch (error) {
    return [];
  }
}

export default async function CategoryPage({ params }: Props) {
  
  const { slug } = await params;
  const articles = await getCategoryArticles(slug);
  
  
  const categoryTitle = slug
    .replace("noticias-", "") 
    .replace(/-/g, " ")
    .toUpperCase();

  const decodedTitle = decodeURIComponent(categoryTitle);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        
        
        <div className="text-center mb-12">
            <span className="text-yellow-600 font-bold tracking-widest text-sm uppercase">
                Categoría
            </span>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mt-2">
                {decodedTitle}
            </h1>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mt-6 rounded-full"></div>
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
                    {article.category_name}
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
                No hay noticias en la categoría <strong>"{decodedTitle}"</strong> todavía.
              </p>
              <Link href="/" className="text-yellow-600 hover:underline mt-4 block">
                ← Volver a todas las noticias
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
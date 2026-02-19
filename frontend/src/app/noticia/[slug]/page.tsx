import Link from "next/link";
import { notFound } from "next/navigation";


interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string; 
  slug: string;
  image: string | null;
  category_name: string;
  created_at: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}


async function getArticle(slug: string): Promise<Article | null> {
  try {
    
    const res = await fetch("http://127.0.0.1:8000/api/articles/", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    
    const articles: Article[] = await res.json();
    
    return articles.find((a) => a.slug === slug) || null;
  } catch (error) {
    return null;
  }
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound(); 
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        
        <Link href="/" className="text-yellow-600 font-bold hover:underline mb-6 inline-block">
          ← Volver a Noticias
        </Link>

        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
            
           
            <div className="relative h-64 md:h-96 w-full bg-gray-200">
                {article.image ? (
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-6xl">🐝</span>
                    </div>
                )}
            </div>

            <div className="p-8 md:p-12">
               
                <div className="flex items-center gap-4 mb-6 text-sm">
                    <span className="bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {article.category_name}
                    </span>
                    <span className="text-gray-500">
                        {new Date(article.created_at).toLocaleDateString()}
                    </span>
                </div>

                
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-8 leading-tight">
                    {article.title}
                </h1>

                
                <div 
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: article.content }} 
                />
            </div>

        </article>

      </div>
    </main>
  );
}
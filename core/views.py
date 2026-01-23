from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils.text import slugify  
from .models import Article, Category
from .serializers import ArticleSerializer, ArticleCreateSerializer, CategorySerializer

@api_view(['GET'])
def get_articles(request):
    articles = Article.objects.filter(status='published').order_by('-created_at')
    serializer = ArticleSerializer(articles, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_article_detail(request, slug):
    try:
        article = Article.objects.get(slug=slug, status='published')
        serializer = ArticleSerializer(article)
        return Response(serializer.data)
    except Article.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

@api_view(['POST'])
def create_article_from_ai(request):
    # 1. PASO DE SEGURIDAD: Verificar si la noticia ya existe
    title = request.data.get('title', '')
    
   
    posible_slug = slugify(title)
    
    
    if Article.objects.filter(slug=posible_slug).exists():
        
        existing_article = Article.objects.get(slug=posible_slug)
         
        return Response({
            'message': 'La noticia ya existía, se omitió el duplicado.',
            'id': existing_article.id,
            'slug': existing_article.slug
        }, status=status.HTTP_200_OK)

    # 2. Si NO existe, procedemos a crearla normalmente
    serializer = ArticleCreateSerializer(data=request.data)
    if serializer.is_valid():
        article = serializer.save()
        return Response(ArticleSerializer(article).data, status=status.HTTP_201_CREATED)
    
    # Si los datos venían mal (ej: faltaba el autor), devolvemos error
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_categories(request):
    """Devuelve la lista de categorías para el menú"""
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)
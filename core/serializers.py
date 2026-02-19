from rest_framework import serializers
from django.contrib.auth.models import User # <--- IMPORTANTE: Necesario para el Login
from .models import Article, Category

# --- SERIALIZERS DE CATEGORÍAS ---
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

# --- SERIALIZERS DE ARTÍCULOS (LECTURA) ---
class ArticleSerializer(serializers.ModelSerializer):
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 
            'image', 'created_at', 'category_name', 'author_name'
        ]

# --- SERIALIZERS DE ARTÍCULOS (CREACIÓN - N8N) ---
class ArticleCreateSerializer(serializers.ModelSerializer):
    
    # Recibimos texto (ej: "Norte America") y lo convertimos a ID internamente
    category = serializers.CharField() 

    class Meta:
        model = Article
        fields = ['title', 'content', 'excerpt', 'category', 'author', 'status', 'image']

    def validate_category(self, value):
        """
        Busca la instancia de Categoría basada en ID o Nombre.
        Retorna el OBJETO Category para que Django sepa guardarlo.
        """
        # 1. Si es un número (ID)
        if str(value).isdigit():
            try:
                return Category.objects.get(id=int(value))
            except Category.DoesNotExist:
                pass 
        
        # 2. Si es texto (Nombre), busca coincidencia
        category_obj = Category.objects.filter(name__icontains=str(value)).first()
        
        if category_obj:
            return category_obj

        # 3. Si no encuentra nada, usa la Categoría 1 o la primera disponible
        default_cat = Category.objects.filter(id=1).first()
        if default_cat:
            return default_cat
            
        return Category.objects.first()

# --- NUEVO: SERIALIZER PARA USUARIOS (REGISTRO) ---
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        # Esto asegura que la contraseña se pueda escribir pero NO leer (seguridad)
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Usamos create_user para que la contraseña se guarde ENCRIPTADA
        user = User.objects.create_user(**validated_data)
        return user
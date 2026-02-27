from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Article, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent']

class ArticleSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 
            'image', 'created_at', 'category_name', 'author_name'
        ]

class ArticleCreateSerializer(serializers.ModelSerializer):
    category = serializers.CharField() 

    class Meta:
        model = Article
        fields = ['title', 'content', 'excerpt', 'category', 'author', 'status', 'image']

    def validate_category(self, value):
        if str(value).isdigit():
            try:
                return Category.objects.get(id=int(value))
            except Category.DoesNotExist:
                pass 
        
        category_obj = Category.objects.filter(name__icontains=str(value)).first()
        
        if category_obj:
            return category_obj

        default_cat = Category.objects.filter(id=1).first()
        if default_cat:
            return default_cat
            
        return Category.objects.first()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
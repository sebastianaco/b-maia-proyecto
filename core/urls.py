from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    
    path('register/', views.register_user, name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # ESTE ES EL LOGIN
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    
    path('categories/', views.get_categories, name='get_categories'),

    
    path('articles/', views.get_articles, name='get_articles'),
    path('articles/<slug:slug>/', views.get_article_detail, name='get_article_detail'),

    
    path('create-article/', views.create_article_from_ai, name='create_article_from_ai'),
]
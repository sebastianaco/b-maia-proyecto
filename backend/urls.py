from django.contrib import admin
from django.urls import path
from core import views 
from django.conf import settings
from django.conf.urls.static import static


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
   
   
    path('api/register/', views.register_user, name='register'),
    
    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    
    path('api/articles/', views.get_articles, name='get_articles'),
    
  
    path('api/create-article/', views.create_article_from_ai, name='create_article_from_ai'),
    
    path('api/articles/<slug:slug>/', views.get_article_detail, name='get_article_detail'),
    path('api/categories/', views.get_categories, name='get_categories'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
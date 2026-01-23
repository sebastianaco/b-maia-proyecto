from django.contrib import admin
from django.urls import path
from core import views # Importamos nuestras vistas
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # --- RUTAS DE LA API ---
    # Esta ruta entrega la lista de todas las noticias
    path('api/articles/', views.get_articles),
    
    # Esta ruta entrega una noticia específica
    path('api/articles/<slug:slug>/', views.get_article_detail),
    path('api/create-article/', views.create_article_from_ai),
    path('api/categories/', views.get_categories),
]

# Configuración para ver las imágenes mientras desarrollamos
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
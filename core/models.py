from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nombre Categoría")
    slug = models.SlugField(unique=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories')

    class Meta:
        verbose_name_plural = "Categorías"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name

class Article(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Borrador'),
        ('published', 'Publicado'),
    )

    title = models.CharField(max_length=200, verbose_name="Título")
    slug = models.SlugField(unique=True, blank=True, max_length=200)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles', verbose_name="Autor")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='articles', verbose_name="Categoría")
    image = models.URLField(max_length=500, verbose_name="URL Imagen Destacada", blank=True, null=True)
    excerpt = models.TextField(verbose_name="Resumen/Bajada")
    content = models.TextField(verbose_name="Contenido Completo")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Artículo"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
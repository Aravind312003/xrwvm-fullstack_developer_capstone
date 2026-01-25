"""djangoproj URL Configuration

The urlpatterns list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings
from djangoapp import views 

urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),
    
    # Backend API routes (This includes your register and login logic)
    path('djangoapp/', include('djangoapp.urls')),
    
    # React Frontend entry points
    # These routes serve index.html so React Router can take over on the client side
    path('login/', TemplateView.as_view(template_name="index.html")),
    path('register/', TemplateView.as_view(template_name="index.html")),
    
    # Static pages (if handled by Django templates)
    path('', TemplateView.as_view(template_name="Home.html")),
    path('about/', TemplateView.as_view(template_name="About.html")),
    path('contact/', TemplateView.as_view(template_name="Contact.html")),
    
    # Authentication requests
    path('logout/', views.logout_request, name='logout'),
    
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
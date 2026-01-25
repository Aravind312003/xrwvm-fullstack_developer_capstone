from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'
urlpatterns = [
    # Path for registration
    path(route='register', view=views.register, name='register'),

    # Path for login
    path(route='login', view=views.login_user, name='login'),
    
    # Path for logout
    path(route='logout', view=views.logout_request, name='logout'),

    # NEW: Path for getting car list and populating data
    path(route='get_cars', view=views.get_cars, name='getcars'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
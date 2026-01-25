from django.contrib import admin
from .models import CarMake, CarModel

# --- 1. CarModelInline class ---
# This allows us to edit CarModel records on the same page as CarMake
class CarModelInline(admin.StackedInline):
    model = CarModel
    extra = 3  # Provides 3 empty slots by default to add new models

# --- 2. CarModelAdmin class ---
# Customizes the list view of CarModels
class CarModelAdmin(admin.ModelAdmin):
    # REMOVED 'dealer_id' to fix SystemCheckError (admin.E108)
    list_display = ('name', 'car_make', 'type', 'year')
    list_filter = ['type', 'year', 'car_make']
    search_fields = ['name', 'car_make__name']

# --- 3. CarMakeAdmin class with CarModelInline ---
# Customizes the CarMake view to include the inline models
class CarMakeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ['name']
    inlines = [CarModelInline]

# --- 4. Register models here ---
admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)
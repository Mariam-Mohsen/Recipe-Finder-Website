from django.contrib import admin
from .models import Cuisine, SubCategory, RootCategory, Recipe, UserProfile, Favorite

admin.site.register(Cuisine)
admin.site.register(SubCategory)
admin.site.register(RootCategory)
admin.site.register(Recipe)
admin.site.register(UserProfile)
admin.site.register(Favorite)

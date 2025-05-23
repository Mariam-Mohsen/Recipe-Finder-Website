# models.py
from django.db import models
from django.contrib.auth.models import User

class Cuisine(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class SubCategory(models.Model):
    name = models.CharField(max_length=100)
    cuisine = models.ForeignKey(Cuisine, on_delete=models.CASCADE, related_name='subcategories')

    class Meta:
        unique_together = ('name', 'cuisine')

    def __str__(self):
        return f"{self.name} ({self.cuisine.name})"

class RootCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Recipe(models.Model):
    title = models.CharField(max_length=200)
    image_url = models.ImageField(upload_to='recipes_images/', blank=True, null=True)
    description = models.TextField()
    ingredients = models.TextField()
    instructions = models.TextField()
    cuisine = models.ForeignKey(Cuisine, on_delete=models.SET_NULL, null=True, blank=True)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, blank=True)
    root_category = models.ForeignKey(RootCategory, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.title

class UserProfile(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    is_admin = models.BooleanField(default=False)
    photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)

    def __str__(self):
        return self.username

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_recipes')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'recipe')

    def __str__(self):
        return f"{self.user.username} - {self.recipe.title}"

class Ingredient(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        unique_together = ('recipe', 'ingredient')

    def __str__(self):
        return f"{self.quantity or ''} {self.ingredient.name} in {self.recipe.title}"

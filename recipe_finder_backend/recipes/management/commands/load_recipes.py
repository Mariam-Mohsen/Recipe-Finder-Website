import os
import json
import re
from django.core.management.base import BaseCommand
from recipes.models import (
    Cuisine, SubCategory, RootCategory,
    Recipe, RecipeIngredient, Ingredient
)

def split_ingredient_quantity(text):
   
    match = re.match(
        r"^(?P<quantity>[\d\./\s]+(?:\s*(cup[s]?|tbsp[s]?|tsp[s]?|g|kg|ml|l|oz|clove[s]?|slice[s]?|piece[s]?|tablespoons?|teaspoons?)?)?)\s+(?P<name>.+)",
        text.strip(),
        flags=re.IGNORECASE
    )
    if match:
        return match.group('quantity').strip(), match.group('name').strip().lower()
    return "", text.strip().lower()

class Command(BaseCommand):
    help = "Load recipes from recipes.json and populate RecipeIngredient with quantity"

    def handle(self, *args, **options):
        
        json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'recipes.json')
        json_path = os.path.normpath(json_path)

        if not os.path.exists(json_path):
            self.stdout.write(self.style.ERROR("recipes.json file not found."))
            return

        with open(json_path, 'r', encoding='utf-8') as file:
            data = json.load(file)

        for key, value in data.items():
            if key in ['egyptian', 'italian', 'mexican', 'indian']:
                cuisine, _ = Cuisine.objects.get_or_create(name=key)
                for subcat_name, recipes in value.items():
                    subcategory, _ = SubCategory.objects.get_or_create(name=subcat_name, cuisine=cuisine)
                    for recipe_data in recipes:
                        self.import_recipe(recipe_data, cuisine, subcategory, None)
            elif key in ['main_dishes', 'soups', 'appetizers', 'dessert']:
                root_category, _ = RootCategory.objects.get_or_create(name=key)
                for recipe_data in value:
                    self.import_recipe(recipe_data, None, None, root_category)

        self.stdout.write(self.style.SUCCESS("Recipes successfully loaded!"))

    def import_recipe(self, recipe_data, cuisine, subcategory, root_category):
        title = recipe_data.get('name')
      
        recipe = Recipe.objects.create(
            title=title,
            description=recipe_data.get("description", ""),
            instructions='\n'.join(recipe_data.get('instructions', [])),
            image_url=recipe_data.get("image", ""),
            cuisine=cuisine,
            subcategory=subcategory,
            root_category=root_category,
            ingredients='\n'.join(recipe_data.get('ingredients', []))
        )

      
        added = set()
        for item in recipe_data.get('ingredients', []):
            quantity, name_only = split_ingredient_quantity(item)
            if name_only not in added:
                ingredient, _ = Ingredient.objects.get_or_create(name=name_only)
                RecipeIngredient.objects.create(
                    recipe=recipe,
                    ingredient=ingredient,
                    quantity=quantity
                )
                added.add(name_only)
        print(f"Imported: {title} in {cuisine.name if cuisine else 'general'} cuisine")

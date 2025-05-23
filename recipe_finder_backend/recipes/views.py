# views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.views import View
from django.http import JsonResponse
from .models import UserProfile, Recipe, Cuisine, SubCategory, RootCategory, Favorite
from .forms import SignUpForm, LoginForm, RecipeForm
from django.contrib.auth.password_validation import validate_password
from django.db.models import Q
from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy
from .models import Recipe
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import update_session_auth_hash


class HomeView(View):
    def get(self, request):
        is_admin = False
        if request.user.is_authenticated:
            try:
                from .models import UserProfile
                is_admin = UserProfile.objects.get(username=request.user.username).is_admin
            except UserProfile.DoesNotExist:
                is_admin = False
        return render(request, 'recipes/index.html', {'is_admin': is_admin})

class RecipeListView(View):
    def get(self, request):
        recipes = Recipe.objects.all()
        return render(request, 'recipes/recipe_list.html', {'recipes': recipes})

class RecipeDetailView(View):
    def get(self, request, pk):
        recipe = get_object_or_404(Recipe, pk=pk)
        return render(request, 'recipes/recipe_detail.html', {'recipe': recipe})

class ProfileView(View):
    def get(self, request):
        favorites = []
        user_profile = None
        if request.user.is_authenticated:
            
            try:
                user_profile = UserProfile.objects.get(username=request.user.username)
              
                if user_profile.photo and hasattr(user_profile.photo, 'url'):
                 
                    if not user_profile.photo.url.startswith('http'):
                      
                        pass
            except UserProfile.DoesNotExist:
              
                user_profile = UserProfile.objects.create(
                    username=request.user.username,
                    password=request.user.password,
                    is_admin=request.user.is_staff
                )
                
            
            favorites = request.user.favorite_recipes.select_related('recipe').all()
            for favorite in favorites:
                recipe = favorite.recipe
               
                if recipe.image_url and hasattr(recipe.image_url, 'url') and not recipe.image_url.url.startswith('http'):
                    img_name = recipe.image_url.url.split('/')[-1]
                    recipe.image_url = f"/static/recipes/images/{img_name}"
                elif not recipe.image_url:
                    recipe.image_url = "/static/recipes/images/default.jpg"
        
        
        if user_profile is None and request.user.is_authenticated:
          
            user_profile = UserProfile.objects.create(
                username=request.user.username,
                password=request.user.password,
                is_admin=request.user.is_staff
            )
            
        return render(request, 'recipes/profile.html', {'favorites': favorites, 'user_profile': user_profile})

class CuisineListView(View):
    def get(self, request):
        cuisines = Cuisine.objects.all()
        return render(request, 'recipes/cuisine_list.html', {'cuisines': cuisines})

class SubCategoryListView(View):
    def get(self, request):
        subcategories = SubCategory.objects.all()
        return render(request, 'recipes/subcategory_list.html', {'subcategories': subcategories})

class RootCategoryListView(View):
    def get(self, request):
        categories = RootCategory.objects.all()
        return render(request, 'recipes/category_list.html', {'categories': categories})

class LoginPageView(View):
    def get(self, request):
        return render(request, 'recipes/login.html', {'form': LoginForm()})

class SignupPageView(View):
    def get(self, request):
        return render(request, 'recipes/signup.html', {'form': SignUpForm()})

class MainDishView(View):
    def get(self, request):
        recipes = Recipe.objects.filter(root_category__id=1)
       
        for recipe in recipes:
            if recipe.image_url and not recipe.image_url.url.startswith('http'):
                img_name = recipe.image_url.url.split('/')[-1]
                recipe.image_url = f"/static/recipes/images/{img_name}"
            elif not recipe.image_url:
                recipe.image_url = "/static/recipes/images/default.jpg"
        return render(request, 'recipes/main_dish.html', {'recipes': recipes})

class RecipeAdminView(View):
    def get(self, request):
        recipes = Recipe.objects.all()
        for recipe in recipes:
            if recipe.image_url and not recipe.image_url.url.startswith('http'):
                img_name = recipe.image_url.url.split('/')[-1]
                recipe.image_url = f"/static/recipes/images/{img_name}"
            elif not recipe.image_url:
                recipe.image_url = "/static/recipes/images/default.jpg"
        return render(request, 'recipes/recipe_admin.html', {'recipes': recipes})

class SoupView(View):
    def get(self, request):
        recipes = Recipe.objects.filter(root_category__id=2)
        for recipe in recipes:
            if recipe.image_url and not recipe.image_url.url.startswith('http'):
                img_name = recipe.image_url.url.split('/')[-1]
                recipe.image_url = f"/static/recipes/images/{img_name}"
            elif not recipe.image_url:
                recipe.image_url = "/static/recipes/images/default.jpg"
        return render(request, 'recipes/soup.html', {'recipes': recipes})



class EditProfileView(LoginRequiredMixin, View):
    def get(self, request):
        user = request.user
        try:
            user_profile = UserProfile.objects.get(username=user.username)
            
            if user_profile.photo and hasattr(user_profile.photo, 'url'):
             
                if not user_profile.photo.url.startswith('http'):
                 
                    pass
        except UserProfile.DoesNotExist:
          
            user_profile = UserProfile.objects.create(
                username=user.username,
                password=user.password,
                is_admin=user.is_staff
            )
        return render(request, 'recipes/edit_profile.html', {'user': user, 'user_profile': user_profile})

    def post(self, request):
        user = request.user
        
        
        try:
            profile = UserProfile.objects.get(username=user.username)
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(
                username=user.username,
                password=user.password,
                is_admin=user.is_staff
            )

     
        if 'photo' in request.FILES:
            profile.photo = request.FILES['photo']

        
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if username:
            user.username = username
            profile.username = username

        if email:
            user.email = email

        if password:
            user.set_password(password)
            profile.password = password

       
        user.save()
        profile.save()

        
        update_session_auth_hash(request, user)

        messages.success(request, 'Profile updated successfully!')
        return redirect('profile')


class AddRecipeView(View):
    def get(self, request):
        return render(request, 'recipes/add_recipe.html')

class AppetizerView(View):
    def get(self, request):
        recipes = Recipe.objects.filter(root_category__id=3)
        for recipe in recipes:
            if recipe.image_url and not recipe.image_url.url.startswith('http'):
                img_name = recipe.image_url.url.split('/')[-1]
                recipe.image_url = f"/static/recipes/images/{img_name}"
            elif not recipe.image_url:
                recipe.image_url = "/static/recipes/images/default.jpg"
        return render(request, 'recipes/appetizer.html', {'recipes': recipes})

class DessertView(View):
    def get(self, request):
        recipes = Recipe.objects.filter(root_category__id=4)
        for recipe in recipes:
            if recipe.image_url and not recipe.image_url.url.startswith('http'):
                img_name = recipe.image_url.url.split('/')[-1]
                recipe.image_url = f"/static/recipes/images/{img_name}"
            elif not recipe.image_url:
                recipe.image_url = "/static/recipes/images/default.jpg"
        return render(request, 'recipes/dessert.html', {'recipes': recipes})

class UserMainDishView(View):
    def get(self, request):
        search_query = request.GET.get("search", "")
        recipes = Recipe.objects.filter(root_category__id=1)

        if search_query:
            recipes = recipes.filter(
                Q(title__icontains=search_query) |
                Q(ingredients__icontains=search_query) |
                Q(description__icontains=search_query)
            )

        favorites = Favorite.objects.filter(user=request.user).values_list('recipe_id', flat=True) if request.user.is_authenticated else []


        fixed_recipes = []
        for recipe in recipes:
            if recipe.image_url and hasattr(recipe.image_url, 'url') and not recipe.image_url.url.startswith('http'):
                img_name = recipe.image_url.url.split('/')[-1]
                fixed_image_url = f"/static/recipes/images/{img_name}"
            elif not recipe.image_url:
                fixed_image_url = "/static/recipes/images/default.jpg"
            else:
                fixed_image_url = recipe.image_url.url

          
            recipe.image_url = fixed_image_url

           
            fixed_recipes.append({
                'id': recipe.id,
                'title': recipe.title,
                'description': recipe.description,
                'image_url': fixed_image_url,
                'ingredients': recipe.ingredients.splitlines() if recipe.ingredients else [],
                'instructions': recipe.instructions.splitlines() if recipe.instructions else []
            })

        
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'recipes': fixed_recipes})

       
        return render(request, 'recipes/User_main_dish.html', {
            'recipes': recipes,
            'favorites': favorites
        })

class UserSoupView(View):
    def get(self, request):
        search_query = request.GET.get("search", "")
        recipes = Recipe.objects.filter(root_category__id=2)

        if search_query:
            recipes = recipes.filter(
                Q(title__icontains=search_query) |
                Q(ingredients__icontains=search_query) |
                Q(description__icontains=search_query)
            )

        favorites = Favorite.objects.filter(user=request.user).values_list('recipe_id', flat=True) if request.user.is_authenticated else []

        fixed_recipes = []
        for recipe in recipes:
            if recipe.image_url and hasattr(recipe.image_url, 'url') and not recipe.image_url.url.startswith('http'):
                img_name = recipe.image_url.url.split('/')[-1]
                image_url = f"/static/recipes/images/{img_name}"
            elif not recipe.image_url:
                image_url = "/static/recipes/images/default.jpg"
            else:
                image_url = recipe.image_url.url

            recipe.image_url = image_url  

            fixed_recipes.append({
                'id': recipe.id,
                'title': recipe.title,
                'description': recipe.description,
                'image_url': image_url,
                'ingredients': recipe.ingredients.splitlines() if recipe.ingredients else [],
                'instructions': recipe.instructions.splitlines() if recipe.instructions else []
            })

        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'recipes': fixed_recipes})

        return render(request, 'recipes/User_Soup.html', {
            'recipes': recipes,
            'favorites': favorites
        })

class UserAppetizersView(View):
    def get(self, request):
        search_query = request.GET.get("search", "")
        recipes = Recipe.objects.filter(root_category__id=3)

        if search_query:
            recipes = recipes.filter(
                Q(title__icontains=search_query) |
                Q(ingredients__icontains=search_query) |
                Q(description__icontains=search_query)
            )

        favorites = Favorite.objects.filter(user=request.user).values_list('recipe_id', flat=True) if request.user.is_authenticated else []

        fixed_recipes = []
        for recipe in recipes:
            if recipe.image_url and hasattr(recipe.image_url, 'url') and not recipe.image_url.url.startswith('http'):
                img_name = recipe.image_url.url.split('/')[-1]
                image_url = f"/static/recipes/images/{img_name}"
            elif not recipe.image_url:
                image_url = "/static/recipes/images/default.jpg"
            else:
                image_url = recipe.image_url.url

            recipe.image_url = image_url

            fixed_recipes.append({
                'id': recipe.id,
                'title': recipe.title,
                'description': recipe.description,
                'image_url': image_url,
                'ingredients': recipe.ingredients.splitlines() if recipe.ingredients else [],
                'instructions': recipe.instructions.splitlines() if recipe.instructions else []
            })

        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'recipes': fixed_recipes})

        return render(request, 'recipes/User_Appetizers.html', {
            'recipes': recipes,
            'favorites': favorites
        })


class UserDessertView(View):
    def get(self, request):
        search_query = request.GET.get("search", "")
        recipes = Recipe.objects.filter(root_category__id=4)

        if search_query:
            recipes = recipes.filter(
                Q(title__icontains=search_query) |
                Q(ingredients__icontains=search_query) |
                Q(description__icontains=search_query)
            )

        favorites = Favorite.objects.filter(user=request.user).values_list('recipe_id', flat=True) if request.user.is_authenticated else []

        fixed_recipes = []
        for recipe in recipes:
            if recipe.image_url and hasattr(recipe.image_url, 'url') and not recipe.image_url.url.startswith('http'):
                img_name = recipe.image_url.url.split('/')[-1]
                image_url = f"/static/recipes/images/{img_name}"
            elif not recipe.image_url:
                image_url = "/static/recipes/images/default.jpg"
            else:
                image_url = recipe.image_url.url

            recipe.image_url = image_url

            fixed_recipes.append({
                'id': recipe.id,
                'title': recipe.title,
                'description': recipe.description,
                'image_url': image_url,
                'ingredients': recipe.ingredients.splitlines() if recipe.ingredients else [],
                'instructions': recipe.instructions.splitlines() if recipe.instructions else []
            })

        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'recipes': fixed_recipes})

        return render(request, 'recipes/User_Dessert.html', {
            'recipes': recipes,
            'favorites': favorites
        })


class MexicanView(View):
    def get(self, request):
        try:
            mexican_cuisine = Cuisine.objects.get(name__iexact='mexican')
        except Cuisine.DoesNotExist:
            mexican_cuisine = None

        main_courses = Recipe.objects.filter(cuisine=mexican_cuisine, subcategory__name__iexact='main course')
        appetizers = Recipe.objects.filter(cuisine=mexican_cuisine, subcategory__name__iexact='appetizers')
        soups = Recipe.objects.filter(cuisine=mexican_cuisine, subcategory__name__iexact='soup')
        desserts = Recipe.objects.filter(cuisine=mexican_cuisine, subcategory__name__iexact='dessert')

        context = {
            'main_courses': main_courses,
            'appetizers': appetizers,
            'soups': soups,
            'desserts': desserts,
        }
        return render(request, 'recipes/mexican.html', context)

class ItalianView(View):
    def get(self, request):
        try:
            italian_cuisine = Cuisine.objects.get(name__iexact='italian')
        except Cuisine.DoesNotExist:
            italian_cuisine = None

        main_courses = Recipe.objects.filter(cuisine=italian_cuisine, subcategory__name__iexact='main course')
        appetizers = Recipe.objects.filter(cuisine=italian_cuisine, subcategory__name__iexact='appetizers')
        soups = Recipe.objects.filter(cuisine=italian_cuisine, subcategory__name__iexact='soup')
        desserts = Recipe.objects.filter(cuisine=italian_cuisine, subcategory__name__iexact='dessert')

        context = {
            'main_courses': main_courses,
            'appetizers': appetizers,
            'soups': soups,
            'desserts': desserts,
        }
        return render(request, 'recipes/italian.html', context)

class IndianView(View):
    def get(self, request):
        try:
            indian_cuisine = Cuisine.objects.get(name__iexact='indian')
        except Cuisine.DoesNotExist:
            indian_cuisine = None

        main_courses = Recipe.objects.filter(cuisine=indian_cuisine, subcategory__name__iexact='main course')
        appetizers = Recipe.objects.filter(cuisine=indian_cuisine, subcategory__name__iexact='appetizers')
        soups = Recipe.objects.filter(cuisine=indian_cuisine, subcategory__name__iexact='soup')
        desserts = Recipe.objects.filter(cuisine=indian_cuisine, subcategory__name__iexact='dessert')

        context = {
            'main_courses': main_courses,
            'appetizers': appetizers,
            'soups': soups,
            'desserts': desserts,
        }
        return render(request, 'recipes/indian.html', context)

class EgyptianView(View):
    def get(self, request):
        try:
            egyptian_cuisine = Cuisine.objects.get(name__iexact='egyptian')
        except Cuisine.DoesNotExist:
            egyptian_cuisine = None

        main_courses = Recipe.objects.filter(cuisine=egyptian_cuisine, subcategory__name__iexact='main course')
        appetizers = Recipe.objects.filter(cuisine=egyptian_cuisine, subcategory__name__iexact='appetizers')
        soups = Recipe.objects.filter(cuisine=egyptian_cuisine, subcategory__name__iexact='soup')
        desserts = Recipe.objects.filter(cuisine=egyptian_cuisine, subcategory__name__iexact='dessert')

        context = {
            'main_courses': main_courses,
            'appetizers': appetizers,
            'soups': soups,
            'desserts': desserts,
        }
        return render(request, 'recipes/egyptian.html', context)

class IndexView(View):
    def get(self, request):
        return render(request, 'recipes/index.html')

def signup_view(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        is_staff = request.POST.get('is_staff') == 'on'

        if form.is_valid():
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']

            if User.objects.filter(username=username).exists():
                messages.error(request, "Username already exists.")
                return redirect('signup')
            if User.objects.filter(email=email).exists():
                messages.error(request, "Email already exists.")
                return redirect('signup')

            user = User.objects.create_user(username=username, email=email, password=password)
            user.is_staff = is_staff
            user.save()

            UserProfile.objects.create(
                username=username,
                password=password,
                is_admin=is_staff
            )

            messages.success(request, "Signup successful. Please login.")
            return redirect('login')
        else:
            messages.error(request, "Please fix the form errors.")
    else:
        form = SignUpForm()

    return render(request, 'recipes/signup.html', {'form': form})


def login_view(request):
  
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)  
                try:
                    profile = UserProfile.objects.get(username=username)
                    if profile.is_admin:
                        return redirect('recipe_admin')
                    else:
                        return redirect('user_main_dish')
                except UserProfile.DoesNotExist:
                    messages.error(request, "User profile not found.")
                    return redirect('login')
            else:
                messages.error(request, "Invalid username or password.")
                return redirect('login')
    else:
        form = LoginForm()
    return render(request, 'recipes/login.html', {'form': form})


def logoutview(request):
    
    logout(request)
    return redirect('home')  




def toggle_favorite(request, recipe_id):
    if request.user.is_authenticated:
        favorite, created = Favorite.objects.get_or_create(user=request.user, recipe_id=recipe_id)
        if not created:
            favorite.delete()
            status = 'removed'
        else:
            status = 'added'

        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'status': status})

    return redirect(request.META.get('HTTP_REFERER', 'user_main_dish'))



class EditRecipeView(UpdateView):
    model = Recipe
    fields = ['title', 'description', 'ingredients', 'instructions', 'image_url']
    template_name = 'recipes/edit_recipe.html'
    success_url = reverse_lazy('recipe_admin')

class DeleteRecipeView(DeleteView):
    model = Recipe
    template_name = 'recipes/confirm_delete.html'
    success_url = reverse_lazy('recipe_admin')
def recipe_edit(request, pk):
    recipe = get_object_or_404(Recipe, pk=pk)
    if request.method == 'POST':
        form = RecipeForm(request.POST, request.FILES, instance=recipe)
        if form.is_valid():
            form.save()
            return redirect('recipe-detail', pk=recipe.pk)  
        form = RecipeForm(instance=recipe)
    return render(request, 'recipes/recipe_edit.html', {'form': form, 'recipe': recipe})
def logoutview(request):
    logout(request)
    return redirect('home')  

def add_recipe(request):
    if request.method == 'POST':
        recipe_name = request.POST.get('recipe-name')
        course_type = request.POST.get('course-type')
        image_url = request.POST.get('image-url')
        description = request.POST.get('description')
        ingredient_names = request.POST.getlist('ingredient-name[]')
        quantities = request.POST.getlist('quantity[]')
        instructions = request.POST.getlist('instruction-step[]')

        
        if not (image_url.startswith('/images/') or image_url.startswith('recipes/images/')):
            messages.error(request, "Please enter a valid image URL from /images/ or recipes/images/ folder.")
            return render(request, 'recipes/add_recipe.html')

       
        course_type_map = {
            'main-course': 1,
            'soup': 2,
            'appetizer': 3,
            'dessert': 4,
        }
        root_category_id = course_type_map.get(course_type)
        if not root_category_id:
            messages.error(request, "Invalid course type selected.")
            return render(request, 'recipes/add_recipe.html')

        from .models import RootCategory
        try:
            root_category = RootCategory.objects.get(id=root_category_id)
        except RootCategory.DoesNotExist:
            messages.error(request, "Selected course type does not exist in the database.")
            return render(request, 'recipes/add_recipe.html')

        ingredients = "\n".join(
            f"{name.strip()} - {qty.strip()}" for name, qty in zip(ingredient_names, quantities)
        )
        instructions_text = "\n".join(step.strip() for step in instructions)

        Recipe.objects.create(
            title=recipe_name,
            root_category=root_category,
            image_url=image_url,
            description=description,
            ingredients=ingredients,
            instructions=instructions_text,
        )

        messages.success(request, "Recipe added successfully!")
        return redirect('recipe_admin')

    elif request.method == 'GET':
        return render(request, 'recipes/add_recipe.html')
    else:
        return redirect('recipe_admin') 
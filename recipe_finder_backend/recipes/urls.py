from django.urls import path
from .views import (
    # Template Views
    HomeView, RecipeListView, RecipeDetailView, ProfileView,
    CuisineListView, SubCategoryListView, RootCategoryListView,
    EditRecipeView, DeleteRecipeView,
    LoginPageView, SignupPageView,
    MainDishView, UserSoupView, RecipeAdminView, SoupView, EditProfileView, AddRecipeView, AppetizerView, DessertView, UserAppetizersView, UserDessertView, UserMainDishView, MexicanView, ItalianView, IndianView, EgyptianView,
    IndexView, toggle_favorite,
    signup_view,
    login_view, recipe_edit,logoutview,
    add_recipe
)
from django.conf import settings
from django.conf.urls.static import static

page_patterns = [
    path('', HomeView.as_view(), name='home'),
    path('recipes/<int:pk>/edit/', EditRecipeView.as_view(), name='recipe_edit'),
    path('recipes/<int:pk>/delete/', DeleteRecipeView.as_view(), name='recipe_delete'),
    path('recipes/', RecipeListView.as_view(), name='recipe-list'),
    path('recipes/<int:pk>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('cuisines/', CuisineListView.as_view(), name='cuisine-list'),
    path('subcategories/', SubCategoryListView.as_view(), name='subcategory-list'),
    path('categories/', RootCategoryListView.as_view(), name='category-list'),
    path('login/', login_view, name='login'),
    path('signup/', signup_view, name='signup'),
    path('main_dish/', MainDishView.as_view(), name='main_dish'),
    path('recipe_admin/', RecipeAdminView.as_view(), name='recipe_admin'),
    path('soup/', SoupView.as_view(), name='soup'),
    path('edit_profile/', EditProfileView.as_view(), name='edit_profile'),
    path('add_recipe/', add_recipe, name='add_recipe'),
    path('appetizer/', AppetizerView.as_view(), name='appetizer'),
    path('dessert/', DessertView.as_view(), name='dessert'),
    path('User_Appetizers/', UserAppetizersView.as_view(), name='user_appetizers'),
    path('User_Soup/', UserSoupView.as_view(), name='user_soup'),
    path('User_Dessert/', UserDessertView.as_view(), name='user_dessert'),
    path('user_main_dish/', UserMainDishView.as_view(), name='user_main_dish'),
    path('mexican/', MexicanView.as_view(), name='mexican'),
    path('favorite/<int:recipe_id>/', toggle_favorite, name='toggle_favorite'),
    path('italian/', ItalianView.as_view(), name='italian'),
    path('indian/', IndianView.as_view(), name='indian'),
    path('egyptian/', EgyptianView.as_view(), name='egyptian'),
    path('index/', IndexView.as_view(), name='index'),
    path('recipes/<int:pk>/edit/', EditRecipeView.as_view(), name='recipe_edit'),
    path('logout/', logoutview, name='logout'),


    
]
urlpatterns = page_patterns
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = page_patterns

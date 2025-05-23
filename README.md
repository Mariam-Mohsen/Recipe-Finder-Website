# Recipe Finder Website

Recipe Finder is a full-stack Django web application that helps users explore and manage a variety of recipes. The system supports both regular users and admin roles, offering features for browsing, saving, and managing recipes categorized by cuisine and dish type.

## Features

### User Features
- User registration and login with role selection (user or admin)
- Browse recipes by cuisine: Egyptian, Italian, Indian, Mexican
- Filter recipes by category: Main Dish, Soup, Appetizers, Dessert
- Save recipes as favorites
- Edit user profile and upload profile photo

### Admin Features
- Secure login with admin ID verification
- Add, edit, and delete recipes
- Manage recipe categories and cuisines
- View and manage users and their favorite recipes

## Technologies Used

| Layer     | Technology                      |
|-----------|----------------------------------|
| Backend   | Django (Python)                 |
| Database  | SQL Server (Windows Authentication) |
| Frontend  | HTML, CSS, JavaScript          |
| Media     | Django `ImageField` for photo uploads |
| Auth      | Django sessions with custom user roles |

## Project Structure

recipe_finder/
├── recipes/           
│   ├── models.py
│   ├── views.py
│   ├── templates/
│   └── static/
├── media/                   
├── manage.py




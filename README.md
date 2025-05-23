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

## Going Through the Website

This section provides a visual walkthrough of the key features and pages in the Recipe Finder website.

---

### Homepage
![Homepage](screenshots/Home.png)

The homepage welcomes users with a clean interface. It allows browsing by cuisine and category, encouraging exploration through an intuitive layout.

---

### User Page
![User Profile](screenshots/User.png)

The profile page enables users to manage their personal information, update profile photos, and view saved favorite recipes.

---

### Admin Dashboard
![Admin Dashboard](screenshots/Admin.png)

The admin dashboard is restricted to admin users. It provides full control over managing recipes, users, and recipe categories or cuisines.

---

## Website in Action

Below are short preview clips demonstrating the website’s main functionalities.

### User Flow
[![User Flow Preview](screenshots/User.png)](screenshots/user.mp4)

This demo shows a user navigating the site, exploring various recipes, and saving some to their favorites list.

---

### Cuisine Navigation
[![Cuisine Navigation Preview](screenshots/Cusines - frame at 0m0s.png)](screenshots/Cuisines.mp4)

This video showcases how a user can switch between cuisines such as Egyptian, Indian, and Italian, and browse the corresponding recipes.

---







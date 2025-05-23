from pathlib import Path
import os
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = True


SESSION_COOKIE_AGE = 1209600  
SESSION_COOKIE_SECURE = False  
SESSION_COOKIE_HTTPONLY = True
SESSION_SAVE_EVERY_REQUEST = True  

SECRET_KEY = 'fff'

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

DATABASES = {
    'default': {
        'ENGINE': 'mssql',
        'NAME': 'RecipeFinderDB',
        'HOST': 'NONO\\FARIDA',
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server',
            'trusted_connection': 'yes',
        },
    }
}

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'recipes',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'recipe_finder_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'recipes' / 'templates',
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

STATIC_URL = 'static/'


MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

STATICFILES_DIRS = [BASE_DIR / "recipes"/"static",]

SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = False  

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

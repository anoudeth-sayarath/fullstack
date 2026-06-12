import os
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-production-ready-real-world-semantic-routing-key'
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'accounts',
    'posts',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Top priority cross-origin boundary controller
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'core.middleware.PerformanceMonitorMiddleware', # Custom performance logging metric
]

ROOT_URLCONF = 'core.urls'
WSGI_APPLICATION = 'core.wsgi.application'

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

#  MYSQL PRODUCTION DATABASE ENGINE
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'media_post_db',
        'USER': 'root',
        'PASSWORD': '12345678',  # Change to your local MySQL connection password
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

#  MEDIA FILE ARCHIVE ARCHITECTURE
STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

#  ADVANCED FILE SIZE BUFFER CONSTRAINTS (Protects memory from large payload floods)
FILE_UPLOAD_MAX_MEMORY_SIZE = 2621440  # 2.5 MB chunk threshold before writing to temporary storage disk
DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800  # Strict 50 MB upper cap constraint on incoming Form-Data body arrays
#  FRONTEND GLUE: Resolves security blocks between Vite/CRA and Django
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite standard port
    "http://localhost:3000",  # Create React App standard port
]

#  ADVANCED ACCESS CONTROL & RATE LIMIT TIERS
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',      # Protection layer against malicious scraper web-bots
        'user': '1000/hour',    # Scalable production limit for standard authenticated application clients
        'burst': '60/minute',   # Custom view limit metric to drop spam posts
    }
}

#  INFINITE LIFETIME JWT TOKENS CONFIGURATION (100 Years)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=365 * 100),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=365 * 100),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}
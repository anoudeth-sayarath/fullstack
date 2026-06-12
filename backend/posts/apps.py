from django.apps import AppConfig

class PostsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'posts'

    def ready(self):
        # Import User only when Django is ready to avoid AppRegistryNotReady errors
        from django.contrib.auth.models import User
        # Your signal or initialization code here
        pass
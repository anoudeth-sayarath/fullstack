from rest_framework import serializers
from .models import Post
from accounts.serializers import UserSerializer

class PostSerializer(serializers.ModelSerializer):
    author_details = UserSerializer(source='author', read_only=True)
    id = serializers.UUIDField(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'image', 'video', 'created_at', 'author_details']
        read_only_fields = ['id', 'created_at', 'author_details']
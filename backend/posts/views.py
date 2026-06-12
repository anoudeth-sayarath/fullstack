from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.throttling import ScopedRateThrottle
from django.http import Http404
from .models import Post
from .serializers import PostSerializer

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user

class GlobalPostListView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    # ANTI-SPAM THROTTLING: Restricts creation to 60 requests/minute
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'burst'

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class UserPostViewSet(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAuthorOrReadOnly()]

    def get_object(self):
        username_handle = self.kwargs.get('username')
        post_uuid = self.kwargs.get('post_id')

        if username_handle.startswith('@'):
            username_handle = username_handle[1:]

        try:
            obj = Post.objects.get(
                author__username__iexact=username_handle,
                id=post_uuid
            )
        except Post.DoesNotExist:
            raise Http404("Targeted resource entry missing under requested workspace stream profile.")

        # Enforce object-level permissions (IsAuthorOrReadOnly)
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_update(self, serializer):
        instance = self.get_object()
        # Retain existing media if no new file was uploaded
        image = self.request.FILES.get('image', instance.image)
        video = self.request.FILES.get('video', instance.video)
        serializer.save(image=image, video=video)

    def perform_destroy(self, instance):
        # Optional: delete files from disk too
        if instance.image:
            instance.image.delete(save=False)
        if instance.video:
            instance.video.delete(save=False)
        instance.delete()
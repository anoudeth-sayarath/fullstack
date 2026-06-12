from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profiles

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profiles
        fields = ['bio', 'avatar']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'profile', 'access', 'refresh']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': False, 'allow_blank': True}
        }

    def to_internal_value(self, data):
        internal_data = data.copy() if hasattr(data, 'copy') else data
        if 'profile' not in internal_data:
            profile_dict = {}
            if 'profile.bio' in internal_data:
                profile_dict['bio'] = internal_data.get('profile.bio')
            if 'profile.avatar' in internal_data:
                profile_dict['avatar'] = internal_data.get('profile.avatar')
            if profile_dict:
                internal_data['profile'] = profile_dict
        return super().to_internal_value(internal_data)

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        password = validated_data.pop('password')
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', '')
        )
        user.set_password(password)
        user.save()

        profile = user.profile
        profile.bio = profile_data.get('bio', '')
        if 'avatar' in profile_data:
            profile.avatar = profile_data['avatar']
        profile.save()

        refresh = RefreshToken.for_user(user)
        user.access = str(refresh.access_token)
        user.refresh = str(refresh)
        return user

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if hasattr(instance, 'access'):
            data['access'] = instance.access
        if hasattr(instance, 'refresh'):
            data['refresh'] = instance.refresh
        return data
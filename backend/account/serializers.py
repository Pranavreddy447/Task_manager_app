from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import re
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate(self, attrs):
        username = attrs.get('username')
        email = attrs.get('email')
        password = attrs.get('password')
        
        if User.objects.filter(username = username).exists():
            raise serializers.ValidationError("User name already exists!!")
        
        if User.objects.filter(username = email).exists():
            raise serializers.ValidationError("Email already exists!!")
        
        if len(password) < 8:
            raise serializers.ValidationError("Password must be atleast 8 character long...")
        if not re.search(r'[A-Z]', password):
            raise serializers.ValidationError({"password": "Password must contain at least one uppercase letter"})
        if not re.search(r'[a-z]', password):
            raise serializers.ValidationError({"password": "Password must contain at least one lowercase letter"})
        if not re.search(r'[0-9]', password):
            raise serializers.ValidationError({"password": "Password must contain at least one digit"})
        if not re.search(r'[\W_]', password):  # special char or underscore
            raise serializers.ValidationError({"password": "Password must contain at least one special character"})

        return attrs
        

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user
    
class LoginSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(username=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_active:
            raise serializers.ValidationError("User is inactive")

        # If user is authenticated, return the token pair
        data = super().validate(attrs)
        data['user'] = {
            "id": user.id,
            "email": user.email,
            "name": user.get_full_name()
        }
        print(data["access"])
        return data

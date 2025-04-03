from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, ContactViewSet
from .auth import CustomAuthToken, RegisterView

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'contact', ContactViewSet, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', CustomAuthToken.as_view(), name='api_token_auth'),
    path('auth/register/', RegisterView.as_view(), name='api_register'),
] 
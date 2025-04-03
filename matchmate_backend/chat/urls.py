from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConversationViewSet, MessageViewSet, send_message

# Create a router for conversations
router = DefaultRouter()
router.register(r'conversations', ConversationViewSet, basename='conversation')

# Instead of using a nested router, define the message views directly
urlpatterns = [
    # Include the conversation router URLs
    path('', include(router.urls)),
    
    # Add direct message sending endpoint
    path('conversations/<int:conversation_pk>/send_message/', send_message, name='send-message'),
    
    # Define message endpoints directly
    path('conversations/<int:conversation_pk>/messages/', 
         MessageViewSet.as_view({'get': 'list'}), 
         name='message-list'),
    path('conversations/<int:conversation_pk>/messages/<int:pk>/', 
         MessageViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update'}), 
         name='message-detail'),
    path('conversations/<int:conversation_pk>/messages/<int:pk>/mark_read/', 
         MessageViewSet.as_view({'patch': 'mark_read'}), 
         name='message-mark-read'),
] 
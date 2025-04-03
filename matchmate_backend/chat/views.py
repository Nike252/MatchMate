from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from profiles.models import Profile

# Create your views here.

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            user_profile = self.request.user.profile
            # Get conversations where the current user is a participant
            conversations = Conversation.objects.filter(participants=user_profile).distinct()
            
            # Create a set to track user IDs we've already seen
            seen_user_ids = set()
            unique_conversations = []
            
            # Filter out duplicate conversations with the same participants
            for conv in conversations:
                # Get all participants excluding the current user
                other_participants = conv.participants.exclude(user=self.request.user)
                
                # If there are no other participants, skip this conversation
                if not other_participants.exists():
                    continue
                    
                # Get the first other participant's ID
                other_user_id = other_participants.first().user.id
                
                # If we haven't seen this user before, add the conversation
                if other_user_id not in seen_user_ids:
                    seen_user_ids.add(other_user_id)
                    unique_conversations.append(conv)
            
            # Log for debugging
            print(f"User {self.request.user.username} has {len(unique_conversations)} unique conversations")
            for conv in unique_conversations:
                participants = conv.participants.all()
                print(f"Conversation {conv.id} participants: {[p.user.username for p in participants]}")
                
            # Return a queryset containing only unique conversations
            conv_ids = [conv.id for conv in unique_conversations]
            return Conversation.objects.filter(id__in=conv_ids)
        except Exception as e:
            print(f"Error in get_queryset: {str(e)}")
            # Return empty queryset instead of raising error
            return Conversation.objects.none()

    def create(self, request, *args, **kwargs):
        try:
            print(f"Creating conversation with data: {request.data}")
            other_user_id = request.data.get('other_user_id')
            if not other_user_id:
                return Response(
                    {'error': 'other_user_id is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get other user's profile
            try:
                other_profile = Profile.objects.get(user_id=other_user_id)
            except Profile.DoesNotExist:
                return Response(
                    {'error': f'Profile for user ID {other_user_id} not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Get current user's profile
            try:
                user_profile = request.user.profile
            except Profile.DoesNotExist:
                return Response(
                    {'error': 'Your profile is not set up properly'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if it's the same user
            if user_profile.user.id == other_profile.user.id:
                return Response(
                    {'error': 'Cannot create a conversation with yourself'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            print(f"Creating conversation between users: {user_profile.user.username} (ID: {user_profile.user.id}) and {other_profile.user.username} (ID: {other_profile.user.id})")

            # Check if conversation already exists
            existing_conversations = Conversation.objects.filter(participants=user_profile).filter(participants=other_profile)
            
            if existing_conversations.exists():
                existing_conversation = existing_conversations.first()
                print(f"Found existing conversation with ID: {existing_conversation.id}")
                
                # Double-check participants
                participants = existing_conversation.participants.all()
                participant_usernames = [p.user.username for p in participants]
                print(f"Participants: {participant_usernames}")
                
                serializer = self.get_serializer(existing_conversation)
                return Response(serializer.data)

            # Create new conversation
            conversation = Conversation.objects.create()
            conversation.participants.add(user_profile, other_profile)
            print(f"Created new conversation with ID: {conversation.id}")
            
            # Verify participants were added correctly
            participants = conversation.participants.all()
            participant_usernames = [p.user.username for p in participants]
            print(f"New conversation participants: {participant_usernames}")
            
            serializer = self.get_serializer(conversation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error creating conversation: {str(e)}")
            return Response(
                {'error': f'Failed to create conversation: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        try:
            conversation = self.get_object()
            messages = conversation.messages.all()
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error getting messages: {str(e)}")
            return Response(
                {'error': f'Failed to get messages: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'head', 'options']  # Explicitly define allowed methods

    def get_queryset(self):
        try:
            conversation_id = self.kwargs.get('conversation_pk')
            print(f"Getting messages for conversation {conversation_id}")
            return Message.objects.filter(conversation_id=conversation_id)
        except Exception as e:
            print(f"Error in MessageViewSet.get_queryset: {str(e)}")
            return Message.objects.none()

    def create(self, request, *args, **kwargs):
        """
        Create a new message in the specified conversation.
        """
        try:
            # Extract the conversation ID from the URL
            conversation_pk = self.kwargs.get('conversation_pk')
            print(f"Creating message in conversation {conversation_pk}")
            print(f"Request method: {request.method}")
            print(f"Request data: {request.data}")
            print(f"Request user: {request.user.username}")
            
            # Get the conversation or return 404
            try:
                conversation = Conversation.objects.get(id=conversation_pk)
            except Conversation.DoesNotExist:
                return Response(
                    {'error': f'Conversation with ID {conversation_pk} not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Check if the user is part of this conversation
            if not conversation.participants.filter(user=request.user).exists():
                return Response(
                    {'error': 'You are not a participant in this conversation'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Validate the message content
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                print(f"Message validation errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # Save the message
            try:
                message = serializer.save(
                    conversation=conversation,
                    sender=request.user.profile
                )
                print(f"Successfully created message with ID {message.id}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f"Error saving message: {str(e)}")
                return Response(
                    {'error': f'Failed to save message: {str(e)}'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Exception as e:
            print(f"Unexpected error in MessageViewSet.create: {str(e)}")
            return Response(
                {'error': f'Failed to create message: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['patch'])
    def mark_read(self, request, pk=None, conversation_pk=None):
        try:
            message = self.get_object()
            message.is_read = True
            message.save()
            return Response({'status': 'message marked as read'})
        except Exception as e:
            print(f"Error marking message as read: {str(e)}")
            return Response(
                {'error': f'Failed to mark message as read: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Function-based view for sending messages - direct approach
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_message(request, conversation_pk):
    print(f"send_message view called with method: {request.method}")
    print(f"Conversation ID: {conversation_pk}")
    print(f"Request data: {request.data}")
    
    try:
        # Get the conversation or return 404
        conversation = get_object_or_404(Conversation, id=conversation_pk)
        
        # Check if the user is part of this conversation
        if not conversation.participants.filter(user=request.user).exists():
            return Response(
                {'error': 'You are not a participant in this conversation'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Validate the message content
        serializer = MessageSerializer(data=request.data)
        if not serializer.is_valid():
            print(f"Message validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Save the message
        message = serializer.save(
            conversation=conversation,
            sender=request.user.profile
        )
        print(f"Successfully created message with ID {message.id}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"Error in send_message: {str(e)}")
        return Response(
            {'error': f'Failed to send message: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

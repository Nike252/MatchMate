from rest_framework import serializers
from .models import Conversation, Message
from profiles.serializers import ProfileSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'content', 'created_at', 'is_read', 'sender']
        read_only_fields = ['created_at', 'is_read']

class ConversationSerializer(serializers.ModelSerializer):
    participants = ProfileSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    other_participant = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'other_participant', 'created_at', 'updated_at', 'last_message', 'unread_count']
        read_only_fields = ['created_at', 'updated_at']

    def get_last_message(self, obj):
        last_message = obj.messages.first()
        if last_message:
            return MessageSerializer(last_message).data
        return None

    def get_unread_count(self, obj):
        user_profile = self.context['request'].user.profile
        return obj.messages.filter(is_read=False).exclude(sender=user_profile).count()
        
    def get_other_participant(self, obj):
        """Return the participant that is not the current user"""
        current_user = self.context['request'].user
        for participant in obj.participants.all():
            if participant.user.id != current_user.id:
                return ProfileSerializer(participant).data
        return None 
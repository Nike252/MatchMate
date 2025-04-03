from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Profile, Interest, Contact
from .serializers import ProfileSerializer, ContactSerializer

# Create your views here.

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['DELETE'])
    def delete_profile(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
            # Delete the profile
            profile.delete()
            # Delete the user as well
            request.user.delete()
            return Response({"detail": "Profile deleted successfully"}, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def create(self, request, *args, **kwargs):
        print("Received data:", request.data)  # Debug print
        
        # Check if user already has a profile
        if Profile.objects.filter(user=request.user).exists():
            return Response(
                {"detail": "Profile already exists for this user"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                self.perform_create(serializer)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print("Error creating profile:", str(e))  # Debug print
                return Response(
                    {"detail": f"Error creating profile: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            print("Validation errors:", serializer.errors)  # Debug print
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def update_profile(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def potential_matches(self, request):
        # Get all profiles except the current user's
        matches = Profile.objects.exclude(user=request.user)
        
        # Get the user's profile
        user_profile = Profile.objects.filter(user=request.user).first()
        
        # Only apply filters if user has a profile and preferences
        if user_profile:
            # Apply filters only if they are set in the request query params
            age_min = request.query_params.get('age_min')
            age_max = request.query_params.get('age_max')
            if age_min and age_max:
                matches = matches.filter(age__gte=age_min, age__lte=age_max)
            
            religion = request.query_params.get('religion')
            if religion:
                matches = matches.filter(religion=religion)
            
            marital_status = request.query_params.get('marital_status')
            if marital_status:
                matches = matches.filter(marital_status=marital_status)
            
            education = request.query_params.get('education')
            if education:
                matches = matches.filter(education=education)
            
            location = request.query_params.get('location')
            if location:
                matches = matches.filter(location=location)
        
        serializer = self.get_serializer(matches, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def express_interest(self, request, pk=None):
        try:
            # Get the target profile by user ID instead of profile ID
            target_profile = get_object_or_404(Profile, user_id=pk)
            
            if target_profile.user == request.user:
                return Response(
                    {"detail": "You cannot express interest in your own profile"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if interest already exists
            if Interest.objects.filter(sender=request.user, receiver=target_profile.user).exists():
                # Instead of error, return success with already_expressed flag
                return Response(
                    {
                        "detail": "You have already expressed interest in this profile",
                        "already_expressed": True,
                        "user_id": target_profile.user.id,
                        "user_name": target_profile.user.first_name
                    },
                    status=status.HTTP_200_OK
                )
            
            # Create new interest
            Interest.objects.create(
                sender=request.user,
                receiver=target_profile.user
            )
            
            return Response(
                {
                    "detail": "Interest expressed successfully",
                    "already_expressed": False,
                    "user_id": target_profile.user.id,
                    "user_name": target_profile.user.first_name
                },
                status=status.HTTP_201_CREATED
            )
            
        except Profile.DoesNotExist:
            return Response(
                {"detail": "Target profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "Your message has been sent successfully. We'll get back to you soon."},
            status=status.HTTP_201_CREATED
        )

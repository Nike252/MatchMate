from django.db import models
from django.contrib.auth.models import User

class Interest(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interests_sent')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interests_received')
    created_at = models.DateTimeField(auto_now_add=True)
    is_accepted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('sender', 'receiver')

    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username}"

class Profile(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    MARITAL_STATUS_CHOICES = [
        ('NEVER_MARRIED', 'Never Married'),
        ('DIVORCED', 'Divorced'),
        ('WIDOWED', 'Widowed'),
        ('AWAITING_DIVORCE', 'Awaiting Divorce'),
    ]
    
    EDUCATION_CHOICES = [
        ('HIGH_SCHOOL', 'High School'),
        ('BACHELORS', 'Bachelor\'s Degree'),
        ('MASTERS', 'Master\'s Degree'),
        ('DOCTORATE', 'Doctorate'),
        ('OTHER', 'Other'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # Profile Picture
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    
    # Personal Information
    age = models.IntegerField()
    height = models.DecimalField(max_digits=5, decimal_places=2)  # in cm
    religion = models.CharField(max_length=100)
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS_CHOICES)
    education = models.CharField(max_length=20, choices=EDUCATION_CHOICES)
    occupation = models.CharField(max_length=100)
    income = models.DecimalField(max_digits=12, decimal_places=2)  # annual income
    location = models.CharField(max_length=200)
    bio = models.TextField(blank=True)
    
    # Partner Preferences
    preferred_age_min = models.IntegerField()
    preferred_age_max = models.IntegerField()
    preferred_height_min = models.DecimalField(max_digits=5, decimal_places=2)
    preferred_height_max = models.DecimalField(max_digits=5, decimal_places=2)
    preferred_religion = models.CharField(max_length=100)
    preferred_marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS_CHOICES)
    preferred_education = models.CharField(max_length=20, choices=EDUCATION_CHOICES)
    preferred_location = models.CharField(max_length=200)
    preferred_income_min = models.DecimalField(max_digits=12, decimal_places=2)
    preferred_income_max = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Additional Information
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"

class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.subject}"

    class Meta:
        ordering = ['-created_at']

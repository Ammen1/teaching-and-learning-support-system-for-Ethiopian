from rest_framework import serializers  # Importing serializers from rest_framework
from account.models import User  # Importing User model from accounts app
from .models import Program, Course, CourseAllocation, Upload, UploadVideo  # Importing models from this app

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class ProgramSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)

    class Meta:
        model = Program
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
   """
   Serializer class for User model.
   """
   class Meta:
       model = User  # Set the model as User
       fields = "__all__"  # Include all fields

class CourseAllocationSerializer(serializers.ModelSerializer):
   """
   Serializer class for CourseAllocation model.
   """
   courses = serializers.PrimaryKeyRelatedField(
       queryset=Course.objects.all().order_by("level"),  # Set queryset for courses
       many=True,  # Allow multiple courses
       read_only=False,  # Allow writing to the field
   )
   lecturer = serializers.PrimaryKeyRelatedField(
       queryset=User.objects.filter(is_lecturer=True),  # Filter users to only include lecturers
       write_only=True,  # Don't allow reading the field
   )

   class Meta:
       model = CourseAllocation  # Set the model as CourseAllocation
       fields = ["lecturer", "courses"]  # Include only these fields

class UploadFormFileSerializer(serializers.ModelSerializer):
   """
   Serializer class for Upload model (file type).
   """
   class Meta:
       model = Upload  # Set the model as Upload
       fields = (
           "title",  # Include title field
           "file",  # Include file field
       )

class UploadFormVideoSerializer(serializers.ModelSerializer):
   """
   Serializer class for Upload model (video type).
   """
   class Meta:
       model = UploadVideo  # Set the model as UploadVideo
       fields = (
           "title",  # Include title field
           "video",  # Include video field
       )
       
       


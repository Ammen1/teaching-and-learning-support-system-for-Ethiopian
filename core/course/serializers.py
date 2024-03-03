from rest_framework import serializers  
from account.models import User  
from .models import Program, Course, CourseAllocation, Upload, UploadVideo 

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
       model = User  
       fields = "__all__"  


class CourseAllocationSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True)
    lecturer = UserSerializer()

    class Meta:
        model = CourseAllocation
        fields = ["lecturer", "courses"] 

class UploadFormFileSerializer(serializers.ModelSerializer):
   """
   Serializer class for Upload model (file type).
   """
   class Meta:
       model = Upload  
       fields = (
           "title", 
           "file", 
       )

class UploadFormVideoSerializer(serializers.ModelSerializer):
   """
   Serializer class for Upload model (video type).
   """
   class Meta:
       model = UploadVideo  
       fields = (
           "title",  
           "video",  
       )
       
       



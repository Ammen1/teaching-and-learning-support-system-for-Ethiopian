from rest_framework import serializers  
from account.models import User  
from .models import Program, Course, CourseAllocation, Upload, UploadVideo 

class UploadVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadVideo
        fields = '__all__'
from rest_framework import serializers
from .models import Upload

class UploadFormFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Upload
        fields = '__all__'
        

class UploadFormVideoSerializer(serializers.ModelSerializer):
    # video = UploadVideoSerializer(many=True, source='uploadvideo_set')

    class Meta:
        model = UploadVideo
        fields = '__all__'
        
class LecturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  # You can customize this based on the fields you want to include        

class CourseSerializer(serializers.ModelSerializer):
    uploads = UploadFormFileSerializer(many=True, read_only=True)
    upload_videos = UploadFormVideoSerializer(many=True, source='uploadvideo_set')
    lecturer = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'  

    def get_lecturer(self, obj):
        lecturer = obj.lecturer
        if lecturer:
            return {
                'id': lecturer.id,
                'username': lecturer.username,
                'email': lecturer.email,
                'full_name': lecturer.get_full_name,
                'picture': lecturer.get_picture(), 
            }
        return None

    def get_payment_status(self, obj):
        latest_transaction = obj.transactions.order_by('-course_id').first()
        if latest_transaction:
            return latest_transaction.status
        return None


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  
        fields = "__all__"  

class CourseAllocationSerializer(serializers.ModelSerializer):
    courses = serializers.PrimaryKeyRelatedField(
       queryset=Course.objects.all().order_by("level"),
       many=True,
       read_only=False,
   )
    lecturer = serializers.PrimaryKeyRelatedField(
       queryset=User.objects.filter(is_lecturer=True),
       write_only=True,
   )

    class Meta:
        model = CourseAllocation
        fields = ["lecturer", "courses"] 

class ProgramSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)

    class Meta:
        model = Program
        fields = '__all__'





from rest_framework.response import Response
from rest_framework import status
from .models import Program, CourseAllocation, UploadVideo, Upload, Course
from .serializers import ProgramSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions
from .serializers import ProgramSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import RetrieveUpdateAPIView, DestroyAPIView, CreateAPIView, RetrieveAPIView
from .serializers import *
from django.shortcuts import get_object_or_404
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from .filters import ProgramFilter, CourseAllocationFilter
from rest_framework.views import APIView
from django.db.models import Count, OuterRef, Subquery, F, Func, Value
from rest_framework import generics
from .models import CourseAllocation
from .serializers import CourseAllocationSerializer
from .filters import CourseAllocationFilter
from django.db.models import CharField



class ProgramAPIView(CreateAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({"detail": f"{serializer.data['title']} program has been created."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def program_add(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)



class ProgramDetailView(RetrieveAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk' 


class ProgramEditView(RetrieveUpdateAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'
    
    

class ProgramDeleteView(DestroyAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticated]  # Adjust permissions as needed

    def delete(self, request, *args, **kwargs):
        program = self.get_object()
        title = program.title
        program.delete()
        return Response({"detail": f"Program {title} has been deleted."}, status=status.HTTP_204_NO_CONTENT)
   

# #####################
# Course views
# #####################

class CourseSingleAPIView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

    def retrieve(self, request, *args, **kwargs):
        course = self.get_object()
        files = Upload.objects.filter(course=course)
        videos = UploadVideo.objects.filter(course=course)
        lecturers = CourseAllocation.objects.filter(courses=course)

        course_serializer = CourseSerializer(course)
        files_serializer = UploadFormFileSerializer(files, many=True)
        videos_serializer = UploadFormVideoSerializer(videos, many=True)

        return Response({
            "course": course_serializer.data,
            "files": files_serializer.data,
            "videos": videos_serializer.data,
            "lecturers": lecturers.values(),  # Convert QuerySet to a list
        })


   
class CourseAddAPIView(generics.CreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Customize the creation process if needed
        serializer.save()
        

class CourseEditAPIView(generics.RetrieveUpdateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'



class CourseDeleteAPIView(generics.DestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        program_id = instance.program.id
        title = instance.title  
        self.perform_destroy(instance)
        return Response({"detail": f"Course {title} has been deleted."}, status=status.HTTP_204_NO_CONTENT)





class CourseAllocationAPIView(generics.ListAPIView):
    serializer_class = CourseAllocationSerializer
    filterset_class = CourseAllocationFilter
    lookup_field = 'id'  # Use 'id' as a string

    def get_queryset(self):
        user = self.request.user

        if user.is_lecturer:
            queryset = CourseAllocation.objects.filter(lecturer=user)
        else:
            queryset = CourseAllocation.objects.all()

        # Annotate the queryset with additional information about courses
        queryset = queryset.annotate(
            course_count=Count('courses'),
            course_ids=Subquery(
                Course.objects.filter(
                    slug=OuterRef('pk')
                ).values('id').annotate(
                    course_ids=Func(
                        F('id'),
                        Value(' - '),
                        function='GROUP_CONCAT',
                        distinct=True,
                        output_field=CharField()
                    ),
                ).values('course_ids')[:1],
  # Move output_field here
            )
        )

        return queryset



class EditAllocatedCourseAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        allocated = get_object_or_404(CourseAllocation, pk=pk)
        serializer =  CourseAllocationSerializer(allocated)
        return Response(serializer.data)

    def put(self, request, pk):
        allocated = get_object_or_404(CourseAllocation, pk=pk)
        serializer =  CourseAllocationSerializer(allocated, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeallocateCourseAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        course = get_object_or_404(CourseAllocation, pk=pk)
        course.delete()
        return Response({"message": "Successfully deallocated!"}, status=status.HTTP_204_NO_CONTENT)
    
    
@permission_classes([IsAuthenticated])
class CourseAllocationFilterAPIView(APIView):
    def get(self, request, *args, **kwargs):
        queryset = CourseAllocation.objects.all()  # Replace with your actual queryset
        filtered_queryset = CourseAllocationFilter(request.GET, queryset=queryset).qs
        serializer = CourseAllocationSerializer(filtered_queryset, many=True)
        return Response(serializer.data)    
    
    
    
# views.py

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Course
from reult.models import TakenCourse
# from .serializers import  CourseSerializer, TakenCourseSerializer
from account.serializers import StudentAddSerializer 
from account.models import Student
from cores.models import Semester


class CourseRegistrationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        student = get_object_or_404(Student, student__pk=request.user.id)
        ids = request.data.getlist('course_ids', [])

        for course_id in ids:
            course = get_object_or_404(Course, pk=course_id)
            obj = TakenCourse.objects.create(student=student, course=course)
            obj.save()

        return Response({"message": "Courses registered successfully!"}, status=status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):
        current_semester = Semester.objects.filter(is_current_semester=True).first()
        if not current_semester:
            return Response({"error": "No active semester found."}, status=status.HTTP_400_BAD_REQUEST)

        student = get_object_or_404(Student, student__id=request.user.id)
        taken_courses = TakenCourse.objects.filter(student__student__id=request.user.id)
        t = [i.course.pk for i in taken_courses]

        courses = (
            Course.objects.filter(
                program__pk=student.program.id,
                level=student.level,
                semester=current_semester,
            )
            .exclude(id__in=t)
            .order_by("year")
        )
        all_courses = Course.objects.filter(
            level=student.level, program__pk=student.program.id
        )

        no_course_is_registered = False
        all_courses_are_registered = False

        registered_courses = Course.objects.filter(level=student.level).filter(id__in=t)
        if registered_courses.count() == 0:
            no_course_is_registered = True

        if registered_courses.count() == all_courses.count():
            all_courses_are_registered = True

        total_first_semester_credit = 0
        total_sec_semester_credit = 0
        total_registered_credit = 0
        for i in courses:
            if i.semester == "First":
                total_first_semester_credit += int(i.credit)
            if i.semester == "Second":
                total_sec_semester_credit += int(i.credit)
        for i in registered_courses:
            total_registered_credit += int(i.credit)
        context = {
            "is_calender_on": True,
            "all_courses_are_registered": all_courses_are_registered,
            "no_course_is_registered": no_course_is_registered,
            "current_semester": current_semester,
            "courses": courses,
            "total_first_semester_credit": total_first_semester_credit,
            "total_sec_semester_credit": total_sec_semester_credit,
            "registered_courses": registered_courses,
            "total_registered_credit": total_registered_credit,
            "student": student,
        }
        return Response(context, status=status.HTTP_200_OK)
    
    
class CourseDropView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        student = get_object_or_404(Student, student__pk=request.user.id)
        ids = request.data.getlist('course_ids', [])

        for course_id in ids:
            course = get_object_or_404(Course, pk=course_id)
            obj = TakenCourse.objects.get(student=student, course=course)
            obj.delete()

        return Response({"message": "Courses dropped successfully!"}, status=status.HTTP_200_OK)
    


class UserCourseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if request.user.is_lecturer:
            courses = Course.objects.filter(allocated_course__lecturer__pk=request.user.id)
            serializer = CourseSerializer(courses, many=True)
            return Response({"courses": serializer.data})

        elif request.user.is_student:
            student = Student.objects.get(student__pk=request.user.id)
            taken_courses = TakenCourse.objects.filter(student__student__id=student.student.id)
            courses = Course.objects.filter(level=student.level, program__pk=student.program.id)

            student_serializer = StudentSerializer(student)
            taken_courses_serializer = TakenCourseSerializer(taken_courses, many=True)
            courses_serializer = CourseSerializer(courses, many=True)

            return Response({
                "student": student_serializer.data,
                "taken_courses": taken_courses_serializer.data,
                "courses": courses_serializer.data
            })

        else:
            return Response({"detail": "User is neither a lecturer nor a student."})



from .serializers import UploadFormFileSerializer
from django.contrib import messages


class FileUploadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        course = get_object_or_404(Course, slug=slug)
        serializer = UploadFormFileSerializer(data=request.data)

        if serializer.is_valid():
            obj = serializer.save(course=course)
            messages.success(
                request, (serializer.validated_data.get("title") + " has been uploaded.")
            )
            return Response({"message": "File uploaded successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, slug):
        return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)



from .serializers import UploadFormFileSerializer

class FileEditDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, slug, file_id):
        course = get_object_or_404(Course, slug=slug)
        return get_object_or_404(Upload, pk=file_id, course=course)

    def get(self, request, slug, file_id):
        file_instance = self.get_object(slug, file_id)
        serializer = UploadFormFileSerializer(file_instance)
        return Response(serializer.data)

    def post(self, request, slug, file_id):
        file_instance = self.get_object(slug, file_id)
        serializer = UploadFormFileSerializer(file_instance, data=request.data)

        if serializer.is_valid():
            serializer.save()
            messages.success(
                request, (serializer.validated_data.get("title") + " has been updated.")
            )
            return Response({"message": "File updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, slug, file_id):
        file_instance = self.get_object(slug, file_id)
        file_instance.delete()
        messages.success(request, (file_instance.title + " has been deleted."))
        return Response({"message": "File deleted successfully"}, status=status.HTTP_200_OK)
    
    
from .serializers import UploadFormVideoSerializer

class VideoUploadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, slug):
        return get_object_or_404(Course, slug=slug)

    def get(self, request, slug):
        course = self.get_object(slug)
        serializer = UploadFormVideoSerializer()
        return Response(
            {"title": "Video Upload", "form": serializer, "course": course},
        )

    def post(self, request, slug):
        course = self.get_object(slug)
        serializer = UploadFormVideoSerializer(data=request.data)

        if serializer.is_valid():
            obj = serializer.save(commit=False)
            obj.course = course
            obj.save()

            messages.success(
                request, (serializer.validated_data.get("title") + " has been uploaded.")
            )
            return Response({"message": "Video uploaded successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
        
from rest_framework.decorators import authentication_classes, permission_classes
@authentication_classes([])
@permission_classes([])
class VideoSingleAPIView(APIView):
    def get_object(self, slug, video_slug):
        course = get_object_or_404(Course, slug=slug)
        return get_object_or_404(UploadVideo, slug=video_slug, course=course)

    def get(self, request, slug, video_slug):
        video = self.get_object(slug, video_slug)
        serializer = UploadVideoSerializer(video)  # Adjust serializer as needed
        return Response(serializer.data)        
    
    
@authentication_classes([])
@permission_classes([])
class VideoEditAPIView(APIView):
    def get_object(self, slug, video_slug):
        course = get_object_or_404(Course, slug=slug)
        return get_object_or_404(UploadVideo, slug=video_slug, course=course)

    def get(self, request, slug, video_slug):
        video = self.get_object(slug, video_slug)
        serializer = UploadVideoSerializer(video)  # Adjust serializer as needed
        return Response(serializer.data)

    def put(self, request, slug, video_slug):
        video = self.get_object(slug, video_slug)
        serializer = UploadVideoSerializer(video, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)    
    

class VideoDeleteAPIView(APIView):
    def delete(self, request, slug, video_slug):
        video = get_object_or_404(UploadVideo, slug=video_slug)
        video.delete()

        messages.success(request, f'{video.title} has been deleted.')
        return redirect("course_detail", slug=slug)    
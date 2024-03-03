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



    
from django.db.models import Count, OuterRef, Subquery, F, Func, Value
from rest_framework import generics
from .models import CourseAllocation
from .serializers import CourseAllocationSerializer
from .filters import CourseAllocationFilter
from django.db.models import CharField


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
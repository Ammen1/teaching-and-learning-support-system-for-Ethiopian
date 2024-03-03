from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from account.models import Student
from cores.models import Session, Semester
from course.models import Course
from .models import TakenCourse, Result, FIRST, SECOND
from cores.serializers import SessionSerializer 

class AddScoreAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        current_session = Session.objects.filter(is_current_session=True).first()
        current_semester = Semester.objects.filter(
            is_current_semester=True, session=current_session
        ).first()

        if not current_session or not current_semester:
            return Response({"error": "No active semester found."}, status=status.HTTP_400_BAD_REQUEST)

        courses = Course.objects.filter(
            allocated_course__lecturer__pk=request.user.id
        ).filter(semester=current_semester)

        serializer = SessionSerializer(current_session)
        return Response({
            "current_session": serializer.data,
            "current_semester": current_semester.id,
            "courses": [course.id for course in courses]
        }, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        current_session = Session.objects.filter(is_current_session=True).first()
        current_semester = Semester.objects.filter(
            is_current_semester=True, session=current_session
        ).first()

        if not current_session or not current_semester:
            return Response({"error": "No active semester found."}, status=status.HTTP_400_BAD_REQUEST)

        student_id = request.data.get("student_id")
        course_id = request.data.get("course_id")
        score = request.data.get("score")

        if not student_id or not course_id or not score:
            return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = Student.objects.get(id=student_id)
            course = Course.objects.get(id=course_id)

            # Check if the student is registered for the course
            taken_course = TakenCourse.objects.filter(student=student, course=course).first()

            if not taken_course:
                return Response({"error": "Student is not registered for the course."}, status=status.HTTP_400_BAD_REQUEST)

            # Save the score to the TakenCourse model
            taken_course.score = score
            taken_course.save()

            return Response({"message": "Score added successfully!"}, status=status.HTTP_201_CREATED)

        except Student.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
        except Course.DoesNotExist:
            return Response({"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
from django.shortcuts import get_object_or_404
from django.urls import reverse_lazy
from .serializers import TakenCourseSerializer, ResultSerializer
from django.contrib import messages

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



class AddScoreForAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id, *args, **kwargs):
        current_session = Session.objects.get(is_current_session=True)
        current_semester = get_object_or_404(
            Semester, is_current_semester=True, session=current_session
        )
        courses = Course.objects.filter(
            allocated_course__lecturer__pk=request.user.id
        ).filter(semester=current_semester)
        course = Course.objects.get(pk=id)
        students = (
            TakenCourse.objects.filter(
                course__allocated_course__lecturer__pk=request.user.id
            )
            .filter(course__id=id)
            .filter(course__semester=current_semester)
        )
        serializer = TakenCourseSerializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, id, *args, **kwargs):
        current_session = Session.objects.get(is_current_session=True)
        current_semester = get_object_or_404(
            Semester, is_current_semester=True, session=current_session
        )

        ids = ()
        data = request.data.copy()
        for key in data.keys():
            ids = ids + (
                str(key),
            )  # gather all the all students id (i.e the keys) in a tuple

        for s in range(
            0, len(ids)
        ):  # iterate over the list of student ids gathered above
            student = TakenCourse.objects.get(id=ids[s])
            courses = (
                Course.objects.filter(level=student.student.level)
                .filter(program__pk=student.student.program.id)
                .filter(semester=current_semester)
            )  # all courses of a specific level in the current semester
            total_credit_in_semester = sum(int(i.credit) for i in courses)

            score = data.getlist(ids[s])  # get list of score for the current student
            assignment, mid_exam, quiz, attendance, final_exam = map(float, score)

            obj = TakenCourse.objects.get(pk=ids[s])  # get the current student data
            obj.assignment = assignment
            obj.mid_exam = mid_exam
            obj.quiz = quiz
            obj.attendance = attendance
            obj.final_exam = final_exam

            obj.total = obj.get_total(
                assignment=assignment,
                mid_exam=mid_exam,
                quiz=quiz,
                attendance=attendance,
                final_exam=final_exam,
            )
            obj.grade = obj.get_grade(total=obj.total)
            obj.point = obj.get_point(grade=obj.grade)
            obj.comment = obj.get_comment(grade=obj.grade)

            obj.save()

            gpa = obj.calculate_gpa(total_credit_in_semester)
            cgpa = obj.calculate_cgpa()

            Result.objects.update_or_create(
                student=student.student,
                semester=current_semester,
                session=current_session,
                level=student.student.level,
                defaults={"gpa": gpa, "cgpa": cgpa},
            )
            print(Result.objects.update_or_create(
                student=student.student,
                semester=current_semester,
                session=current_session,
                level=student.student.level,
                defaults={"gpa": gpa, "cgpa": cgpa},
            ))
        messages.success(request, "Successfully Recorded! ")
        return Response({"message": "Successfully Recorded!"}, status=status.HTTP_201_CREATED)


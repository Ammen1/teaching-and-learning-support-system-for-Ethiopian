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
from rest_framework.decorators import permission_classes
from account.serializers import StudentSerializer
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.template.loader import get_template
from reportlab.pdfgen import canvas
from io import BytesIO 
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Spacer
from reportlab.lib.pagesizes import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape, letter
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
)
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT, TA_CENTER, TA_RIGHT



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



class GradeResultAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        student = Student.objects.get(student__pk=request.user.id)
        courses = TakenCourse.objects.filter(student__student__pk=request.user.id).filter(
            course__level=student.level
        )
        student_serializer = StudentSerializer(student)

        results = Result.objects.filter(student__student__pk=request.user.id)

        result_set = set()

        for result in results:
            result_set.add(result.session)

        sorted_result = sorted(result_set)

        total_first_semester_credit = 0
        total_sec_semester_credit = 0
        for i in courses:
            if i.course.semester == "First":
                total_first_semester_credit += int(i.course.credit)
            if i.course.semester == "Second":
                total_sec_semester_credit += int(i.course.credit)

        previousCGPA = 0
        for i in results:
            previousLEVEL = i.level
            try:
                a = Result.objects.get(
                    student__student__pk=request.user.id,
                    level=previousLEVEL,
                    semester="Second",
                )
                previousCGPA = a.cgpa
                break
            except:
                previousCGPA = 0

        # Serialize the data
        courses_serializer = TakenCourseSerializer(courses, many=True)
        results_serializer = ResultSerializer(results, many=True)

        context = {
            "courses": courses_serializer.data,
            "results": results_serializer.data,
            "sorted_result": sorted_result,
            "student": student_serializer.data,
            "total_first_semester_credit": total_first_semester_credit,
            "total_sec_semester_credit": total_sec_semester_credit,
            "total_first_and_second_semester_credit": total_first_semester_credit
            + total_sec_semester_credit,
            "previousCGPA": previousCGPA,
        }

        return Response(context)


class AssessmentResultAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        student = Student.objects.get(student__pk=request.user.id)
        courses = TakenCourse.objects.filter(
            student__student__pk=request.user.id, course__level=student.level
        )
        result = Result.objects.filter(student__student__pk=request.user.id)

        # Serialize the data
        courses_serializer = TakenCourseSerializer(courses, many=True)
        result_serializer = ResultSerializer(result, many=True)

        # Accessing the full_name through the related User instance
        context = {
            "courses": courses_serializer.data,
            "result": result_serializer.data,
            "student": student.student.username,  # Adjust based on your actual model structure
        }

        return Response(context)
    



class ResultSheetPDFAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        current_semester = Semester.objects.get(is_current_semester=True)
        current_session = Session.objects.get(is_current_session=True)
        result = TakenCourse.objects.filter(course__pk=id)
        course = get_object_or_404(Course, id=id)
        no_of_pass = TakenCourse.objects.filter(course__pk=id, comment="PASS").count()
        no_of_fail = TakenCourse.objects.filter(course__pk=id, comment="FAIL").count()
        fname = (
            str(current_semester)
            + "_semester_"
            + str(current_session)
            + "_"
            + str(course)
            + "_resultSheet.pdf"
        )
        fname = fname.replace("/", "-")
        flocation = settings.MEDIA_ROOT + "/result_sheet/" + fname

        doc = SimpleDocTemplate(
            flocation,
            rightMargin=0,
            leftMargin=1 * cm,
            topMargin=0.3 * cm,
            bottomMargin=0,
        )
        styles = getSampleStyleSheet()
        styles.add(
            ParagraphStyle(name="ParagraphTitle", fontSize=11, fontName="FreeSansBold")
        )
        Story = [Spacer(1, 0.2)]
        style = styles["Normal"]

        print("\nsettings.MEDIA_ROOT", settings.MEDIA_ROOT)
        print("\nsettings.STATICFILES_DIRS[0]", settings.STATICFILES_DIRS[0])
       


        style = getSampleStyleSheet()
        normal = style["Normal"]
        normal.alignment = TA_CENTER
        normal.fontName = "Helvetica"
        normal.fontSize = 12
        normal.leading = 15
        title = (
            "<b> "
            + str(current_semester)
            + " Semester "
            + str(current_session)
            + " Result Sheet</b>"
        )
        title = Paragraph(title.upper(), normal)
        Story.append(title)
        Story.append(Spacer(1, 0.1 * inch))

        style = getSampleStyleSheet()
        normal = style["Normal"]
        normal.alignment = TA_CENTER
        normal.fontName = "Helvetica"
        normal.fontSize = 10
        normal.leading = 15
        title = "<b>Course lecturer: " + request.user.get_full_name + "</b>"
        title = Paragraph(title.upper(), normal)
        Story.append(title)
        Story.append(Spacer(1, 0.1 * inch))

        normal = style["Normal"]
        normal.alignment = TA_CENTER
        normal.fontName = "Helvetica"
        normal.fontSize = 10
        normal.leading = 15
        level = result.filter(course_id=id).first()
        title = "<b>Level: </b>" + str(level.course.level)
        title = Paragraph(title.upper(), normal)
        Story.append(title)
        Story.append(Spacer(1, 0.6 * inch))

        elements = []
        count = 0
        header = [("S/N", "ID NO.", "FULL NAME", "TOTAL", "GRADE", "POINT", "COMMENT")]

        table_header = Table(header, [inch], [0.5 * inch])
        table_header.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.green),
                    ("TEXTCOLOR", (1, 0), (-1, -1), colors.white),
                    ("TEXTCOLOR", (0, 0), (0, 0), colors.cyan),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("BOX", (0, 0), (-1, -1), 1, colors.black),
                ]
            )
        )
        Story.append(table_header)

        for student in result:
            data = [
                (
                    count + 1,
                    student.student.student.username.upper(),
                    Paragraph(
                        student.student.student.get_full_name.capitalize(), styles["Normal"]
                    ),
                    student.total,
                    student.grade,
                    student.point,
                    student.comment,
                )
            ]
            color = colors.black
            if student.grade == "F":
                color = colors.red
            count += 1

            t_body = Table(data, colWidths=[inch])
            t_body.setStyle(
                TableStyle(
                    [
                        ("INNERGRID", (0, 0), (-1, -1), 0.05, colors.black),
                        ("BOX", (0, 0), (-1, -1), 0.1, colors.black),
                    ]
                )
            )
            Story.append(t_body)

        Story.append(Spacer(1, 1 * inch))
        style_right = ParagraphStyle(
            name="right", parent=styles["Normal"], alignment=TA_RIGHT
        )
        tbl_data = [
            [
                Paragraph("<b>Date:</b>_____________________________", styles["Normal"]),
                Paragraph("<b>No. of PASS:</b> " + str(no_of_pass), style_right),
            ],
            [
                Paragraph(
                    "<b>Siganture / Stamp:</b> _____________________________",
                    styles["Normal"],
                ),
                Paragraph("<b>No. of FAIL: </b>" + str(no_of_fail), style_right),
            ],
        ]
        tbl = Table(tbl_data)
        Story.append(tbl)

        doc.build(Story)

        fs = FileSystemStorage(settings.MEDIA_ROOT + "/result_sheet")
        with fs.open(fname) as pdf:
            response = HttpResponse(pdf, content_type="application/pdf")
            response["Content-Disposition"] = "inline; filename=" + fname + ""
            return response
        return response



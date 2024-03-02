from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import SemesterSerializer
from .models import Session

from django.shortcuts import get_object_or_404

from .serializers import SessionSerializer
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def semester_add_view(request):
    serializer = SemesterSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        is_current_semester = data.get("is_current_semester")

        if is_current_semester:
            semester = data.get("semester")
            session_id = data.get("session")
            session = Session.objects.get(pk=session_id)

            try:
                if Semester.objects.get(semester=semester, session=session_id):
                    return Response(
                        {"error": f"{semester} semester in {session.session} session already exists."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except Semester.DoesNotExist:
                semesters = Semester.objects.all()
                sessions = Session.objects.all()

                if semesters:
                    for semester in semesters:
                        if semester.is_current_semester:
                            unset_semester = Semester.objects.get(is_current_semester=True)
                            unset_semester.is_current_semester = False
                            unset_semester.save()

                    for session in sessions:
                        if session.is_current_session:
                            unset_session = Session.objects.get(is_current_session=True)
                            unset_session.is_current_session = False
                            unset_session.save()

                    set_session = Session.objects.get(pk=session_id)
                    set_session.is_current_session = True
                    set_session.save()

                    serializer.save()
                    return Response(
                        {"message": "Semester added successfully."},
                        status=status.HTTP_201_CREATED
                    )

        serializer.save()
        return Response(
            {"message": "Semester added successfully."},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def session_list_view(request):
    """Show list of all sessions"""
    sessions = Session.objects.all().order_by("-is_current_session", "-session")
    serializer = SessionSerializer(sessions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def session_add_view(request):
    """Check request method, if POST we add session otherwise show empty form"""
    if request.method == "POST":
        serializer = SessionSerializer(data=request.data)
        if serializer.is_valid():
            is_current_session = serializer.validated_data.get("is_current_session", False)
            if is_current_session:
                sessions = Session.objects.filter(is_current_session=True)
                sessions.update(is_current_session=False)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response({"error": "Invalid data provided"}, status=status.HTTP_400_BAD_REQUEST)

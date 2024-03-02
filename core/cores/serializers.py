from rest_framework import serializers
from .models import NewsAndEvents, Session, Semester

# News and Events Serializer
class NewsAndEventsSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsAndEvents
        fields = ["title", "summary", "posted_as"]

class SessionSerializer(serializers.ModelSerializer):
    next_session_begins = serializers.DateField(
        input_formats=["%Y-%m-%dT%H:%M:%S.%fZ", "%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%d"]
    )

    class Meta:
        model = Session
        fields = ["session", "is_current_session", "next_session_begins"]


# Semester Serializer
class SemesterSerializer(serializers.ModelSerializer):
    next_semester_begins = serializers.DateTimeField(
        input_formats=["%Y-%m-%dT%H:%M:%S.%fZ", "%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%d"]
    )

    class Meta:
        model = Semester
        fields = ["semester", "is_current_semester", "session", "next_semester_begins"]

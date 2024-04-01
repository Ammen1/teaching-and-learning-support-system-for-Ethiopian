from django.contrib import admin
from django.contrib.auth.models import Group
from .models import Program, Course, CourseAllocation, Upload, UploadVideo

class UploadInline(admin.TabularInline):
    model = Upload
    extra = 1

class UploadVideoInline(admin.TabularInline):
    model = UploadVideo
    extra = 1

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    inlines = [UploadInline, UploadVideoInline]

@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    pass

@admin.register(CourseAllocation)
class CourseAllocationAdmin(admin.ModelAdmin):
    pass

admin.site.unregister(Group)  # Unregister the Group model since we're not using it

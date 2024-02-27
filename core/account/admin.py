from django.contrib import admin

# Register your models here.
from django.contrib import admin
from.models import UserAccount,TeacherProfile,StudentProfile
from django.contrib.auth.admin import UserAdmin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import UserAccount


class CustomUserAdmin(BaseUserAdmin):
    list_display = ('email', 'phone_number', 'full_name', 'is_active', 'is_admin', 'is_staff', 'is_superuser')
    search_fields = ('email', 'phone_number', 'full_name')
    list_filter = ('is_active', 'is_admin', 'is_staff', 'is_superuser', 'groups', 'user_permissions')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('full_name', 'phone_number', 'address', 'profile_pic', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_admin', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone_number', 'full_name', 'password1', 'password2'),
        }),
    )

    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)

    # Exclude non-editable fields like 'date_joined' from form
    readonly_fields = ('date_joined',)

admin.site.register(UserAccount, CustomUserAdmin)
admin.site.register(TeacherProfile)
admin.site.register(StudentProfile)

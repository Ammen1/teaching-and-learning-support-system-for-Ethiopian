from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission


# Create your models here.
def upload_to(instance, filename):
    return f'profile_pics/{filename}'

class UserAccountManager(BaseUserManager):
    def create_user(self, email, full_name, phone_number, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        if not full_name:
            raise ValueError("The Full Name field must be set")

        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
     
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 1)  # Assuming superusers have the role of 'Admin'

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password=password, **extra_fields)
class UserAccount(AbstractBaseUser, PermissionsMixin):
    ADMIN = 1
    STUDENT = 2
    TEACHER = 3

    ROLE_CHOICES = (
        (ADMIN, 'Admin'),
        (STUDENT, 'Student'),
        (TEACHER, 'Teacher')
    )

    email = models.EmailField(max_length=50, unique=True)
    phone_number = models.CharField(max_length=100, null=True, blank=True)
    full_name = models.CharField(max_length=200)
    address = models.CharField(max_length=200, blank=True)
    profile_pic = models.ImageField(upload_to=upload_to, null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, blank=True, null=True, default=2)
    is_admin=models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Add is_staff field
    is_superuser = models.BooleanField(default=False) 
   
    

    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        related_name='custom_user_accounts'
    )

    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        related_name='custom_user_accounts'
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name','phone_number']

    objects = UserAccountManager()

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, add_label):
        return True
    

class TeacherProfile(models.Model):
    user = models.OneToOneField('UserAccount', on_delete=models.CASCADE, related_name='teacher_profile')
    years_of_experience = models.PositiveIntegerField()
    job_role=models.CharField(max_length=100)
    about = models.CharField(max_length=500)


    def __str__(self):
           return f"{str(self.user.full_name)}'s Teacher Profile"

class StudentProfile(models.Model):
    user=models.OneToOneField('UserAccount',on_delete=models.CASCADE,related_name='student_profile')  
    highest_education=models.CharField(max_length=100)
    specialization=models.CharField(max_length=200,null=True)
    mother_name=models.CharField(max_length=100, null=True)
    father_name=models.CharField(max_length=100, null=True)
    city=models.CharField(max_length=100)
    state=models.CharField(max_length=100)
    pin=models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.full_name}'s Student Profile",self.id
    


        
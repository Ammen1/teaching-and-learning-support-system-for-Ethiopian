# Generated by Django 5.0.2 on 2024-03-04 10:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='level',
            field=models.CharField(choices=[('Primary', 'Primary'), ('Hight_School', 'Hight_School'), ('Bachloar', 'Bachloar Degree'), ('Master', 'Master Degree')], max_length=25, null=True),
        ),
    ]
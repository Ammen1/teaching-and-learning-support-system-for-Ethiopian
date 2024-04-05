# Generated by Django 4.2.11 on 2024-04-03 11:15

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('course', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChapaTransaction',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('trx_ref', models.CharField(blank=True, max_length=255, null=True)),
                ('amount', models.FloatField()),
                ('currency', models.CharField(default='ETB', max_length=25)),
                ('email', models.EmailField(max_length=254)),
                ('phone_number', models.CharField(max_length=25)),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('payment_title', models.CharField(default='Payment', max_length=255)),
                ('description', models.TextField()),
                ('status', models.CharField(choices=[('created', 'CREATED'), ('pending', 'PENDING'), ('success', 'SUCCESS'), ('failed', 'FAILED')], default='created', max_length=50)),
                ('response_dump', models.JSONField(blank=True, default=dict)),
                ('checkout_url', models.URLField(blank=True, null=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to='course.course')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
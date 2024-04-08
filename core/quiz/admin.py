from django import forms
from django.contrib import admin
from django.contrib.admin.widgets import FilteredSelectMultiple
from django.utils.translation import gettext_lazy as _

from .models import (
    Quiz,
    Progress,
    Question,
    MCQuestion,
    Choice,
    EssayQuestion,
    Sitting,
    UserAnswer,
)


class ChoiceInline(admin.TabularInline):
    model = Choice


class QuizAdminForm(forms.ModelForm):
    class Meta:
        model = Quiz
        exclude = []

    questions = forms.ModelMultipleChoiceField(
        queryset=Question.objects.all().select_subclasses(),
        required=False,
        label=_("Questions"),
        widget=FilteredSelectMultiple(verbose_name=_("Questions"), is_stacked=False),
    )

    def __init__(self, *args, **kwargs):
        super(QuizAdminForm, self).__init__(*args, **kwargs)
        if self.instance.pk:
            self.fields[
                "questions"
            ].initial = self.instance.question_set.all().select_subclasses()

    def save(self, commit=True):
        quiz = super(QuizAdminForm, self).save(commit=False)
        quiz.save()
        quiz.question_set.set(self.cleaned_data["questions"])
        self.save_m2m()
        return quiz


class QuizAdmin(admin.ModelAdmin):
    form = QuizAdminForm

    list_display = ("title",)
    # list_filter = ('category',)
    search_fields = (
        "description",
        "category",
    )


class MCQuestionAdmin(admin.ModelAdmin):
    list_display = ("content",)
    # list_filter = ('category',)
    fields = ("content", "figure", "quiz", "explanation", "choice_order")

    search_fields = ("content", "explanation")


    inlines = [ChoiceInline]


class ProgressAdmin(admin.ModelAdmin):
    search_fields = (
        "user",
        "score",
    )


class EssayQuestionAdmin(admin.ModelAdmin):
    list_display = ("content",)
    fields = ("content", "figure", "explanation")  # Exclude quiz field for now
    search_fields = ("content", "explanation")

    # Add the quiz field to the form
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields["quiz"] = forms.ModelMultipleChoiceField(
            queryset=Quiz.objects.all(),
            required=False,
            widget=FilteredSelectMultiple(verbose_name=_("Quizzes"), is_stacked=False),
        )
        return form

    # Override save method to handle quiz association
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        obj.quiz.set(form.cleaned_data["quiz"])

admin.site.register(EssayQuestion, EssayQuestionAdmin)


admin.site.register(Quiz, QuizAdmin)
admin.site.register(MCQuestion, MCQuestionAdmin)
admin.site.register(Progress, ProgressAdmin)

admin.site.register(Sitting)
admin.site.register(UserAnswer)
admin.site.register(Question)
admin.site.register(Choice)
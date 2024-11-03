from django.contrib import admin
from .models import CoverLetterTemplate
# Register your models here.
@admin.register(CoverLetterTemplate)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name', 'description', 'content')
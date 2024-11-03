from rest_framework import serializers
from .models import CoverLetterTemplate

# Serializer for the CoverLetterTemplate model
class CoverLetterTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoverLetterTemplate
        fields = ['id', 'name', 'content', 'description']
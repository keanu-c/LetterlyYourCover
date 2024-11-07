from rest_framework import serializers
from .models import CoverLetterTemplate, GenerationCount

# Serializer for the CoverLetterTemplate model
class CoverLetterTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoverLetterTemplate
        fields = ['id', 'name', 'content', 'description']

class GenerationCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = GenerationCount
        fields = ['count']
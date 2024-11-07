# Create your models here.
from django.db import models

class CoverLetterTemplate(models.Model):
    # Model for storing cover letter templates
    name = models.CharField(max_length=100)
    content = models.TextField(
        help_text="Template content. Use professional language and structure."
    )
    description = models.TextField(
        help_text="Brief description of the template's style or use case.",
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # String representation of the template
        return self.name

# Keep track of generation count
class GenerationCount(models.Model):
    count = models.PositiveIntegerField(default = 0)

    def __str__(self) -> str:
        return self.count
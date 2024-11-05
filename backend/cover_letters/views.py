# from django.shortcuts import render
# from django.conf import settings
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CoverLetterTemplate
from .serializers import CoverLetterTemplateSerializer
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')

class CoverLetterTemplateViewSet(viewsets.ModelViewSet):
    # ViewSet for viewing and editing templates
    queryset = CoverLetterTemplate.objects.all()
    serializer_class = CoverLetterTemplateSerializer

@api_view(['POST'])
def generate_cover_letter(request):
    """
    API view to generate a cover letter
    """
    # Get data from request
    resume_text = request.data.get('resume_text')
    job_posting = request.data.get('job_posting')
    template_id = request.data.get('template_id')
    
    # Validate inputs
    if not all ([resume_text, job_posting, template_id]):
        return Response ({
            'error': 'Please provide resume, job posting, and template'
        }, status = 400)
    
    try:
        # Get the template
        template = CoverLetterTemplate.objects.get(id=template_id)
        
        # Call OpenAI API
        response = openai.chat.completions.create(
            model = "gpt-3.5-turbo",
            temperature = 0.9,
            messages = [
                {
                    "role": "system",
                    "content": """You are a professional cover letter writer. 
                    Analyze the job posting and resume to create a compelling and personalized 
                    cover letter that matches the candidate's experience with 
                    the job requirements. 

                    Think about the culture of the organization you’re applying to.
                    The cover letter should focus on the future and what you want to do.
                    Start with the punch line — why this job is exciting to the applicant and 
                    what they bring to the table. You can make something up.

                    Make the cover letter 3-4 paragraphs and a little less than one page.

                    Do:
                    Have a strong opening statement that makes clear why you want the job and what you bring to the table.
                    Be succinct — a hiring manager should be able to read your letter at a glance.
                    Share an accomplishment that shows you can address the challenges the employer is facing.
                    Don’t:
                    Try to be funny — too often it falls flat.
                    Send a generic cover letter — customize each one for the specific job.
                    Go overboard with flattery — be professional and mature.
                    """
                },
                {
                    "role": "user",
                    "content": f"""

                    Template:
                    {template.content}
                    
                    Job Posting:
                    {job_posting}
                    
                    Resume:
                    {resume_text}
                    
                    Please generate a tailored cover letter following the template format.
                    Focus on matching the candidate's experience with job requirements.
                    """
                }
            ]
        )
        
        # Get the generated content
        generated_content = response.choices[0].message.content
        
        # Return generated cover letter
        return Response ({
            'cover_letter': generated_content
        })
        
    except CoverLetterTemplate.DoesNotExist:
        return Response ({
            'error': 'Template not found'
        }, status = 404)
    
    # Catch any other exception
    except Exception as e:
        return Response ({
            'error': str(e)
        }, status = 500)

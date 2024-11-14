# LetterlyYourCover
![image](https://github.com/user-attachments/assets/0e75e2da-a96b-41e5-95b1-60334e9f9902)
## Creates AI-generated cover letters.
Frameworks: Django, React, Chakra UI v3.

## Django: Built 2 API's
Generate cover letters: Generates cover letters from a template, resume, and job posting.  
Generation Count: Records number of cover letters generated.

## React / Chakra UI:
Used Chakra UI v3 for the website layout.

## Built using AWS to leverage cloud infrastructure:
* 💽 RDS: PostgreSQL database for 10+ customizable cover letter templates and generation count for total cover letters generated.
* 🖥️ EC2: Hosts the Django backend, deployed with Nginx and Gunicorn for a stable, secure setup.
* 📦 S3: Stores the React frontend built with Chakra UI v3.
* 🌐 Route 53: Manages the domain, provides a professional address, redirects to S3 bucket (sorry, no HTTPS yet).

## ✨ Features:
* Integrates OpenAI API in Django to generate personalized cover letters from a template, your resume, and a job posting.
* Users can select from over 10 professional university cover letter templates.

Feel free to check it out and let me know your opinions!

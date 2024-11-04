import React, { useState, useEffect } from 'react'
import { Provider } from "@/components/ui/provider"
import { toaster } from "@/components/ui/toaster"
import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select"
import { ProgressBar, ProgressRoot } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Box,
  VStack,
  HStack,
  Heading,
  Textarea,
  Container,
  Text,
  Card, // Use card.root, card.body, card.footer
} from '@chakra-ui/react';

function App() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobPosting, setJobPosting] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/templates/');
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        toaster.create({
          title: 'Error fetching templates',
          status: 'error',
          duration: 3000,
        });
      }
    };
    fetchTemplates();
  }, [toaster]);

  console.log("Templates: ", templates)
  console.log("Selected Template: ", selectedTemplate)
  console.log("Resume: ", resumeText)
  console.log("Job: ", jobPosting)

  const handleGenerate = async () => {
    if (!resumeText || !jobPosting || !selectedTemplate) {
      toaster.create({
        title: 'Missing Information',
        description: 'Please provide your resume, job posting, and select a template.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_text: resumeText,
          job_posting: jobPosting,
          template_id: selectedTemplate,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate cover letter');
      }
      
      const data = await response.json();
      setCoverLetter(data.cover_letter);
      
      toaster.create({
        title: 'Success!',
        description: 'Your cover letter has been generated.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: 'Failed to generate cover letter. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Provider>
      <Container maxW="container.lg" py={8}>

        <VStack align="stretch">

          <Heading textAlign="center" size="4xl" mb={4}>
            LetterlyYourCover
          </Heading>

          <Card.Root height="150px">
            <Card.Header>
              <Heading size="md" textAlign="center">1. Select Template</Heading>
            </Card.Header>
            <Card.Body>

              <NativeSelectRoot size="md" width="100%">
                <NativeSelectField
                  placeholder="Select a template"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>

            </Card.Body>
          </Card.Root>

          <HStack align="stretch">

            <Card.Root flex={1}>
              <Card.Header>
                <Heading size="md" textAlign="center">2. Your Resume</Heading>
              </Card.Header>
              <Card.Body>
                <Textarea
                  placeholder="Paste your resume here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  height="300px"
                />
              </Card.Body>
            </Card.Root>

            <Card.Root flex={1}>
              <Card.Header>
                <Heading size="md" textAlign="center">3. Job Posting</Heading>
              </Card.Header>
              <Card.Body>
                <Textarea
                  placeholder="Paste the job posting here..."
                  value={jobPosting}
                  onChange={(e) => setJobPosting(e.target.value)}
                  height="300px"
                />
              </Card.Body>
            </Card.Root>

          </HStack>

          <Button
            colorPalette="white"
            size="lg"
            onClick={handleGenerate}
            loading={isLoading}
            loadingText="Generating..."
          >
            Generate Cover Letter
          </Button>

          {isLoading && (
            <Box>
              <Text mb={2}>Analyzing and generating your cover letter...</Text>
              <ProgressRoot size="sm" loading>
                <ProgressBar/>
              </ProgressRoot>
            </Box>
          )}

          {coverLetter && (
            <Card.Root>
              <Card.Header>
                <Heading size="md">Your Generated Cover Letter!</Heading>
              </Card.Header>
              <Card.Body>
                <Textarea
                  value={coverLetter}
                  height="400px"
                  variant="subtle"
                  fontSize="md"
                />
                <Button
                  mt={4}
                  onClick={() => navigator.clipboard.writeText(coverLetter)}
                  size="sm"
                >
                  Copy to Clipboard
                </Button>
              </Card.Body>
            </Card.Root>
          )}
        </VStack>
      </Container>
    </Provider>
  );
}

export default App

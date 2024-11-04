import React, { useState, useEffect } from 'react'
import { Provider } from "@/components/ui/provider"
import { toaster } from "@/components/ui/toaster"
import {   
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText, } from "@/components/ui/select"
import { ProgressBar, ProgressRoot } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Box,
  VStack,
  HStack,
  Heading,
  //Select,
  Textarea,
  Container,
  Text,
  //Progress,
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
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center" size="xl" mb={4}>
            Cover Letter 
          </Heading>

          <Card.Root>
            <Card.Header>
              <Heading size="md">1. Select Template</Heading>
            </Card.Header>
            <Card.Body> 

              <SelectRoot size="xl">
                <SelectLabel size="mlg">Templates</SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Choose a cover letter template"/>
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
                </SelectContent>
              </SelectRoot>

            </Card.Body>
          </Card.Root>

          <HStack spacing={4} align="stretch">
            <Card.Root flex={1}>
              <Card.Header>
                <Heading size="md">2. Your Resume</Heading>
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
                <Heading size="md">3. Job Posting</Heading>
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
            colorScheme="blue"
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
              <ProgressRoot size="xs" value={isIndeterminate}>
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
                  isReadOnly
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

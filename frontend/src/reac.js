/*
import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Select,
  Textarea,
  Button,
  Container,
  useToast,
  Text,
  Divider,
  HStack,
  Progress,
  Card,
  CardBody,
  CardHeader,
} from '@chakra-ui/react';

function App() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobPosting, setJobPosting] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/templates/');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      toast({
        title: 'Error fetching templates',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleGenerate = async () => {
    if (!resumeText || !jobPosting || !selectedTemplate) {
      toast({
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
      
      toast({
        title: 'Success!',
        description: 'Your cover letter has been generated.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
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
    <ChakraProvider>
      <Container maxW="container.lg" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center" size="xl" mb={4}>
            Cover Letter Generator
          </Heading>

          <Card>
            <CardHeader>
              <Heading size="md">1. Select Template</Heading>
            </CardHeader>
            <CardBody>
              <Select
                placeholder="Choose a cover letter template"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Select>
            </CardBody>
          </Card>

          <HStack spacing={4} align="stretch">
            <Card flex={1}>
              <CardHeader>
                <Heading size="md">2. Your Resume</Heading>
              </CardHeader>
              <CardBody>
                <Textarea
                  placeholder="Paste your resume here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  height="300px"
                />
              </CardBody>
            </Card>

            <Card flex={1}>
              <CardHeader>
                <Heading size="md">3. Job Posting</Heading>
              </CardHeader>
              <CardBody>
                <Textarea
                  placeholder="Paste the job posting here..."
                  value={jobPosting}
                  onChange={(e) => setJobPosting(e.target.value)}
                  height="300px"
                />
              </CardBody>
            </Card>
          </HStack>

          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleGenerate}
            isLoading={isLoading}
            loadingText="Generating..."
          >
            Generate Cover Letter
          </Button>

          {isLoading && (
            <Box>
              <Text mb={2}>Analyzing and generating your cover letter...</Text>
              <Progress size="xs" isIndeterminate />
            </Box>
          )}

          {coverLetter && (
            <Card>
              <CardHeader>
                <Heading size="md">Your Generated Cover Letter</Heading>
              </CardHeader>
              <CardBody>
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
              </CardBody>
            </Card>
          )}
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default App;
*/
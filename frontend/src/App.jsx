import React, { useState, useEffect } from 'react'
import { Provider } from "@/components/ui/provider"
import { Toaster, toaster } from "@/components/ui/toaster"
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
  const [selectedTemplateDescription, setSelectedTemplateDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobPosting, setJobPosting] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTemplates();
    fetchGenerationCount();
  }, []);
  // Get templates from backend
  const fetchTemplates = async () => {
    try {
      const response = await fetch('http://ec2-54-151-22-16.us-west-1.compute.amazonaws.com/api/templates/');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
        setToast({
          type: 'error',
          title: 'Error fetching templates',
          status: 'error',
          description: 'Could not fetch templates',
          duration: 3000,
          colorPalette: 'red',
        });
    }
  };
  // Generation Count
  const fetchGenerationCount = async () => {
    try {
      const response = await fetch('http://ec2-54-151-22-16.us-west-1.compute.amazonaws.com/api/generation-count/');
      const data = await response.json();
      console.log(data.count);
      setGenerationCount(data.count);
    } catch (error) {
      console.error("Error fetching generation count:", error);
    }
  };
  // Generate cover letter
  const handleGenerate = async () => {
    if (!resumeText || !jobPosting || !selectedTemplate) {
      setToast({
        type: 'error',
        title: 'Missing Information',
        description: 'Please provide your resume, job posting, and select a template.',
        status: 'warning',
        duration: 3000,
        colorPalette: 'red',
      });
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch('http://ec2-54-151-22-16.us-west-1.compute.amazonaws.com/api/generate/', {
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

      setToast({
        type: 'success',
        title: 'Success!',
        description: 'Your cover letter has been generated.',
        status: 'success',
        duration: 3000,
        colorPalette: 'green',
      });

    } catch (error) {
        setToast({
          type: 'error',
          title: 'Error',
          description: 'Failed to generate cover letter. Please try again.',
          status: 'error',
          duration: 3000,
          colorPalette: 'red',
        });

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (toast) {
      // Reset toast after it's displayed
      const timer = setTimeout(() => {
        setToast(null);
      }, toast.duration);
      return () => clearTimeout(timer); // Clear timeout on component unmount
    }
  }, [toast]);

  return (
    <Provider>
      <Container width="100vw" maxW="100%" py={3}>

        <VStack alignItems="stretch" gap="15px" width="100%">

          <Toaster>
          {toast && (
              toaster.create ({
                title: toast.title,
                description: toast.description,
                status: toast.status,
                duration: toast.duration,
                type: toast.type,
                colorPalette: toaster.colorPalette,
              })
          )}
          </Toaster>

          <HStack
            width="100%"
            justify="center"
            align="center"
            wrap="wrap"
            spacing={4}
          >
            <Heading size="4xl" margin={5}>
              LetterlyYourCover
            </Heading>

            <Text
              fontSize="xs"
              position={{ base: 'static', md: 'absolute' }}
              right={{ base: 'auto', md: '8' }}
              textAlign={{ base: 'center', md: 'right' }}
              mt={{ base: 2, md: 0 }}
            >
              Total Cover Letters Generated: {generationCount}
            </Text>
          </HStack>

          <Card.Root height="auto">
            <Card.Header>
              <HStack width="100%" position="relative" wrap="wrap">

                <Box flex="1" textAlign="center">
                  <Heading size="lg" textAlign="center"><strong>Select Template</strong></Heading>
                </Box>

                <Text 
                  fontSize="sm"
                  position={{ base: 'static', md: 'absolute' }}
                  right={{ base: 'auto', md: '0' }}
                  textAlign={{ base: 'center', md: 'right' }}
                  mt={{ base: 2, md: 0 }}        
                >
                  {selectedTemplateDescription ? (
                  // If a template is selected, show the URL as a clickable link
                  <a 
                    href={selectedTemplateDescription} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'white', textDecoration: 'underline' }}
                  >
                    {selectedTemplateDescription}
                  </a>
                ) : (
                  // If no template is selected, show the default text
                  '*From credible university websites'
                )}
                </Text>

              </HStack>
            </Card.Header>
            <Card.Body>

              <NativeSelectRoot size="md" width="100%">
                <NativeSelectField
                  placeholder="Select a template"
                  value={selectedTemplate}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setSelectedTemplate(selectedId); // Set the selected template id
                    
                    // Find the selected template and update the description
                    const selectedTemplateObj = templates.find((template) => template.id === parseInt(selectedId, 10)); // Compare by id
                    
                    if (selectedTemplateObj) {
                      setSelectedTemplateDescription(selectedTemplateObj.description); // Set the description
                    }
                  }}
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
                <Heading size="lg" textAlign="center"><strong>Your Resume</strong></Heading>
              </Card.Header>

              <Card.Body>
                <Textarea
                  placeholder="Paste your resume here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  height="315px"
                />
              </Card.Body>

            </Card.Root>

            <Card.Root flex={1}>
              <Card.Header>
                <Heading size="lg" textAlign="center"><strong>Job Posting</strong></Heading>
              </Card.Header>
              <Card.Body>
                <Textarea
                  placeholder="Paste the job posting here..."
                  value={jobPosting}
                  onChange={(e) => setJobPosting(e.target.value)}
                  height="315px"
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
                <Heading size="2xl" textAlign="center" textShadow="md">Your Generated Cover Letter!</Heading>
                <Heading size="sm" textAlign="center"><strong>Remember:</strong> Review your cover letter and personalize it even more.</Heading>
              </Card.Header>
              <Card.Body>
                <Textarea
                  value={coverLetter}
                  height="500px"
                  variant="subtle"
                  fontSize="md"
                  readOnly
                  colorPalette="black"
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

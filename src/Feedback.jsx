import { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Textarea,
    VStack,
    Select,
    Heading,
    Text,
    useToast
} from '@chakra-ui/react';
import { API_URL } from './App';

function Feedback() {
    const [feedbackType, setFeedbackType] = useState('bug');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            toast({
                title: 'Description is required.',
                status: 'warning',
                duration: 2000,
                isClosable: true
            });
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ type: feedbackType, message: description })
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to submit feedback.');
            }
            await res.json();
            toast({
                title: 'Feedback submitted successfully.',
                status: 'success',
                duration: 2000,
                isClosable: true
            });
            setFeedbackType('bug');
            setDescription('');
        } catch (error) {
            toast({
                title: 'Error submitting feedback.',
                description: error.message,
                status: 'error',
                duration: 2000,
                isClosable: true
            });
        }
        setLoading(false);
    };

    return (
        <Box maxW="md" mx="auto" p={4} bg="white" boxShadow="md" borderRadius="md">
            <Heading size="md" mb={2}>
                Feedback
            </Heading>
            <Text mb={4}>
                We appreciate your feedback. Please let us know if you encountered any issues or
                have suggestions.
            </Text>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <FormControl id="feedback-type">
                        <FormLabel>Type</FormLabel>
                        <Select
                            value={feedbackType}
                            onChange={(e) => setFeedbackType(e.target.value)}
                        >
                            <option value="bug">Bug Report</option>
                            <option value="feature">Feature Request</option>
                        </Select>
                    </FormControl>
                    <FormControl id="description" isRequired>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            placeholder="Describe your issue or suggestion..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                        />
                    </FormControl>
                    <Button colorScheme="primary" type="submit" isLoading={loading} width="full">
                        Submit Feedback
                    </Button>
                </VStack>
            </form>
        </Box>
    );
}

export default Feedback;

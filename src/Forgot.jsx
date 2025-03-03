import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    Text,
    useToast,
    Container,
    useColorModeValue
} from '@chakra-ui/react';
import { API_URL } from './App';

const Forgot = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to send reset email');
            }
            setIsEmailSent(true);
            toast({
                title: 'Reset Password',
                description: 'Reset instructions have been sent to your email address.',
                status: 'success',
                duration: 2000,
                isClosable: true
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                duration: 2000,
                isClosable: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="container.sm" py={8}>
            <Box
                width="100%"
                p={8}
                borderRadius="lg"
                bg={bgColor}
                boxShadow="lg"
                border="1px"
                borderColor={borderColor}
            >
                <VStack spacing={6} align="stretch">
                    <Heading as="h1" size="xl" textAlign="center" color="#3498DB">
                        Reset Password
                    </Heading>
                    {!isEmailSent ? (
                        <form onSubmit={handleSubmit}>
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    size="lg"
                                    borderRadius="md"
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                width="full"
                                mt={6}
                                isLoading={isLoading}
                                loadingText="Send Reset Link"
                                bg="#3498DB"
                                color="white"
                                _hover={{ bg: '#3490D0' }}
                                size="lg"
                                borderRadius="md"
                            >
                                Send Reset Link
                            </Button>
                        </form>
                    ) : (
                        <Text textAlign="center" py={4} fontSize="lg">
                            Reset instructions have been sent to your email address.
                        </Text>
                    )}
                    <Text textAlign="center" fontSize="md">
                        Login{' '}
                        <Link to="/login">
                            <Text as="span" color="#34A853" textDecoration="underline">
                                Login
                            </Text>
                        </Link>
                    </Text>
                </VStack>
            </Box>
        </Container>
    );
};

export default Forgot;

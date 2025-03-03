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
    Container
} from '@chakra-ui/react';
import { API_URL } from './App';
import { GoogleLogin } from '@react-oauth/google';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const googleLogin = (response) => {
        handleSubmit(null, response.credential);
    };

    const handleSubmit = async (e, credential) => {
        e?.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    lastName,
                    credential
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Unable to create account');
            }
            if (data.token) {
                if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                    window.gtag('event', 'sign_up', {
                        method: credential ? 'Google' : 'Email',
                        event_category: 'Authentication'
                    });
                }
                if (credential) {
                    localStorage.setItem('token', data.token);
                    toast({
                        title: 'Account created',
                        description: 'Successfully signed up with Google.',
                        status: 'success',
                        duration: 2000,
                        isClosable: true
                    });
                    window.location.href = '/presentation';
                } else {
                    toast({
                        title: 'Account created',
                        description: 'Please login.',
                        status: 'success',
                        duration: 2000,
                        isClosable: true
                    });
                }
            }
        } catch (error) {
            toast({
                title: 'An error occurred',
                description: error.message || 'Unable to create account.',
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
                bg="white"
                p={8}
                rounded="lg"
                boxShadow="lg"
                borderWidth={1}
                borderColor="gray.200"
            >
                <VStack spacing={6} align="stretch">
                    <Heading as="h1" size="xl" textAlign="center" color="#3498DB">
                        Sign Up
                    </Heading>
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    borderColor="gray.300"
                                    _hover={{ borderColor: '#2980B9' }}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                    minLength={8}
                                    borderColor="gray.300"
                                    _hover={{ borderColor: '#2980B9' }}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>First Name</FormLabel>
                                <Input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Enter your first name"
                                    borderColor="gray.300"
                                    _hover={{ borderColor: '#2980B9' }}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Last Name</FormLabel>
                                <Input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Enter your last name"
                                    borderColor="gray.300"
                                    _hover={{ borderColor: '#2980B9' }}
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                bg="#3498DB"
                                color="white"
                                width="full"
                                isLoading={isLoading}
                                size="lg"
                                _hover={{ bg: '#2980B9' }}
                            >
                                Sign Up
                            </Button>
                            <GoogleLogin theme="outline" size="large" onSuccess={googleLogin} />
                        </VStack>
                    </form>
                    <Text textAlign="center">
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#34A853' }}>
                            Log in
                        </Link>
                    </Text>
                </VStack>
            </Box>
        </Container>
    );
};

export default SignUp;

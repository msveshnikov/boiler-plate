import { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Text,
    useToast,
    Container,
    Heading,
    Link as ChakraLink
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from './App';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const googleLogin = (response) => {
        handleSubmit(null, response.credential);
    };

    const handleSubmit = async (e, credential) => {
        e?.preventDefault();
        setIsLoading(true);
        try {
            const endpoint = credential ? 'signup' : 'login';
            const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    credential
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }
            const data = await response.json();
            localStorage.setItem('token', data.token);
            if (typeof window.gtag !== 'undefined') {
                window.gtag('event', 'login', {
                    method: credential ? 'Google' : 'Email'
                });
            }
            toast({
                title: 'Login Successful',
                description: 'You have successfully logged in.',
                status: 'success',
                duration: 2000,
                isClosable: true
            });
            window.location.href = '/presentation';
        } catch (error) {
            toast({
                title: 'Login Error',
                description: error.message || 'Unable to login.',
                status: 'error',
                duration: 2000,
                isClosable: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgot');
    };

    return (
        <Container maxW="container.sm" py={8}>
            <Box>
                <VStack spacing={6} align="stretch">
                    <Heading as="h1" size="xl" textAlign="center" color="#3498DB">
                        Log In
                    </Heading>
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    borderColor="#2471A3"
                                    _hover={{ borderColor: '#2980B9' }}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    borderColor="#2471A3"
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
                                Log In
                            </Button>
                            <GoogleLogin
                                theme="outline"
                                size="large"
                                onSuccess={googleLogin}
                                useOneTap
                            />
                        </VStack>
                    </form>
                    <VStack spacing={2}>
                        <ChakraLink onClick={handleForgotPassword} color="#2980B9" cursor="pointer">
                            Forgot Password?
                        </ChakraLink>
                        <Text>
                            Don&apos;t have an account?{' '}
                            <Link to="/signup" style={{ color: '#2980B9' }}>
                                Sign up
                            </Link>
                        </Text>
                    </VStack>
                </VStack>
            </Box>
        </Container>
    );
};

export default Login;

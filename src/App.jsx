import { ChakraProvider, Box, Container, VStack, extendTheme } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './Landing';
import { lazy, Suspense, createContext, useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './Navbar';
import Terms from './Terms';
import Privacy from './Privacy';
import Login from './Login';
import SignUp from './SignUp';
import Forgot from './Forgot';
import Reset from './Reset';
import Profile from './Profile';
import { BottomNavigationBar } from './BottomNavigationBar';

const Admin = lazy(() => import('./Admin'));
const Feedback = lazy(() => import('./Feedback'));
const Docs = lazy(() => import('./Docs'));

export const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://autoresearch.pro';
export const UserContext = createContext(null);

const theme = extendTheme({
    colors: {
        primary: {
            500: '#3498DB'
        },
        secondary: {
            500: '#2980B9',
            600: '#2471A3'
        },
        accent: {
            500: '#F1C40F',
            600: '#E67E22'
        }
    },
    fonts: {
        heading: 'Montserrat, sans-serif',
        body: 'Open Sans, sans-serif'
    }
});

function App() {
    const [user, setUser] = useState();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${API_URL}/api/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    setUser(data);
                });
        }
    }, []);

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <ChakraProvider theme={theme}>
                <Suspense
                    fallback={
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="100vh"
                        >
                            Loading...
                        </Box>
                    }
                >
                    <UserContext.Provider value={{ user, setUser }}>
                        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                            <Box pb="50px" minH="100vh" bg="gray.50">
                                <Navbar />
                                <Container maxW="container.xl" py={8}>
                                    <VStack spacing={8}>
                                        <Routes>
                                            <Route path="/" element={<Landing />} />
                                            <Route path="/research" element={<Landing />} />
                                            
                                            <Route path="/privacy" element={<Privacy />} />
                                            <Route path="/terms" element={<Terms />} />
                                            <Route path="/login" element={<Login />} />
                                            <Route path="/signup" element={<SignUp />} />
                                            <Route path="/forgot" element={<Forgot />} />
                                            <Route path="/profile" element={<Profile />} />
                                            <Route path="/feedback" element={<Feedback />} />
                                            <Route
                                                path="/reset-password/:token"
                                                element={<Reset />}
                                            />
                                            <Route path="/admin" element={<Admin />} />
                                            <Route path="/docs/*" element={<Docs />} />
                                            <Route path="*" element={<Navigate to="/" replace />} />
                                        </Routes>
                                    </VStack>
                                </Container>
                                <BottomNavigationBar />
                            </Box>
                        </Router>
                    </UserContext.Provider>
                </Suspense>
            </ChakraProvider>
        </GoogleOAuthProvider>
    );
}

export default App;

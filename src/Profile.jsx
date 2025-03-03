import { useState, useContext } from 'react';
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
    Select,
    Container,
    Card,
    CardBody,
    SimpleGrid,
    Stack,
    Badge,
    Link
} from '@chakra-ui/react';
import { API_URL, UserContext } from './App';
import PresentationList from './PresentationList';

const Profile = () => {
    const { user, setUser } = useContext(UserContext);
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (section, field, value) => {
        setUser((prev) => ({
            ...prev,
            [section]: {
                ...(prev[section] || {}),
                [field]: value
            }
        }));
    };

    const handleBasicChange = (field, value) => {
        setUser((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(API_URL + '/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    researchPreferences: user?.researchPreferences,
                    presentationSettings: user?.presentationSettings,
                    preferences: user?.preferences
                })
            });
            if (response.ok) {
                toast({
                    title: 'Success',
                    description: 'Profile updated successfully',
                    status: 'success',
                    duration: 3000
                });
            } else {
                toast({
                    title: 'Error',
                    description: 'Error updating profile',
                    status: 'error',
                    duration: 3000
                });
            }
        } catch {
            toast({
                title: 'Error',
                description: 'Error updating profile',
                status: 'error',
                duration: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="container.lg" py={8}>
            <Card>
                <CardBody>
                    <VStack spacing={8}>
                        <Box w="100%">
                            <Stack direction="row" justify="space-between" align="center" mb={4}>
                                <Text fontSize="xl">Subscription</Text>
                                <Badge
                                    colorScheme={
                                        user?.subscriptionStatus === 'active' ||
                                        user?.subscriptionStatus === 'trialing'
                                            ? 'green'
                                            : 'gray'
                                    }
                                >
                                    {user?.subscriptionStatus === 'active' ||
                                    user?.subscriptionStatus === 'trialing'
                                        ? 'Premium'
                                        : 'Free'}
                                </Badge>
                            </Stack>
                            {!(
                                user?.subscriptionStatus === 'active' ||
                                user?.subscriptionStatus === 'trialing'
                            ) ? (
                                <Link href="https://buy.stripe.com/00gdSPetHeEfgUg9AI" isExternal>
                                    <Button disabled={!user} colorScheme="orange">
                                        Upgrade to Premium ($7.99/mo)
                                    </Button>
                                </Link>
                            ) : (
                                <Link
                                    href={
                                        'https://billing.stripe.com/p/login/9AQ8zd8ZL79E51e000?prefilled_email=' +
                                        user?.email
                                    }
                                    target="_blank"
                                    rel="noopener"
                                >
                                    <Button colorScheme="purple" mt={1} ml={1}>
                                        Customer Portal
                                    </Button>
                                </Link>
                            )}
                        </Box>
                        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            <VStack spacing={6} align="stretch">
                                <Heading size="md">Basic Information</Heading>
                                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                                    <FormControl>
                                        <FormLabel>First Name</FormLabel>
                                        <Input
                                            value={user?.firstName || ''}
                                            onChange={(e) =>
                                                handleBasicChange('firstName', e.target.value)
                                            }
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Last Name</FormLabel>
                                        <Input
                                            value={user?.lastName || ''}
                                            onChange={(e) =>
                                                handleBasicChange('lastName', e.target.value)
                                            }
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Email</FormLabel>
                                        <Input value={user?.email || ''} isReadOnly />
                                    </FormControl>
                                </SimpleGrid>
                            </VStack>
                            <VStack spacing={6} align="stretch" mt={8}>
                                <Heading size="md">Research Preferences</Heading>
                                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                                    <FormControl>
                                        <FormLabel>Field of Research</FormLabel>
                                        <Input
                                            value={user?.researchPreferences?.field || ''}
                                            onChange={(e) =>
                                                handleChange(
                                                    'researchPreferences',
                                                    'field',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Preferred Data Sources</FormLabel>
                                        <Input
                                            value={user?.researchPreferences?.dataSources || ''}
                                            onChange={(e) =>
                                                handleChange(
                                                    'researchPreferences',
                                                    'dataSources',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Level of AI Assistance</FormLabel>
                                        <Select
                                            value={user?.researchPreferences?.aiAssistance || ''}
                                            onChange={(e) =>
                                                handleChange(
                                                    'researchPreferences',
                                                    'aiAssistance',
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">Select level</option>
                                            <option value="minimal">Minimal</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="full">Full</option>
                                        </Select>
                                    </FormControl>
                                </SimpleGrid>
                            </VStack>
                            <VStack spacing={6} align="stretch" mt={8}>
                                <Heading size="md">Presentation Settings</Heading>
                                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                                    <FormControl>
                                        <FormLabel>Default Slide Layout</FormLabel>
                                        <Select
                                            value={user?.presentationSettings?.slideLayout || ''}
                                            onChange={(e) =>
                                                handleChange(
                                                    'presentationSettings',
                                                    'slideLayout',
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">Select layout</option>
                                            <option value="Default">Default</option>
                                            <option value="Title Slide">Title Slide</option>
                                            <option value="Bullet List">Bullet List</option>
                                            <option value="Image Focused">Image Focused</option>
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Theme</FormLabel>
                                        <Select
                                            value={user?.presentationSettings?.theme || ''}
                                            onChange={(e) =>
                                                handleChange(
                                                    'presentationSettings',
                                                    'theme',
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">Select theme</option>
                                            <option value="Light">Light</option>
                                            <option value="Dark">Dark</option>
                                            <option value="Auto">Auto</option>
                                            <option value="Primary Blue">Primary Blue</option>
                                            <option value="Secondary Blue">Secondary Blue</option>
                                            <option value="Vibrant Accent">Vibrant Accent</option>
                                            <option value="Olive Green">Olive Green</option>
                                            <option value="Sunset">Sunset</option>
                                        </Select>
                                    </FormControl>
                                </SimpleGrid>
                            </VStack>

                            <Box mt={8}>
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    isLoading={isLoading}
                                    width="100%"
                                >
                                    Save
                                </Button>
                            </Box>
                        </form>
                        <VStack spacing={4} width="100%" mt={8}>
                            <Heading size="md">Presentations</Heading>
                            <PresentationList my />
                        </VStack>
                    </VStack>
                </CardBody>
            </Card>
        </Container>
    );
};

export default Profile;

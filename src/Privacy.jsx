import {
    Box,
    Container,
    Heading,
    Text,
    Link,
    VStack,
    UnorderedList,
    ListItem,
    Switch,
    FormControl,
    FormLabel,
    Stack
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { API_URL } from './App';

const Privacy = () => {
    const [lastUpdated, setLastUpdated] = useState('');
    const [consentSettings, setConsentSettings] = useState({
        necessary: true,
        analytics: true,
        aiProcessing: true,
        researchData: true,
        presentationCustomization: true,
        socialFeatures: false
    });

    useEffect(() => {
        const fetchLastUpdate = async () => {
            try {
                const response = await fetch(`${API_URL}/api/privacy/last-updated`);
                const data = await response.json();
                setLastUpdated(new Date(data.lastUpdated).toLocaleDateString());
            } catch {
                setLastUpdated(new Date().toLocaleDateString());
            }
        };
        fetchLastUpdate();
    }, []);

    const handleConsentChange = async (setting) => {
        const newSettings = { ...consentSettings, [setting]: !consentSettings[setting] };
        setConsentSettings(newSettings);
        try {
            await fetch(`${API_URL}/api/privacy/consent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ setting, value: newSettings[setting] })
            });
        } catch (error) {
            console.error('Error updating privacy settings:', error);
        }
    };

    return (
        <Container maxW="container.lg" py={8}>
            <VStack spacing={6} align="stretch">
                <Heading as="h1" size="xl">
                    Privacy Policy
                </Heading>
                <Text>Last Updated: {lastUpdated}</Text>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Information Collected
                    </Heading>
                    <UnorderedList spacing={2} mb={4}>
                        <ListItem>Aggregated Research Data</ListItem>
                        <ListItem>User Interaction Logs</ListItem>
                        <ListItem>Presentation Settings</ListItem>
                        <ListItem>Generated AI Insights</ListItem>
                        <ListItem>User Profile Information</ListItem>
                    </UnorderedList>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        AI Processing and Data Usage
                    </Heading>
                    <UnorderedList spacing={2} mb={4}>
                        <ListItem>Natural language processing for research data synthesis</ListItem>
                        <ListItem>Automated insights generation</ListItem>
                        <ListItem>Dynamic presentation creation algorithms</ListItem>
                        <ListItem>Advanced data aggregation techniques</ListItem>
                        <ListItem>Customizable layout and design adjustments</ListItem>
                    </UnorderedList>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Data Retention and Deletion
                    </Heading>
                    <Text mb={4}>
                        We retain your personal data only for as long as necessary to fulfill the
                        purposes for which it was collected, including compliance with legal,
                        accounting, or reporting requirements. You may request deletion or
                        modification of your data in accordance with applicable law.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Data Security
                    </Heading>
                    <Text mb={4}>
                        We implement robust security measures including encryption, secure data
                        storage, and access controls to protect your personal data. However, no
                        method of transmission over the internet or method of electronic storage is
                        completely secure.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Third-Party Disclosure
                    </Heading>
                    <Text mb={4}>
                        We do not sell, trade, or otherwise transfer your personal information to
                        outside parties except as necessary to comply with the law, enforce our
                        policies, or protect our rights.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Your Rights
                    </Heading>
                    <Text mb={4}>
                        You have the right to access, correct, or request deletion of your personal
                        data. To exercise these rights or for any inquiries regarding your data,
                        please contact us at{' '}
                        <Link href="mailto:privacy@autoresearch.pro" color="blue.500">
                            privacy@autoresearch.pro
                        </Link>
                        .
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Policy Modifications
                    </Heading>
                    <Text mb={4}>
                        We reserve the right to modify this Privacy Policy at any time. Any changes
                        will be posted on this page with a revised effective date. Continued use of
                        our services after any modifications constitutes acceptance of the updated
                        policy.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Your Privacy Choices
                    </Heading>
                    <Stack spacing={4}>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="necessary" mb="0">
                                Essential Services
                            </FormLabel>
                            <Switch
                                id="necessary"
                                isChecked={consentSettings.necessary}
                                isDisabled
                            />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="analytics" mb="0">
                                Analytics
                            </FormLabel>
                            <Switch
                                id="analytics"
                                isChecked={consentSettings.analytics}
                                onChange={() => handleConsentChange('analytics')}
                            />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="aiProcessing" mb="0">
                                AI Processing
                            </FormLabel>
                            <Switch
                                id="aiProcessing"
                                isChecked={consentSettings.aiProcessing}
                                onChange={() => handleConsentChange('aiProcessing')}
                            />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="researchData" mb="0">
                                Research Data Collection
                            </FormLabel>
                            <Switch
                                id="researchData"
                                isChecked={consentSettings.researchData}
                                onChange={() => handleConsentChange('researchData')}
                            />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="presentationCustomization" mb="0">
                                Presentation Customization
                            </FormLabel>
                            <Switch
                                id="presentationCustomization"
                                isChecked={consentSettings.presentationCustomization}
                                onChange={() => handleConsentChange('presentationCustomization')}
                            />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="socialFeatures" mb="0">
                                Social Features
                            </FormLabel>
                            <Switch
                                id="socialFeatures"
                                isChecked={consentSettings.socialFeatures}
                                onChange={() => handleConsentChange('socialFeatures')}
                            />
                        </FormControl>
                    </Stack>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Contact Us
                    </Heading>
                    <Text mb={4}>
                        For any inquiries regarding this Privacy Policy, please contact us at{' '}
                        <Link href="mailto:privacy@autoresearch.pro" color="blue.500">
                            privacy@autoresearch.pro
                        </Link>
                        .
                    </Text>
                </Box>
            </VStack>
        </Container>
    );
};

export default Privacy;

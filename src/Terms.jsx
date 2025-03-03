import { Box, Container, Heading, Text, VStack, UnorderedList, ListItem } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { API_URL } from './App';

const Terms = () => {
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        const fetchLastUpdate = async () => {
            try {
                const response = await fetch(`${API_URL}/api/terms/last-updated`);
                const data = await response.json();
                setLastUpdated(new Date(data.lastUpdated).toLocaleDateString());
            } catch (error) {
                console.error('Error fetching terms update:', error);
                setLastUpdated(new Date().toLocaleDateString());
            }
        };
        fetchLastUpdate();
    }, []);

    return (
        <Container maxW="container.lg" py={10}>
            <VStack spacing={6} align="stretch">
                <Heading as="h1" size="xl">
                    Terms of Service
                </Heading>
                <Text>Last Updated: {lastUpdated}</Text>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        1. Acceptance of Terms
                    </Heading>
                    <Text mb={4}>
                        By accessing and using AutoResearch.pro, you agree to comply with these
                        Terms of Service and acknowledge that this agreement represents a legally
                        binding contract between you and AutoResearch.pro. If you do not agree with
                        these terms, please do not use the platform.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        2. Use License
                    </Heading>
                    <Text mb={4}>
                        Permission is granted to temporarily download one copy of the materials
                        (information or software) on AutoResearch.pro for personal, non-commercial
                        transitory viewing only. This constitutes a license to use the materials
                        under the terms specified herein, not a transfer of title.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        3. AI Services
                    </Heading>
                    <Text mb={4}>
                        Our platform employs advanced AI algorithms for data aggregation, research
                        synthesis, and presentation generation. While we strive for accuracy,
                        AutoResearch.pro does not warrant that the AI-generated outputs or insights
                        will be error-free or applicable for specific purposes.
                    </Text>
                    <UnorderedList spacing={2} mb={4}>
                        <ListItem>Data Aggregation and Analysis</ListItem>
                        <ListItem>Instant Presentation Generation</ListItem>
                        <ListItem>Dynamic Presentation Customization</ListItem>
                        <ListItem>AI-Driven Insights</ListItem>
                        <ListItem>Automated Research Synthesis</ListItem>
                    </UnorderedList>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        4. Research Data &amp; Accuracy
                    </Heading>
                    <Text mb={4}>
                        AutoResearch.pro endeavors to provide accurate and reliable research
                        insights and presentation content. However, we make no guarantees regarding
                        the completeness, accuracy, or reliability of the data. Users are
                        responsible for verifying any critical information obtained from the
                        platform.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        5. Features
                    </Heading>
                    <Text mb={4}>
                        AutoResearch.pro offers features such as automated research aggregation,
                        rapid presentation generation, dynamic slide customization, and AI-powered
                        insights. These features are subject to periodic updates and modifications
                        without prior notice.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        6. Liability
                    </Heading>
                    <Text mb={4}>
                        In no event shall AutoResearch.pro or its suppliers be liable for any
                        direct, indirect, incidental, consequential, or punitive damages arising
                        from your use of, or inability to use, the materials on this platform, even
                        if advised of the possibility of such damages.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        7. Changes to Terms
                    </Heading>
                    <Text mb={4}>
                        We reserve the right to modify or replace these Terms at any time at our
                        sole discretion. Continued use of the platform following any changes
                        signifies your acceptance of the new Terms. It is your responsibility to
                        review these Terms periodically.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        8. Governing Law
                    </Heading>
                    <Text mb={4}>
                        These Terms shall be governed by and construed in accordance with the laws
                        of the jurisdiction in which AutoResearch.pro operates, without regard to
                        its conflict of law provisions.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        9. Dispute Resolution
                    </Heading>
                    <Text mb={4}>
                        Any disputes arising out of or related to these Terms shall be resolved
                        through binding arbitration in accordance with the rules of the applicable
                        arbitration body. By using AutoResearch.pro, you agree to submit to such
                        arbitration.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        10. Intellectual Property Rights
                    </Heading>
                    <Text mb={4}>
                        All content, trademarks, and other intellectual property on
                        AutoResearch.pro, including text, graphics, logos, images, and software,
                        remain the property of AutoResearch.pro and are protected by international
                        copyright and trademark laws.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        11. Indemnification
                    </Heading>
                    <Text mb={4}>
                        You agree to indemnify, defend, and hold harmless AutoResearch.pro, its
                        affiliates, officers, directors, employees, and agents from any claims,
                        damages, or expenses arising from your use of the platform or your violation
                        of these Terms.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        12. Termination
                    </Heading>
                    <Text mb={4}>
                        We reserve the right to terminate or suspend your access to
                        AutoResearch.pro, without prior notice or liability, for any reason,
                        including but not limited to a breach of these Terms.
                    </Text>
                </Box>
            </VStack>
        </Container>
    );
};

export default Terms;

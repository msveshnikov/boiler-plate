import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    VStack,
    Spinner,
    useToast,
    Input,
    Select,
    Grid,
    Badge,
    Link,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Divider,
    Button
} from '@chakra-ui/react';
import { API_URL } from './App';
import ReactMarkdown from 'react-markdown';

const Docs = () => {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');
    const toast = useToast();
    const [selectedStaticDoc, setSelectedStaticDoc] = useState(null);

    useEffect(() => {
        if (selectedStaticDoc) return;
        const fetchDocs = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/docs?search=${encodeURIComponent(
                        searchTerm
                    )}&category=${encodeURIComponent(category)}`
                );
                if (!response.ok) throw new Error('Failed to fetch docs');
                const data = await response.json();
                setDocs(data);
            } catch {
                toast({
                    title: 'Error',
                    description: 'Failed to load documentation',
                    status: 'error',
                    duration: 2000,
                    isClosable: true
                });
            } finally {
                setLoading(false);
            }
        };
        fetchDocs();
    }, [toast, searchTerm, category, selectedStaticDoc]);

    const handleBack = () => {
        setSelectedStaticDoc(null);
    };

    if (selectedStaticDoc) {
        return (
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8} align="stretch">
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={handleBack} cursor="pointer">
                                Documentation
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink>{selectedStaticDoc.title}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Button onClick={handleBack} alignSelf="flex-start">
                        Back
                    </Button>
                </VStack>
            </Container>
        );
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>Documentation</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Heading size="xl">Documentation</Heading>
                <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
                    <Input
                        placeholder="Search documentation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="all">All Categories</option>
                        <option value="getting-started">Getting Started</option>
                        <option value="features">Features</option>
                        <option value="api">API</option>
                        <option value="security">Security</option>
                    </Select>
                </Grid>
                <VStack spacing={6} align="stretch">
                    {docs.map((doc, index) => (
                        <Box key={index} p={6} bg="white" borderRadius="lg" shadow="md">
                            {doc.category && (
                                <Badge mb={2} colorScheme="blue">
                                    {doc.category}
                                </Badge>
                            )}
                            <Heading size="md" mb={4}>
                                {doc.title}
                            </Heading>
                            <ReactMarkdown>{doc.content}</ReactMarkdown>
                            {doc.links && (
                                <Box mt={4}>
                                    {doc.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            color="blue.500"
                                            mr={4}
                                            display="inline-block"
                                        >
                                            {link.text}
                                        </Link>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    ))}
                </VStack>
                <Divider />
            </VStack>
        </Container>
    );
};

export default Docs;

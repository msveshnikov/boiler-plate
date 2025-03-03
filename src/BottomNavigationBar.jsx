import { Box, Icon, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiHome, FiBarChart2, FiUser } from 'react-icons/fi';

export const BottomNavigationBar = () => (
    <Box
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        height="50px"
        bg="white"
        borderTopWidth="1px"
        display="flex"
        justifyContent="space-around"
        alignItems="center"
        zIndex={1000}
        fontSize="sm"
        sx={{
            '@supports (backdrop-filter: blur(10px))': {
                backdropFilter: 'blur(10px)',
                bg: 'rgba(255, 255, 255, 0.9)'
            }
        }}
    >
        <Box as={Link} to="/" p={2} display="flex" flexDirection="column" alignItems="center">
            <Icon as={FiHome} boxSize={5} />
            <Text fontSize="xs">Home</Text>
        </Box>
        <Box
            as={Link}
            to="/presentation"
            p={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <Icon as={FiBarChart2} boxSize={5} />
            <Text fontSize="xs">Presentation</Text>
        </Box>
        <Box
            as={Link}
            to="/insights"
            p={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <Icon as={FiUser} boxSize={5} />
            <Text fontSize="xs">Insights</Text>
        </Box>
    </Box>
);

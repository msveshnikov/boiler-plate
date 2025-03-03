import { useContext } from 'react';
import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Link,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useDisclosure,
    useColorModeValue,
    Image
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import { UserContext } from './App';

export default function Navbar() {
    const { isOpen, onToggle } = useDisclosure();
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleNavClick = () => {
        if (isOpen) onToggle();
    };

    const NAV_ITEMS = [
        { label: 'Feedback', href: '/feedback', requiresAuth: false },
        ...(user?.isAdmin ? [{ label: 'Admin', href: '/admin', requiresAuth: true }] : [])
    ];

    const filteredNavItems = NAV_ITEMS.filter((item) => !item.requiresAuth || user?.email);

    return (
        <Box position="sticky" top="0" zIndex="1000">
            <Flex
                bg={bgColor}
                color={useColorModeValue('gray.600', 'white')}
                minH="60px"
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle="solid"
                borderColor={borderColor}
                align="center"
                boxShadow="sm"
            >
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}
                >
                    {filteredNavItems.length > 0 && (
                        <IconButton
                            onClick={onToggle}
                            icon={
                                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                            }
                            variant="ghost"
                            aria-label="Toggle Navigation"
                        />
                    )}
                </Flex>
                <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }} align="center">
                    <Image
                        src={logo}
                        alt="AutoResearch.pro Logo"
                        h="40px"
                        mr={3}
                        cursor="pointer"
                        onClick={handleLogoClick}
                    />
                    <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                        <DesktopNav navItems={filteredNavItems} />
                    </Flex>
                </Flex>
                <Stack flex={{ base: 1, md: 0 }} justify="flex-end" direction="row" spacing={6}>
                    {user?.email ? (
                        <>
                            <Button
                                as={RouterLink}
                                to="/profile"
                                variant="ghost"
                                fontSize="sm"
                                fontWeight={400}
                                onClick={handleNavClick}
                            >
                                Profile
                            </Button>
                            <Button
                                onClick={() => {
                                    handleNavClick();
                                    handleLogout();
                                }}
                                colorScheme="red"
                                variant="outline"
                                fontSize="sm"
                                fontWeight={600}
                            >
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                as={RouterLink}
                                to="/login"
                                variant="ghost"
                                onClick={handleNavClick}
                            >
                                Login
                            </Button>
                            <Button
                                as={RouterLink}
                                to="/signup"
                                display={{ base: 'none', md: 'inline-flex' }}
                                fontSize="sm"
                                fontWeight={600}
                                color="white"
                                bg="#3498DB"
                                onClick={handleNavClick}
                                _hover={{
                                    bg: '#2980B9'
                                }}
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </Stack>
            </Flex>
            {filteredNavItems.length > 0 && (
                <Collapse in={isOpen} animateOpacity>
                    <MobileNav navItems={filteredNavItems} onNavClick={handleNavClick} />
                </Collapse>
            )}
        </Box>
    );
}

const DesktopNav = ({ navItems }) => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');

    return (
        <Stack direction="row" spacing={4}>
            {navItems.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger="hover" placement="bottom-start">
                        <PopoverTrigger>
                            <Link
                                p={2}
                                as={RouterLink}
                                to={navItem.href ?? '#'}
                                fontSize="sm"
                                fontWeight={500}
                                color={linkColor}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor
                                }}
                            >
                                {navItem.label}
                            </Link>
                        </PopoverTrigger>
                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                boxShadow="xl"
                                bg={popoverContentBgColor}
                                p={4}
                                rounded="xl"
                                minW="sm"
                            >
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <DesktopSubNav key={child.label} {...child} />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
    return (
        <Link
            as={RouterLink}
            to={href}
            role="group"
            display="block"
            p={2}
            rounded="md"
            _hover={{ bg: useColorModeValue('blue.50', 'gray.900') }}
        >
            <Stack direction="row" align="center">
                <Box>
                    <Text
                        transition="all .3s ease"
                        _groupHover={{ color: '#3498DB' }}
                        fontWeight={500}
                    >
                        {label}
                    </Text>
                    <Text fontSize="sm">{subLabel}</Text>
                </Box>
                <Flex
                    transition="all .3s ease"
                    transform="translateX(-10px)"
                    opacity={0}
                    _groupHover={{ opacity: 1, transform: 'translateX(0)' }}
                    justify="flex-end"
                    align="center"
                    flex={1}
                >
                    <Icon color="#3498DB" w={5} h={5} as={ChevronRightIcon} />
                </Flex>
            </Stack>
        </Link>
    );
};

const MobileNav = ({ navItems, onNavClick }) => {
    return (
        <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
            {navItems.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} onNavClick={onNavClick} />
            ))}
        </Stack>
    );
};

const MobileNavItem = ({ label, children, href, onNavClick }) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Stack spacing={4} onClick={children ? onToggle : onNavClick}>
            <Flex
                py={2}
                as={RouterLink}
                to={href ?? '#'}
                justify="space-between"
                align="center"
                _hover={{
                    textDecoration: 'none'
                }}
            >
                <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition="all .25s ease-in-out"
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Flex>
            <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle="solid"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    align="start"
                >
                    {children &&
                        children.map((child) => (
                            <Link
                                key={child.label}
                                py={2}
                                as={RouterLink}
                                to={child.href}
                                onClick={onNavClick}
                            >
                                {child.label}
                            </Link>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};

# Navbar Component Documentation

This document provides a comprehensive overview of the Navbar component defined in the file
`src/Navbar.jsx`. It includes detailed descriptions of the component’s purpose, its internal
functions, parameters, return values, and usage examples. The Navbar component is a central part of
the project’s client-side UI, managing navigation and session controls in a responsive manner.

---

## Table of Contents

1. [Overview](#overview)
2. [Project Context and File Role](#project-context-and-file-role)
3. [Dependencies](#dependencies)
4. [Component Hierarchy](#component-hierarchy)
5. [Detailed Component Documentation](#detailed-component-documentation)
    - [Navbar (Default Export)](#navbar-default-export)
    - [DesktopNav](#desktopnav)
    - [DesktopSubNav](#desktopsubnav)
    - [MobileNav](#mobilenav)
    - [MobileNavItem](#mobilenavitem)
6. [Usage Example](#usage-example)
7. [Notes and Considerations](#notes-and-considerations)

---

## Overview

The `Navbar.jsx` file exports a responsive navigation bar component that integrates with Chakra UI
for styling and React Router for navigation. The component uses context (via `UserContext`) to
determine authentication status and conditional navigation items (e.g., "Admin" links for
administrators). It adapts its layout to both desktop and mobile views, providing toggling
functionality for mobile navigation items.

Key features include:

- **Responsive Design:** Renders a horizontal navigation bar in desktop mode and a collapsible menu
  in mobile mode.
- **User-Based Navigation:** Adjusts displayed navigation items based on user authentication and
  admin privileges.
- **Theme-Aware Styling:** Uses Chakra UI's `useColorModeValue` to adapt styles for light and dark
  modes.
- **Navigation Control:** Uses React Router's `Link` and `useNavigate` to handle client-side
  routing.
- **Session Management:** Provides a logout functionality that clears the session token and resets
  the user context.

---

## Project Context and File Role

The project is structured into several parts, including client-side React components (in the `src`
folder) and server-side logic (in the `server` folder). The `Navbar.jsx` component is an essential
part of the client-side UI, often included in the main application layout (for example, rendered
within `App.jsx`). It serves as a primary navigation element for the web application, allowing users
to navigate between pages like Feedback, Profile, Login, Signup, and Admin (if applicable).

---

## Dependencies

The Navbar component relies on several external libraries and resources:

- **React and React Hooks:** For managing state (`useContext`, `useDisclosure`).
- **Chakra UI:** For UI components (`Box`, `Flex`, `Text`, `IconButton`, `Button`, `Stack`,
  `Collapse`, `Icon`, `Link`, `Popover`, `PopoverTrigger`, `PopoverContent`, `useColorModeValue`,
  `Image`).
- **Chakra UI Icons:** For navigation icons (`HamburgerIcon`, `CloseIcon`, `ChevronDownIcon`,
  `ChevronRightIcon`).
- **React Router:** For navigation and linking (`Link as RouterLink`, `useNavigate`).
- **UserContext:** Provided by `App.jsx` to access and modify the user authentication state.
- **Logo Asset:** The component imports a logo image from `./assets/logo.png`.

---

## Component Hierarchy

The Navbar component is composed of several sub-components:

- **Navbar (Default Export):** The root component handling overall layout and navigation logic.

    - Uses hooks such as `useDisclosure` for managing the mobile nav toggle.
    - Retrieves user data from `UserContext` for conditionally rendering navigation items.
    - Defines helper functions like `handleLogout`, `handleLogoClick`, and `handleNavClick`.

- **DesktopNav:** Renders navigation links for larger screens.

    - Uses a horizontal `Stack` to display navigation items.
    - Supports optional popovers for items with children (sub-navigation).

- **DesktopSubNav:** Renders sub-navigation items inside popovers.

    - Displays a label, optional sub-label, and an icon that appears on hover.

- **MobileNav:** Renders a vertical stack of navigation links for mobile devices.

    - Iterates over navigation items and uses `MobileNavItem` for each.

- **MobileNavItem:** Renders individual navigation items in mobile view.
    - Supports collapsible children items if available.
    - Uses its own instance of `useDisclosure` to manage expand/collapse state.

---

## Detailed Component Documentation

### Navbar (Default Export)

**Description:**  
The main navigation bar component that adapts between desktop and mobile views, handles user
authentication actions (e.g., sign in/out), and manages navigation item filtering based on user
roles.

**Hooks and Dependencies:**

- `useDisclosure`: Manages the `isOpen` state of the mobile menu.
- `useContext(UserContext)`: Accesses the current user and a function to update the user state.
- `useNavigate`: Programmatic navigation provided by React Router.
- `useColorModeValue`: Theme-aware color selections for backgrounds, borders, and text.

**State and Variables:**

- `isOpen`: Boolean that determines if the mobile navigation is expanded.
- `user`: Object representing the authenticated user.
- `bgColor` & `borderColor`: Color values that change with the app's color mode.
- `NAV_ITEMS`: An array of navigation items where each item is an object with properties:
    - `label`: The text to display (e.g., "Feedback" or "Admin").
    - `href`: The URL path for navigation.
    - `requiresAuth`: A Boolean indicating if the item requires user authentication.

**Internal Functions:**

- **handleLogout:**

    - **Purpose:** Logs out the user by removing the token from local storage, resetting the user
      context, and redirecting to the home page.
    - **Parameters:** None
    - **Returns:** None

- **handleLogoClick:**

    - **Purpose:** Navigates the user to the home page when the logo is clicked.
    - **Parameters:** None
    - **Returns:** None

- **handleNavClick:**

    - **Purpose:** Closes the mobile navigation menu if it is open.
    - **Parameters:** None
    - **Returns:** None

- **Navigation Items Filtering:**
    - Filters `NAV_ITEMS` to exclude items that require authentication if the user is not logged in.

**Render Structure:**

- **Top-Level Box:**
    - A sticky container with a high `zIndex` ensuring the navbar remains on top.
- **Flex Container:**
    - Contains the hamburger icon button for mobile, the logo image (clickable), and the navigation
      links aligned according to screen size.
- **Conditional Rendering:**
    - Renders profile links (Profile, Sign Out) if the user is authenticated.
    - Renders login/signup buttons if the user is not authenticated.
- **Collapse Component:**
    - Wraps the mobile navigation menu shown when `isOpen` is true.

**Return Value:**  
Renders a React element containing the complete navigation bar structure.

---

### DesktopNav

**Description:**  
Renders a horizontal list of navigation links for desktop views. Each navigation item is wrapped in
a popover (if the item has sub-navigation children) to display additional options on hover.

**Parameters:**

- `navItems` (Array): An array of navigation items to render. Each item should have at least a
  `label` and `href` property and optionally `children` for sub-navigation.

**Return Value:**  
A JSX element that renders a horizontal `Stack` of navigation links using Chakra UI components.

---

### DesktopSubNav

**Description:**  
Renders an individual sub-navigation link (used within the popover of a parent navigation item). It
displays a label, optional sub-label, and an icon that slides in on hover.

**Parameters:**

- `label` (String): The text label for the sub-navigation item.
- `href` (String): The URL path for the sub-navigation item.
- `subLabel` (String, optional): Additional descriptive text for the sub-navigation item.

**Return Value:**  
A React element that renders a link styled as a block element with hover transitions.

---

### MobileNav

**Description:**  
Renders a vertical list of navigation items for mobile views. It leverages the `MobileNavItem`
component to render each link and handle collapsible children if available.

**Parameters:**

- `navItems` (Array): An array of navigation items to display in the mobile menu.
- `onNavClick` (Function): Callback function triggered on navigation item click to close the mobile
  menu.

**Return Value:**  
A JSX element that renders a vertical `Stack` containing mobile navigation items.

---

### MobileNavItem

**Description:**  
Handles rendering of individual navigation items for mobile views. If an item includes
sub-navigation children, it uses an internal toggle (via `useDisclosure`) for collapse/expand
functionality.

**Parameters:**

- `label` (String): The text label for the navigation item.
- `href` (String): The URL path for the navigation item.
- `children` (Array, optional): An array of sub-navigation items, each with at least a `label` and
  `href` property.
- `onNavClick` (Function): Callback function that is invoked when the item is clicked, typically
  used to close the mobile menu.

**Return Value:**  
A React element that renders a `Stack` containing the navigation link. If the item has children, the
component includes an icon that toggles the display of the children and a `Collapse` element that
reveals the child links on expansion.

---

## Usage Example

Below is an example of how to integrate the Navbar component into your application.

1.  **Import and Usage in App.jsx**

    In your main application file (e.g., `src/App.jsx`), you would import and use the Navbar
    component as follows:

    ***

    // App.jsx import React, { useState } from 'react'; import { BrowserRouter as Router, Routes,
    Route } from 'react-router-dom'; import Navbar from './Navbar'; import { UserContext } from
    './App'; // Assume UserContext is defined here import Landing from './Landing'; import Feedback
    from './Feedback'; import Login from './Login'; import Profile from './Profile'; // ... other
    imports

    function App() { const [user, setUser] = useState(null);

        return (
            <UserContext.Provider value={{ user, setUser }}>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/feedback" element={<Feedback />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<Profile />} />
                        {/* More routes as required */}
                    </Routes>
                </Router>
            </UserContext.Provider>
        );

    }

    ## export default App;

2.  **Responsive Behavior:**

    - On large screens, the `DesktopNav` component renders a horizontal menu.
    - On small screens, an `IconButton` (hamburger menu) toggles the `MobileNav` component using the
      `Collapse` component.

3.  **Authentication-Based Navigation:**

    - If a user is logged in (`user?.email` exists), the navbar displays links to the profile page
      and a sign-out button.
    - For administrators (`user?.isAdmin === true`), an "Admin" link is conditionally added to the
      navigation items.
    - If no user is logged in, “Login” and “Sign Up” buttons are displayed.

---

## Notes and Considerations

- **Chakra UI Theme:**  
  Ensure that your application is wrapped with the ChakraProvider and has a proper theme
  configuration to take full advantage of `useColorModeValue` and responsive styling.

- **UserContext:**  
  The Navbar relies on a `UserContext` for access to user data and should be provided by a parent
  component (typically in `App.jsx`).

- **Route Definitions:**  
  The paths defined in the navigation items (e.g., "/feedback", "/admin") should correspond to
  actual routes in your React Router configuration.

- **Asset Management:**  
  The logo is imported from a relative path (`./assets/logo.png`), so ensure that the file exists
  and is correctly located relative to `Navbar.jsx`.

- **Extensibility:**  
  The structure of navigation items (e.g., including `children` for sub-navigation) is designed to
  be flexible. Extend the `NAV_ITEMS` array as needed to add additional links or nested menus.

---

This documentation serves as a detailed guide to understand, integrate, and extend the Navbar
component within your project. If further customization is needed, refer to the Chakra UI and React
Router documentation for additional configuration and styling options.

# Documentation for src/App.jsx

This document provides an overview and detailed explanation of the components, constants, and
functionality within the App.jsx file. It also explains the file's role within the overall project
structure and provides usage examples.

---

## Table of Contents

1. [Overview](#overview)
2. [Dependencies](#dependencies)
3. [Environment Constant](#environment-constant)
4. [React Components](#react-components)
    - [Insights](#insights)
    - [Management](#management)
    - [NavigationBar](#navigationbar)
    - [App](#app)
5. [Usage Examples](#usage-examples)
6. [Project Structure and File Role](#project-structure-and-file-role)

---

## Overview

The `src/App.jsx` file serves as the main entry point for the React application. It sets up the
overall application environment by incorporating:

- **Chakra UI**: Provides a design system and UI components.
- **React Router**: Manages routing and navigation for the application.
- **React Icons**: Supplies icon components for use in the navigation bar.
- **Application Routes/components**: Establishes navigation between the landing page (`Landing`),
  presentation page (`PresentationCreator`), and placeholder pages for future features (_Insights_
  and _Management_).
- **Responsive Navigation Bar**: A fixed bottom navigation bar that provides quick links to various
  sections of the application.

---

## Dependencies

The file imports several libraries and components:

- **Chakra UI**
    - `ChakraProvider`, `Box`, `Icon`: For theming, layout, and icon styling.
- **React Router DOM**
    - `BrowserRouter`, `Routes`, `Route`, `Navigate`, `Link`: For routing and navigation.
- **React Icons (Feather icons)**
    - `FiActivity`, `FiBarChart2`, `FiUsers`, `FiUser`: For iconography in the navigation bar.
- **Local components**
    - `Landing`: The landing page component imported from './Landing'.
    - `PresentationCreator`: The presentation creation component imported from
      './PresentationCreator'.

---

## Environment Constant

### API_URL

```jsx
export const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://autoresearch.pro';
```

- **Purpose:**  
  Determines the base URL for API calls based on the environment. It points to a local server during
  development (when `import.meta.env.DEV` is true) and a production server otherwise.

- **Usage:**  
  Any module that requires the API endpoint for making HTTP requests can import the `API_URL`
  constant.

---

## React Components

### Insights

```jsx
const Insights = () => (
    <Box p={4}>
        <Box fontSize="xl" fontWeight="bold" mb={2}>
            Insights
        </Box>
        <Box>This feature is coming soon.</Box>
    </Box>
);
```

- **Description:**  
  A placeholder component that represents the Insights section. It informs users that the feature
  will be available in the future.
- **Parameters:**

    - None

- **Return Value:**  
  A JSX element comprising of styled `Box` components that display the title "Insights" and a
  message.

---

### Management

```jsx
const Management = () => (
    <Box p={4}>
        <Box fontSize="xl" fontWeight="bold" mb={2}>
            Management
        </Box>
        <Box>This feature is coming soon.</Box>
    </Box>
);
```

- **Description:**  
  A placeholder component for potential management-related functionality. It simply displays the
  section title and a notification message.
- **Parameters:**

    - None

- **Return Value:**  
  A JSX element that includes some basic Chakra UI boxes with text.

---

### NavigationBar

```jsx
const NavigationBar = () => (
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
        <Box
            as={Link}
            to="/research"
            p={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <Icon as={FiActivity} boxSize={5} />
            <Box fontSize="xs">Research</Box>
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
            <Box fontSize="xs">Presentation</Box>
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
            <Box fontSize="xs">Insights</Box>
        </Box>
        <Box
            as={Link}
            to="/management"
            p={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <Icon as={FiUsers} boxSize={5} />
            <Box fontSize="xs">Management</Box>
        </Box>
    </Box>
);
```

- **Description:**  
  Implements a fixed bottom navigation bar using Chakra UI’s Box component. The navigation bar
  includes four links:

    - Research
    - Presentation
    - Insights
    - Management

- **Parameters:**

    - None

- **Return Value:**  
  A JSX element that renders the navigation bar with styled links and icons. The styling ensures it
  remains fixed at the bottom of the viewport with responsive design considerations (e.g., backdrop
  blur).

---

### App

```jsx
function App() {
    return (
        <ChakraProvider>
            <Router>
                <Box pb="50px">
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/presentation" element={<PresentationCreator />} />
                        <Route path="/insights" element={<Insights />} />
                        <Route path="/management" element={<Management />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <NavigationBar />
                </Box>
            </Router>
        </ChakraProvider>
    );
}

export default App;
```

- **Description:**  
  The main component of the application. It wraps the application in necessary providers and
  routers:

    - **ChakraProvider:** Ensures that Chakra UI theming and styling are applied.
    - **Router (BrowserRouter):** Manages the client-side routing.
    - **Routes:** Defines application routes with the following mapping:
        - `/`: Renders the `Landing` component.
        - `/presentation`: Renders the `PresentationCreator` component.
        - `/insights`: Renders the `Insights` placeholder.
        - `/management`: Renders the `Management` placeholder.
        - Any undefined route (`*`) redirects to the home page (`/`).
    - **NavigationBar:** Placed at the bottom of the page to ensure navigation throughout the
      application.

- **Parameters:**

    - None

- **Return Value:**  
  A JSX element that encapsulates the entire application's layout, route configuration, and bottom
  navigation bar.

---

## Usage Examples

### Running the Application

Assuming the project uses a bundler like Vite or a similar tool, the `App.jsx` is imported and
rendered in `src/main.jsx`. An example `main.jsx` might look like this:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

### Importing the API_URL Constant

Other modules or services in the project can import `API_URL` to configure HTTP requests:

```jsx
import { API_URL } from './App';

fetch(`${API_URL}/api/some-endpoint`)
    .then((response) => response.json())
    .then((data) => console.log(data));
```

---

## Project Structure and File Role

The overall project structure is as follows:

```
.
├── .prettierrc
├── copy.cmd
├── docker-compose.yml
├── Dockerfile
├── index.html
├── landing.html
├── package.json
├── vite.config.js
├── src
│   ├── App.jsx                <-- Main application file (this file)
│   ├── Landing.jsx            <-- Landing page component
│   ├── main.jsx               <-- Entry point where App is rendered
│   └── PresentationCreator.jsx <-- Component for creating presentations
├── server
│   ├── claude.js
│   ├── gemini.js
│   ├── index.js
│   ├── package.json
│   ├── presentationSchema.json
│   └── models
│       ├── Presentation.js
│       └── User.js
├── public
│   ├── ads.txt
│   ├── landing.html
│   └── robots.txt
└── docs
    ├── landing_page_copy.html
    └── social_media_content.json
```

- **Role of App.jsx:**
    - Acts as the central hub for client-side routing.
    - Integrates global theming using Chakra UI.
    - Provides a consistent layout with a persistent bottom navigation.
    - Orchestrates the rendering of different pages/components based on the URL.

---

This comprehensive documentation should help developers understand the structure, functionality, and
usage of the `App.jsx` file within the overall project context.

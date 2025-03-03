# Admin Dashboard Component Documentation

This document provides comprehensive documentation for the file **src/Admin.jsx**. It covers an
overview, detailed descriptions of functions and methods, parameters, return values, and usage
examples. This component is a key part of the project’s frontend admin interface and is built with
React and Chakra UI.

---

## Table of Contents

1. [Overview](#overview)
2. [File Structure & Dependencies](#file-structure--dependencies)
3. [Component: Admin](#component-admin)
4. [Functions and Methods](#functions-and-methods)
    - [fetchData](#fetchdata)
    - [handleDelete](#handledelete)
    - [handleSubscriptionChange](#handlesubscriptionchange)
    - [renderOverviewTab](#renderoverviewtab)
5. [Component Layout and Behavior](#component-layout-and-behavior)
6. [Usage Example](#usage-example)
7. [Future Improvements](#future-improvements)

---

## Overview

The **Admin** component provides an administrative dashboard interface for managing key entities
within the application such as users, presentations, and user feedback. The dashboard presents
statistical overviews using charts, detailed tables for each entity, and actions for updating or
deleting records. It utilizes several Chakra UI components for layout and style as well as Chart.js
(via react-chartjs-2) to render growth charts.

---

## File Structure & Dependencies

The project tree indicates that **src/Admin.jsx** is part of a larger frontend application. Here is
a brief excerpt of the project structure related to this file:

```
project-root/
├── src/
│   ├── Admin.jsx         <-- (This file)
│   ├── App.jsx
│   ├── Feedback.jsx
│   ├── Presentation.jsx
│   └── ...other components
├── server/
│   ├── admin.js
│   ├── user.js
│   └── ...other server files
├── public/
└── docs/
```

### Main Dependencies

- **React**: Core library to build the functional component and identity hooks like `useState`,
  `useEffect`, `useCallback`, and `useRef`.
- **Chakra UI**: Provides the UI components (Container, Table, Card, Tabs, AlertDialog, etc.) and
  utility hooks (useToast).
- **Chart.js & react-chartjs-2**: Used to render interactive charts (line charts for displaying user
  and presentation growth).
- **API_URL Constant**: Imported from `App.jsx`, used for constructing API endpoint URLs.

---

## Component: Admin

The **Admin** component is the default export of the file and acts as the main administrative
dashboard. It is designed to:

- Fetch and display statistical data (dashboard metrics, user and presentation growth).
- Render tables for managing users, presentations, and feedback.
- Allow administrative actions such as updating a user’s subscription status and deleting items.
- Provide a refresh mechanism to re-fetch data.

### State Variables

- **stats**: Object holding dashboard statistics, user growth data, and presentation statistics.
- **users**: Array of user objects.
- **presentations**: Array of presentation objects.
- **feedbacks**: Array of feedback objects.
- **isDeleteAlertOpen**: Boolean flag to control the display of the deletion confirmation dialog.
- **itemToDelete**: Object that stores the `id` and `type` of the item that is pending deletion.
- **isLoading**: Boolean flag indicating whether data is being loaded.
- **selectedTab**: Number representing the currently active tab in the dashboard.

---

## Functions and Methods

### fetchData

- **Purpose**:  
  Fetches all necessary data for the dashboard from multiple API endpoints concurrently. This
  includes dashboard statistics, user data, presentations, and feedback.

- **Implementation Details**:

    - Reads the authorization token from `localStorage`.
    - Uses the `Promise.all` method to perform concurrent API calls.
    - Updates state variables: `stats`, `users`, `presentations`, and `feedbacks`.
    - Displays a toast (via Chakra UI’s `useToast`) on errors.
    - Toggles the `isLoading` state correctly on start and completion.

- **Parameters**:  
  No external parameters. The function accesses required values from state and context.

- **Return Value**:  
  Returns a Promise that resolves once the data is successfully fetched or an error is handled; no
  explicit return value is used in the component.

- **Usage**:  
  The function is invoked on component mount (via `useEffect`) and also when the user clicks the
  "Refresh" button.

---

### handleDelete

- **Purpose**:  
  Deletes an item (user, presentation, or feedback) from the system using a DELETE API endpoint
  based on the current `itemToDelete` state.

- **Implementation Details**:

    - Retrieves the token from `localStorage`.
    - Constructs the dynamic URL using `itemToDelete.type` and `itemToDelete.id`.
    - Sends a DELETE request; on success, a success toast is displayed, and data is re-fetched.
    - On failure, an error toast is shown.
    - Closes the deletion confirmation dialog by updating `isDeleteAlertOpen`.

- **Parameters**:  
  No parameters are directly passed to the function; it relies on the `itemToDelete` state.

- **Return Value**:  
  Returns a Promise that resolves after the deletion operation, with side effects on component
  state.

- **Usage**:  
  Bound to the "Delete" button inside the AlertDialog for deletion confirmation.

---

### handleSubscriptionChange

- **Purpose**:  
  Updates a user's subscription status by issuing a PUT request to the user subscription endpoint.

- **Implementation Details**:

    - Accepts the user’s unique identifier and the new subscription status as parameters.
    - Sends a PUT request, including a JSON payload with the new subscription status.
    - On a successful response, updates the `users` state locally.
    - Displays toast notifications for success or error.

- **Parameters**:

    - userId (String): The unique identifier of the user whose subscription is to be updated.
    - newStatus (String): The new subscription status (e.g., "active", "free", "trialing", etc.).

- **Return Value**:  
  Returns a Promise that resolves when the update is complete, with updated local state.

- **Usage**:  
  Invoked when a user changes the subscription using the provided `<Select>` in the "Users" tab.

---

### renderOverviewTab

- **Purpose**:  
  Renders the "Overview" tab content which includes statistics cards and line charts for user growth
  and presentation growth.

- **Implementation Details**:

    - Uses Chakra UI components (e.g., `StatGroup`, `SimpleGrid`, `Card`) to display aggregated
      metrics.
    - Processes keys of `stats.stats` to create individual cards.
    - Renders two line charts (if data is available): one for user growth and one for presentation
      growth.
    - Configures charts with dataset labels, data points, and styling options.

- **Parameters**:  
  No parameters; uses the component’s state (`stats` and `presentations`).

- **Return Value**:  
  Returns a JSX element that represents the entire overview tab content.

- **Usage**:  
  Invoked within the `<TabPanel>` for the Overview tab in the main component render method.

---

## Component Layout and Behavior

1. **Loading State**:

    - When data is being fetched (i.e., `isLoading` is true and no users are available), the
      component displays a full-height centered spinner.

2. **Header Section**:

    - The header includes the "Admin Dashboard" title and a "Refresh" button, which will re-run
      `fetchData`.

3. **Tabs**:

    - The component is organized using Chakra UI’s `<Tabs>` with four panels:
        - **Overview**: Shows general statistics and growth charts.
        - **Users**: Displays a table of user data. Includes subscription management controls and
          delete actions.
        - **Presentations**: Displays a table of presentations with delete actions.
        - **Feedback**: Displays a table of user feedback with type badges and delete actions.

4. **Alert Dialog**:

    - An `AlertDialog` is used to confirm deletion of any item. The dialog is controlled by the
      `isDeleteAlertOpen` state and is hooked into the `handleDelete` function.

5. **Charts Rendering**:
    - The component uses the `Line` chart component from react-chartjs-2 to render charts
      dynamically based on available statistical data.

---

## Usage Example

Below is a simple example of how to integrate the **Admin** component into your application (e.g.,
in a routing setup):

```jsx
// Example: src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './Admin';
import Landing from './Landing';
import Login from './Login';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Other application routes */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Landing />} />
            </Routes>
        </Router>
    );
};

export default App;
```

In this example, navigating to `/admin` will render the Admin Dashboard.

---

## Future Improvements

- **Pagination and Filtering**: Enhance tables (Users, Presentations, Feedback) to support
  pagination, searching, and sorting.
- **Enhanced Error Handling**: Consider more granular error responses and UI feedback for network
  errors.
- **Optimistic UI Updates**: Implement optimistic updates to improve user experience on subscription
  changes and deletions.
- **Role-Based Access**: Integrate role-based authentication to secure the admin panel.
- **Unit & Integration Tests**: Add comprehensive tests for this component using testing libraries
  like Jest and React Testing Library.

---

This documentation should provide you with a clear understanding of the purpose and functionality of
**src/Admin.jsx**. The component plays an essential role in the administration process and serves as
the backbone for monitoring and managing key aspects of the application.

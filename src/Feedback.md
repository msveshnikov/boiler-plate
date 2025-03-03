# Feedback.jsx Documentation

This document provides a comprehensive overview of the Feedback.jsx component, including its
purpose, functionality, integration details, and usage examples within the context of the overall
project.

---

## Table of Contents

1. [Overview](#overview)
2. [File Location and Project Structure](#file-location-and-project-structure)
3. [Dependencies](#dependencies)
4. [Component Description](#component-description)
5. [State Variables](#state-variables)
6. [Methods and Event Handlers](#methods-and-event-handlers)
    - [handleSubmit](#handlesubmit)
7. [API Integration](#api-integration)
8. [Usage Example](#usage-example)
9. [Additional Notes](#additional-notes)

---

## Overview

The `Feedback.jsx` component is a React functional component that enables users to submit feedback
regarding the application. Users are given the option to indicate whether they are reporting a bug
or suggesting a new feature, along with a description of the issue or suggestion. Feedback is sent
to a backend API endpoint. The component utilizes Chakra UI for UI components and styling, providing
a clean interface and toast notifications for user feedback on submission success or errors.

---

## File Location and Project Structure

The `Feedback.jsx` file is located in the `src` directory of the project. The overall project
structure is organized as follows:

```
project-root/
│
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── index.html
├── package.json
├── ...
├── src/
│   ├── Admin.jsx
│   ├── App.jsx
│   ├── Feedback.jsx   <-- This file
│   ├── Forgot.jsx
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── main.jsx
│   ├── Navbar.jsx
│   ├── Presentation.jsx
│   ├── PresentationCreator.jsx
│   ├── PresentationList.jsx
│   ├── Privacy.jsx
│   ├── Profile.jsx
│   ├── Reset.jsx
│   ├── SignUp.jsx
│   └── Terms.jsx
├── server/
│   ├── admin.js
│   ├── claude.js
│   ├── gemini.js
│   ├── imageService.js
│   ├── index.js
│   ├── openai.js
│   ├── package.json
│   ├── presentationSchema.json
│   ├── user.js
│   └── models/
│       ├── Feedback.js   <-- Related backend model
│       ├── Presentation.js
│       └── User.js
│       └── middleware/
│           └── auth.js
└── public/
    ├── ads.txt
    ├── landing.html
    └── robots.txt
```

In this structure, `Feedback.jsx` plays a key role in the front-end, enabling users to interact with
the system by submitting feedback, which is then processed by a corresponding backend model
(`Feedback.js` under the `server/models` directory).

---

## Dependencies

The component depends on the following libraries and modules:

- **React:**
    - `useState` for managing local state.
- **Chakra UI:**  
  Provides UI components and hooks, including:

    - `Box`, `Button`, `FormControl`, `FormLabel`, `Textarea`, `VStack`, `Select`, `Heading`,
      `Text`, and `useToast`.

- **API_URL Constant:**  
  Imported from `./App`, this constant holds the base URL for the backend API server.

---

## Component Description

### Feedback Component

The `Feedback` component renders a feedback form with the following elements:

- A dropdown to select the type of feedback (Bug Report or Feature Request).
- A textarea input for the user to enter a detailed description.
- A submit button that triggers the `handleSubmit` function.

When the form is submitted, the component:

1. Validates the description field to ensure it is not empty.
2. Retrieves an authentication token from localStorage (if available).
3. Sends a POST request with the feedback data to the backend API.
4. Provides real-time feedback to the user via toast notifications:
    - **Success:** A success toast is shown, and the form is reset.
    - **Warning/Error:** Appropriate warnings or errors are displayed based on the response.

---

## State Variables

The component utilizes three pieces of state managed by React’s `useState` hook:

- **feedbackType (string):**  
  Controls the type of feedback being submitted.  
  _Default Value:_ `'bug'`  
  _Options:_ `'bug'` (Bug Report), `'feature'` (Feature Request)

- **description (string):**  
  Holds the detailed description input provided by the user.

- **loading (boolean):**  
  Indicates whether the feedback submission process is in progress.  
  Used to trigger a loading state on the submit button.

---

## Methods and Event Handlers

### handleSubmit

The `handleSubmit` function is the core event handler for the feedback form submission.

#### Description

- **Event Prevention:**  
  Prevents the default form submission behavior using `e.preventDefault()`.

- **Input Validation:**  
  Checks if the description field is empty. If empty, it displays a warning toast message and exits
  early.

- **Loading State:**  
  Sets the `loading` state to `true` to indicate the feedback is being processed.

- **API Request:**

    - Retrieves an optional token from localStorage for authorization.
    - Sends a POST request to the endpoint `${API_URL}/api/feedback` with the feedback data
      (feedback type and description) in JSON format.
    - Sets the `Authorization` header if a token is present.

- **Response Handling:**

    - **On Success:**
        - Displays a success toast message.
        - Resets the feedback form fields to their default state.
    - **On Error:**
        - If the response is not ok, it parses the error message and displays it using an error
          toast.

- **Reset Loading State:**  
  Resets the `loading` state to `false` once the process is complete.

#### Parameters

- **e (Event):**  
  The form submission event object.

#### Return Value

- The function does not return any value; it performs side effects such as API calls and state
  updates.

---

## API Integration

The component communicates with the backend using the Fetch API. Specific integration details
include:

- **Endpoint:**  
  `${API_URL}/api/feedback`

- **HTTP Method:**  
  POST

- **Headers:**

    - `Content-Type: 'application/json'`
    - `Authorization: 'Bearer <token>'` (if available)

- **Request Body:**  
  A JSON object containing:

    - `type`: The feedback type (either `'bug'` or `'feature'`).
    - `message`: The feedback description.

- **Response Handling:**
    - Parses the response to either display success or error notifications via Chakra UI's toast.

---

## Usage Example

To include the `Feedback` component in your application, import and embed it within any other
component or page. For example, in your `App.jsx`:

---

import React from 'react'; import Feedback from './Feedback';

function App() { return ( <div> <h1>Welcome to Our Application</h1> <Feedback /> </div> ); }

## export default App;

This example demonstrates a simple integration of the feedback form into the main app layout.

---

## Additional Notes

- **Design and Styling:**  
  The component leverages Chakra UI for its design, ensuring a responsive and consistent user
  interface.
- **Token Management:**  
  The component expects a token in localStorage for authenticated routes. This token is used to set
  the `Authorization` header for the API request, linking the feedback to a specific user if
  necessary.

- **Error Handling Assumptions:**  
  It is assumed that the backend API returns a JSON object containing an `error` property when a
  failure occurs. If not, a generic error message is displayed.

- **Form Reset:**  
  On successful submission, the form resets the feedback type to the default (`'bug'`) and clears
  the description, readying the form for another potential submission.

---

This documentation should assist developers in understanding the purpose, structure, and
functionality of the Feedback.jsx component, as well as provide clear guidelines for integration
within the larger project.

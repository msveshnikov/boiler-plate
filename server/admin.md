# Admin Routes API Documentation

This document provides a comprehensive guide to the administrative API routes defined in the file
`server/admin.js`. It covers an overview of the module, detailed descriptions of each endpoint
(including parameters, return values, and error handling), middleware dependencies, usage examples,
and its role within the overall project structure.

---

## Overview

The `server/admin.js` module defines a set of administrative endpoints for managing users,
presentations, and feedbacks in the application. The routes are registered by the exported function
`adminRoutes(app)`, which accepts an Express application instance.

Key characteristics:

- **Authentication & Authorization:** Every route is secured using the `authenticateToken` and
  `isAdmin` middlewares (imported from `./middleware/auth.js`) to ensure that only authenticated
  administrators can access these endpoints.
- **Database Models:** It interacts with three main Mongoose models:
    - **User** (`./models/User.js`)
    - **Presentation** (`./models/Presentation.js`)
    - **Feedback** (`./models/Feedback.js`)
- **Error Handling:** If a database or operational error occurs, the route returns a 500 status code
  with a JSON error message. Specific resource checks (e.g., not found) return a 404 status code.

---

## Project Structure Context

Within the overall project, the `server/admin.js` file is part of the backend codebase. The project
structure includes:

- **Client-side:** Contains React components (in the `src` folder) such as `Admin.jsx`, `Login.jsx`,
  etc.
- **Server-side:** Contains several API endpoint files including `admin.js`, `user.js`, and others.
  The `admin.js` helps expose administrative operations that are often consumed by the front-end
  admin pages (such as `Admin.jsx`).
- **Public & Docs:** Static assets and documentation files.

The administrative endpoints provided in this module typically interface with the frontend admin
panel for displaying dashboards, user lists, feedback, and handling delete/update operations.

---

## Endpoints

Below is a detailed description of each route defined in `server/admin.js`.

---

### 1. GET /api/admin/users

**Description:**  
Retrieves a list of all registered users. The password field is excluded from the returned data. The
list is sorted by creation date (most recent first).

**Middlewares:**

- `authenticateToken`
- `isAdmin`

**Route Handler Details:**

- Uses `User.find()` to fetch all user documents.
- Uses Mongoose’s `.select('-password')` to exclude password fields.
- Sorts users using `.sort({ createdAt: -1 })`.

**Response:**

- On success: Returns a JSON array of user objects.
- On error: Returns status 500 with JSON:
    ```json
    { "error": "Internal server error" }
    ```

**Usage Example:**

```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer <your_admin_token>"
```

---

### 2. GET /api/admin/dashboard

**Description:**  
Provides various aggregated statistics for the dashboard, including user counts, subscription
conversions, and growth metrics for users and presentations over the last 30 days.

**Middlewares:**

- `authenticateToken`
- `isAdmin`

**Route Handler Details:**

- Aggregates the following concurrently using `Promise.all`:
    - **totalUsers:** Total number of users.
    - **premiumUsers:** Count of users with `subscriptionStatus: 'active'`.
    - **trialingUsers:** Count of users with `subscriptionStatus: 'trialing'`.
    - **totalPresentations:** Total number of presentations.
    - **userGrowth:** Aggregation data grouped by creation date for users.
    - **presentationGrowth:** Aggregation data grouped by creation date for presentations.
- Converts the conversion rate (premiumUsers/totalUsers) into a percentage, formatted to two
  decimals.

**Response:**

- On success: Returns a JSON object, for example:
    ```json
    {
      "stats": {
        "totalUsers": 100,
        "premiumUsers": 25,
        "trialingUsers": 10,
        "conversionRate": "25.00"
      },
      "userGrowth": [
        { "_id": "2023-09-01", "count": 5 },
        { "_id": "2023-09-02", "count": 8 },
        ...
      ],
      "presentationsStats": {
        "totalPresentations": 200,
        "presentationGrowth": [
          { "_id": "2023-09-01", "count": 10 },
          { "_id": "2023-09-02", "count": 15 },
          ...
        ]
      }
    }
    ```
- On error: Returns status 500 with JSON:
    ```json
    { "error": "Internal server error" }
    ```

**Usage Example:**

```bash
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer <your_admin_token>"
```

---

### 3. GET /api/admin/feedbacks

**Description:**  
Fetches all user feedbacks stored in the database.

**Middlewares:**

- `authenticateToken`
- `isAdmin`

**Route Handler Details:**

- Utilizes `Feedback.find()` to retrieve feedback documents.
- Uses `.populate('userId', 'email')` to include the associated user's email information.
- Sorts the data by creation date in descending order.

**Response:**

- On success: Returns an array of feedback objects.
- On error: Returns a 500 status JSON error.

**Usage Example:**

```bash
curl -X GET http://localhost:3000/api/admin/feedbacks \
  -H "Authorization: Bearer <your_admin_token>"
```

---

### 4. GET /api/admin/presentations

**Description:**  
Retrieves all presentations. Each presentation includes the associated user’s email via the Mongoose
populate feature.

**Middlewares:**

- `authenticateToken`
- `isAdmin`

**Route Handler Details:**

- Uses `Presentation.find()` and populates the `userId` field (email only).
- Sorted by creation date (newest first).

**Response:**

- On success: Returns a JSON array of presentation objects.
- On error: Returns status 500 with an error message.

**Usage Example:**

```bash
curl -X GET http://localhost:3000/api/admin/presentations \
  -H "Authorization: Bearer <your_admin_token>"
```

---

### 5. DELETE /api/admin/users/:id

**Description:**  
Deletes a user specified by the `id` parameter. Additionally, deletes all presentations associated
with that user.

**Middlewares:**

- `authenticateToken`
- `isAdmin`

**Route Handler Details:**

- Uses `User.findByIdAndDelete(req.params.id)` to remove the user.
- If no user is found, returns a 404 error.
- Deletes the associated presentations via `Presentation.deleteMany({ userId: req.params.id })`.

**Response:**

- On success: Returns a JSON message confirming deletion:
    ```json
    { "message": "User and associated data deleted successfully" }
    ```
- On resource not found: Returns status 404 with an error JSON.
- On error: Returns a 500 status JSON error.

**Usage Example:**

```bash
curl -X DELETE http://localhost:3000/api/admin/users/USER_ID \
  -H "Authorization: Bearer <your_admin_token>"
```

---

### 6. DELETE /api/admin/feedbacks/:id

**Description:**  
Deletes a feedback entry specified by the `id` parameter.

**Middlewares:**

- `authenticateToken`
- `isAdmin`

**Route Handler Details:**

- Uses `Feedback.findByIdAndDelete(req.params.id)`.
- Returns 404 if the feedback is not found.

**Response:**

- On success: Returns:
    ```json
    { "message": "Feedback deleted successfully" }
    ```
- On resource not found: Returns status 404.
- On error: Returns status 500 with an error message.

**Usage Example:**

```bash
curl -X DELETE http://localhost:3000/api/admin/feedbacks/FEEDBACK_ID \
  -H "Authorization: Bearer <your_admin_token>"
```

---

### 7. DELETE /api/admin/presentations/:id

**Description:**  
Deletes a presentation specified by the `id` parameter.

**Middlewares:**

- `authenticateToken`
- `isAdmin`

**Route Handler Details:**

- Uses `Presentation.findByIdAndDelete(req.params.id)`.
- Returns a 404 status if the presentation is not found.

**Response:**

- On success: Returns:
    ```json
    { "message": "Presentation deleted successfully" }
    ```
- On resource not found: Returns status 404.
- On error: Returns a 500 status JSON.

**Usage Example:**

```bash
curl -X DELETE http://localhost:3000/api/admin/presentations/PRESENTATION_ID \
  -H "Authorization: Bearer <your_admin_token>"
```

---

### 8. PUT /api/admin/users/:id/subscription

**Description:**  
Updates a user’s subscription status. The new status must be one of the allowed values.

**Middlewares:**

- `authenticateToken`
- `isAdmin`

**Request Body:**

- JSON object containing:
    ```json
    {
        "subscriptionStatus": "active" // or "free", "trialing", "past_due", "canceled", "incomplete_expired"
    }
    ```

**Route Handler Details:**

- Validates that the provided `subscriptionStatus` is one of the following:
    - "active"
    - "free"
    - "trialing"
    - "past_due"
    - "canceled"
    - "incomplete_expired"
- If invalid, returns a 400 status with an error message.
- Looks up the user by `req.params.id`. If not found, returns a 404 error.
- Updates the subscription status and saves the user.

**Response:**

- On success: Returns:
    ```json
    { "message": "User subscription updated successfully" }
    ```
- On invalid subscription status: Returns status 400:
    ```json
    { "error": "Invalid subscription status" }
    ```
- On resource not found: Returns status 404.
- On error: Returns a 500 status JSON.

**Usage Example:**

```bash
curl -X PUT http://localhost:3000/api/admin/users/USER_ID/subscription \
  -H "Authorization: Bearer <your_admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"subscriptionStatus": "active"}'
```

---

## Integration and Usage in the Project

### How to Register Admin Routes

In your main server file (for example, `server/index.js`), you would import and register the admin
routes as follows:

```javascript
import express from 'express';
import adminRoutes from './admin.js';

const app = express();

// Middlewares for parsing JSON
app.use(express.json());

// Register admin routes
adminRoutes(app);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

### Middleware Dependencies

- **authenticateToken:**  
  Ensures that the request has a valid authentication token. Typically checks the header for a
  bearer token.
- **isAdmin:**  
  Verifies that the authenticated user has administrative privileges. Both of these middlewares are
  defined in `server/middleware/auth.js`.

---

## Summary

The `server/admin.js` file is central to administration activities in the application. It provides
secure endpoints to:

- Retrieve users, feedbacks, presentations, and dashboard statistics.
- Remove users (with cascade deletion for associated data), presentations, and feedbacks.
- Update user subscription statuses with proper validation.

This module is essential for both the backend administrative operations and the integration with the
frontend admin panel, ensuring that only authorized admin users can perform these sensitive actions.

Feel free to refer to this documentation when updating or debugging the admin endpoints.

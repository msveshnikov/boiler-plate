# Authentication Middleware Documentation

## Overview

The `auth.js` middleware file handles authentication and authorization for the server-side
application. It provides two main middleware functions for protecting routes and verifying user
permissions using JSON Web Tokens (JWT).

## Location

`server/middleware/auth.js`

## Dependencies

- `jsonwebtoken`: For JWT verification
- `../models/User.js`: User model for database queries

## Middleware Functions

### authenticateToken

Validates the JWT token provided in request headers.

#### Parameters

- `req`: Express request object
- `res`: Express response object
- `next`: Express next middleware function

#### Process

1. Extracts the Bearer token from the Authorization header
2. Verifies the token using the JWT_SECRET environment variable
3. If valid, adds the decoded user data to the request object

#### Responses

- `401`: No token provided
- `403`: Invalid token
- Calls `next()` if authentication succeeds

#### Usage Example

```javascript
import { authenticateToken } from './middleware/auth.js';

// Protect a route
router.get('/protected-route', authenticateToken, (req, res) => {
    // Access authenticated user data via req.user
    res.json({ message: 'Protected data' });
});
```

### isAdmin

Verifies if the authenticated user has administrator privileges.

#### Parameters

- `req`: Express request object (must contain user data from authenticateToken)
- `res`: Express response object
- `next`: Express next middleware function

#### Process

1. Queries the database for the user using the ID from the authenticated token
2. Checks if the user has admin privileges

#### Responses

- `403`: User is not an administrator
- `500`: Server error during verification
- Calls `next()` if user is an administrator

#### Usage Example

```javascript
import { authenticateToken, isAdmin } from './middleware/auth.js';

// Protect an admin route
router.post('/admin/action', authenticateToken, isAdmin, (req, res) => {
    // Only administrators can access this route
    res.json({ message: 'Admin action successful' });
});
```

## Common Implementation

These middleware functions are typically used together to protect routes that require authentication
and/or administrative privileges:

```javascript
// Public route - no middleware
router.get('/public', publicController);

// Protected route - requires authentication
router.get('/protected', authenticateToken, protectedController);

// Admin route - requires authentication and admin privileges
router.get('/admin', authenticateToken, isAdmin, adminController);
```

## Environment Variables

- `JWT_SECRET`: Required environment variable for JWT token verification

## Security Considerations

- Tokens should be transmitted securely over HTTPS
- JWT_SECRET should be kept secure and never exposed
- Token expiration should be handled appropriately
- Admin privileges should be carefully managed in the database

## Related Files

- `server/models/User.js`: Contains the user model with isAdmin field
- `server/user.js`: Likely contains user-related routes
- `server/admin.js`: Likely contains admin-specific routes

This middleware is crucial for maintaining security in the application by protecting routes and
ensuring proper access control based on user roles and authentication status.

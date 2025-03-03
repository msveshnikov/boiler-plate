# User Model Documentation

This document provides a comprehensive overview of the User model defined in the file
`server/models/User.js`. The User model serves as the primary data schema for user-related
information in the application, leveraging Mongoose for MongoDB object modeling.

---

## Table of Contents

1. [Overview](#overview)
2. [Schema Definition](#schema-definition)
    - [User Fields](#user-fields)
    - [Nested Objects](#nested-objects)
3. [Timestamps & Model Creation](#timestamps--model-creation)
4. [Usage Examples](#usage-examples)
5. [Integration in the Project](#integration-in-the-project)
6. [Dependencies](#dependencies)

---

## Overview

The file `server/models/User.js` defines the schema for user information, including authentication
details, personal profile fields, subscription details, preferences for the application, and
additional settings related to research and presentations. This schema is created using Mongoose, a
popular ODM (Object Data Modeling) library for MongoDB in Node.js. Once the schema is defined, a
Mongoose model is instantiated, which is then used throughout the server to interact with the
MongoDB database (e.g., creating, reading, updating, and deleting user data).

---

## Schema Definition

The `UserSchema` includes several fields with validations, default values, and data types. The
schema is defined as follows:

### User Fields

- **email**

    - _Type:_ String
    - _Attributes:_
        - **required:** true
        - **unique:** true
        - **trim:** true
        - **lowercase:** true
    - _Description:_ Represents the user's email address. It is required, must be unique, and is
      automatically transformed to lowercase with whitespace trimmed.

- **password**

    - _Type:_ String
    - _Attributes:_ **required:** true
    - _Description:_ Stores the user's password (usually hashed).

- **firstName**

    - _Type:_ String
    - _Attributes:_
        - **trim:** true
        - **default:** ''
    - _Description:_ The user's first name. Optional; defaults to an empty string.

- **lastName**

    - _Type:_ String
    - _Attributes:_
        - **trim:** true
        - **default:** ''
    - _Description:_ The user's last name. Optional; defaults to an empty string.

- **profilePicture**

    - _Type:_ String
    - _Attributes:_ **default:** ''
    - _Description:_ URL or path to the user's profile picture.

- **subscriptionStatus**

    - _Type:_ String
    - _Attributes:_ **default:** 'free'
    - _Description:_ Indicates the user's subscription status (e.g., free, premium).

- **subscriptionId**

    - _Type:_ String
    - _Attributes:_ **default:** ''
    - _Description:_ Identifier for the user's subscription, useful when integrating with payment or
      subscription management services.

- **lastAiRequestTime**

    - _Type:_ Date
    - _Description:_ Stores the timestamp of the last AI request made by the user.

- **aiRequestCount**

    - _Type:_ Number
    - _Attributes:_ **default:** 0
    - _Description:_ Tracks the number of AI-related requests the user has made.

- **resetPasswordToken**

    - _Type:_ String
    - _Attributes:_ **default:** ''
    - _Description:_ Token used for verifying password reset requests.

- **resetPasswordExpires**

    - _Type:_ Date
    - _Description:_ Expiration date/time for the password reset token.

- **verificationToken**

    - _Type:_ String
    - _Attributes:_ **default:** ''
    - _Description:_ Token used to verify the user's email address.

- **emailVerified**

    - _Type:_ Boolean
    - _Attributes:_ **default:** false
    - _Description:_ Indicates whether the user’s email address has been verified.

- **isAdmin**
    - _Type:_ Boolean
    - _Attributes:_ **default:** false
    - _Description:_ Specifies if the user has administrative privileges.

---

### Nested Objects

The model contains several nested objects to handle grouped settings and preferences:

1. **preferences**

    - _Fields:_
        - **language**
            - _Type:_ String
            - _Default:_ 'en'
        - **notifications**
            - _Type:_ Boolean
            - _Default:_ true
        - **theme**
            - _Type:_ String
            - _Enum:_ ['light', 'dark']
            - _Default:_ 'light'
    - _Description:_ Stores user interface preferences such as language, notification settings, and
      the UI theme.

2. **researchPreferences**

    - _Fields:_
        - **field**
            - _Type:_ String
            - _Attributes:_ **trim:** true, **default:** ''
        - **dataSources**
            - _Type:_ String
            - _Attributes:_ **trim:** true, **default:** ''
        - **aiAssistance**
            - _Type:_ String
            - _Enum:_ ['', 'minimal', 'moderate', 'full']
            - _Default:_ ''
    - _Description:_ Contains user preferences for research areas, preferred data sources, and the
      level of AI assistance.

3. **presentationSettings**
    - _Fields:_
        - **slideLayout**
            - _Type:_ String
            - _Enum:_ ['', 'title', 'bullet', 'image']
            - _Default:_ ''
        - **theme**
            - _Type:_ String
            - _Enum:_ ['', 'light', 'dark', 'auto']
            - _Default:_ ''
    - _Description:_ Manages settings for creating presentations, including slide layout type and
      presentation theme.

---

## Timestamps & Model Creation

The schema is configured with the option `{ timestamps: true }`, which automatically adds
`createdAt` and `updatedAt` fields to each document.

After defining the schema, the Mongoose model is created and exported:

- **Model Name:** User
- **Usage:** This model is used to interact with the `users` collection in the MongoDB database. It
  provides methods such as `.create()`, `.find()`, `.findById()`, `.update()`, and more through the
  Mongoose API.

Code snippet from the file:

  import mongoose from 'mongoose';  
  ...  
  const User = mongoose.model('User', UserSchema);  
  export default User;

---

## Usage Examples

Below are some example scenarios demonstrating how to use the User model in different parts of the
application.

### Creating a New User

  // Import the User model  
  import User from './models/User.js';

  // Create a new instance of the User model

     const newUser = new User({       email: 'jane.doe@example.com',       password:
'securePassword123', // Ensure that the password is hashed in real applications       firstName:
'Jane',       lastName: 'Doe',       preferences: {          language: 'en',          notifications:
true,          theme: 'light'       }     });

  // Save the new user to the database  
  newUser.save()       .then((user) => {          console.log('User created successfully:', user);
      })       .catch((error) => {          console.error('Error creating user:', error);       });

### Finding a User by Email

  User.findOne({ email: 'jane.doe@example.com' })       .then((user) => {          if (user) {
           console.log('User found:', user);          } else {            console.log('User not
found.');          }       })       .catch((error) => {          console.error('Error retrieving
user:', error);       });

---

## Integration in the Project

The project structure indicates that this file is part of the server-side logic grouped under the
`server/models` directory. Other components in the project include:

- **API Endpoints & Controllers:** Files such as `server/index.js` or other route handlers (e.g., in
  middleware files like `server/middleware/auth.js`) likely import the User model to manage
  authentication, profile updates, and other user functionalities.
- **Related Models:** Alongside `User.js`, there are models for `Feedback` and `Presentation` that
  collectively form the core data models for the backend.
- **Client Integration:** While the client-side code (located in the `src` directory) handles the
  user interface, it communicates with the server API which utilizes this User model to fetch and
  manipulate data from MongoDB.

---

## Dependencies

- **Mongoose:** The primary dependency used to define the schema and model. Mongoose provides
  schema-based solutions for modeling application data in MongoDB.

Example of installing Mongoose (if not already installed):

  npm install mongoose

---

This documentation should provide developers with the necessary understanding of the User model’s
structure, its fields, and usage examples. It also clarifies how the model fits within the wider
project structure, aiding in both maintenance and future development.

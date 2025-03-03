# AutoResearch Server Package Documentation

This document provides a comprehensive overview of the configuration and dependencies for the
backend server of the AutoResearch.pro platform, as defined in the file:  
  server/package.json

AutoResearch Server (named “autoresearch-server”) is the backend component powering
AutoResearch.pro—an AI-driven research and presentation platform. It leverages modern Node.js
features (ES modules) and many industry-standard libraries to support API endpoints, authentication,
AI service integrations, and performance monitoring.

---

## Table of Contents

1. [Overview](#overview)
2. [Project Metadata](#project-metadata)
3. [Scripts](#scripts)
4. [Dependencies](#dependencies)
5. [Dev Dependencies](#dev-dependencies)
6. [Engine Requirements](#engine-requirements)
7. [Usage Examples](#usage-examples)
8. [Role within the Overall Project](#role-within-the-overall-project)

---

## Overview

The `server/package.json` file is the configuration file for the Node.js backend server of the
AutoResearch.pro platform. It defines project metadata, external library dependencies, development
tools, and runtime requirements. Key highlights include:

- **ES Module Support:** The `"type": "module"` flag allows the use of native ECMAScript module
  syntax.
- **Express Framework:** Provides a robust foundation for creating RESTful APIs.
- **Database Integration:** Uses Mongoose to interact with MongoDB.
- **AI and Cloud Service Integrations:** Includes SDKs and libraries for interacting with Anthropic
  AI, Google Cloud's Vertex AI, and OpenAI.
- **Security & Authentication:** Utilizes bcrypt for password hashing and jsonwebtoken for
  token-based authentication.
- **Monitoring & Rate Limiting:** Includes libraries for logging (Morgan), request rate limiting,
  and Prometheus metrics integration.

---

## Project Metadata

Below is a detailed description of the main configuration keys in this file:

- **name:**  
  `"autoresearch-server"`  
  Identifier for the backend server project.

- **version:**  
  `"1.0.0"`  
  The current version of the server. Follow semantic versioning for updates.

- **description:**  
  `"Backend server for AutoResearch.pro: an AI-powered research and presentation platform"`  
  A brief description explaining the purpose of this server.

- **main:**  
  `"index.js"`  
  This is the entry point of the application. The server starts execution from this file.

- **type:**  
  `"module"`  
  Informs Node.js to treat JavaScript files as ES modules rather than CommonJS.

- **author:**  
  An empty string currently; it is recommended to update this with the project's maintainer
  information.

- **license:**  
  `"ISC"`  
  The project is licensed under the ISC license.

---

## Scripts

The `"scripts"` section defines command line shortcuts for common tasks:

- **dev:**  
  `"nodemon index.js"`  
  Starts the server in development mode using Nodemon, which automatically restarts the server when
  changes are detected in the source files.

_Usage Example:_  
To start the backend server in development mode, run:  
  npm run dev

---

## Dependencies

The `"dependencies"` section lists the production libraries required by the server:

- **@anthropic-ai/sdk (v^0.36.3):**  
  SDK for integrating with Anthropic AI services.

- **@google-cloud/vertexai (v^1.9.3):**  
  Client for Google Cloud Vertex AI, facilitating integration with Google’s machine learning
  services.

- **bcrypt (v^5.1.1):**  
  A library to hash passwords and manage secure password storage.

- **cheerio (v^1.0.0):**  
  A lightweight library for server-side HTML parsing and manipulation, often used for web scraping.

- **compression (v^1.7.5):**  
  Middleware for compressing HTTP responses, which helps enhance performance.

- **cors (v^2.8.5):**  
  Middleware to enable Cross-Origin Resource Sharing, a necessary feature for handling API requests
  from different origins.

- **dotenv (v^16.4.7):**  
  Loads environment variables from a `.env` file, allowing configuration of sensitive data without
  hardcoding.

- **express (v^4.21.2):**  
  A fast, minimalist web framework used to build the API endpoints of the backend server.

- **express-rate-limit (v^7.5.0):**  
  Middleware to apply rate limiting to API endpoints, protecting against brute-force attacks and
  DDoS.

- **express-prom-bundle (v^8.0.0):**  
  Integrates Prometheus monitoring with Express apps, helping with performance tracking and
  observability.

- **google-auth-library (v^9.15.1):**  
  A Google authentication library for Secure API calls to Google services.

- **jsonwebtoken (v^9.0.2):**  
  Provides methods to sign, verify, and decode JSON Web Tokens for authentication and authorization.

- **mongoose (v^8.10.0):**  
  An ODM (Object Data Modeling) library for MongoDB, used to define schemas and interact with the
  database.

- **morgan (v^1.10.0):**  
  HTTP request logger middleware for Express, useful for debugging and logging requests.

- **nodemailer (v^6.10.0):**  
  Enables sending emails from Node.js applications, useful for notifications and user
  communications.

- **openai (v^4.83.0):**  
  Library for integrating with OpenAI's API, aiding in the development of AI-powered features.

- **prom-client (v^15.1.3):**  
  A client for exposing Prometheus metrics, which helps with application monitoring.

- **slugify (v^1.6.6):**  
  Converts strings into URL-friendly slugs, often used for creating SEO-friendly URLs.

- **stripe (v^17.6.0):**  
  A library to integrate Stripe’s payment processing services, enabling secure transactions.

_Note:_ The version ranges (indicated with "^") denote that any compatible versions satisfying the
specified requirements may be used.

---

## Dev Dependencies

The `"devDependencies"` section lists libraries needed during the development process, but not in
production:

- **nodemon (v^3.1.9):**  
  Automatically restarts the server when file changes in the directory are detected, which greatly
  enhances development efficiency.

---

## Engine Requirements

The `"engines"` section specifies the Node.js version required to run the application:

- **node:**  
  ">=18.0.0"  
  Ensures that the server is run on Node.js version 18 or later to guarantee compatibility with
  modern JavaScript features and dependencies.

---

## Usage Examples

### Installing Dependencies

Before running the server, ensure that all dependencies are installed. From the `server` directory,
execute:

  npm install

### Running the Server in Development Mode

Use the development script to start the server with live reloading support:

  npm run dev

This command will use Nodemon to start and monitor `index.js` for any changes during development.

### Running the Server in Production

In a production environment, you might run the server without Nodemon (after ensuring that the build
and environment configurations are in place):

  node index.js

_Tip:_ You may also integrate process managers like PM2 to manage the production server processes.

---

## Role within the Overall Project

The project structure defines several directories:

- **/src:**  
  Contains front-end code (React components written in JSX) for the client side of AutoResearch.pro.

- **/server:**  
  Houses backend server code. The `package.json` file in this directory ensures that the backend has
  its own isolated dependency tree and configuration. Other files (e.g., `admin.js`, `claude.js`,
  `gemini.js`, `index.js`) complement the server functionality. The `models` subdirectory contains
  Mongoose models (Feedback, Presentation, User) and the `middleware` folder includes custom
  middleware (like authentication in `auth.js`).

- **/public:**  
  Serves static assets such as HTML files and configuration texts (robots.txt, ads.txt).

- **/docs:**  
  Provides various documentation files for the platform, including release notes, privacy policy,
  and landing page copy.

In summary, the `server/package.json` is a crucial file that outlines the backend’s dependencies,
runtime requirements, and development tools, ensuring stable and efficient operation of the
server-side component of AutoResearch.pro.

---

By keeping this configuration well-documented, developers working on the backend server can
understand the project’s dependency ecosystem, development workflows, and integration points with
various third-party services and libraries.

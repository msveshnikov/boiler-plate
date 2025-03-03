Below is the complete documentation for the file server/index.js. This file is the main entry point
for the backend of the AutoResearch application. It sets up an Express server, configures middleware
(including CORS, rate limiting, logging, compression, and Prometheus metrics), connects to MongoDB,
wires up API routes, and integrates with third-party services such as Stripe. The server is
responsible for generating AI-powered presentations, handling user and admin routes, processing
feedback, serving static files, and handling webhooks.

---

# AutoResearch Server Documentation

This documentation covers the functionality implemented in the server/index.js file along with its
role in the overall project.

---

## Table of Contents

1. [Overview](#overview)
2. [Dependencies and Environment Setup](#dependencies-and-environment-setup)
3. [Middleware and Server Configuration](#middleware-and-server-configuration)
4. [Helper Functions](#helper-functions)
5. [API Endpoints](#api-endpoints)
    - [POST /api/generate-presentation](#post-apigenerate-presentation)
    - [GET /api/presentations](#get-apipresentations)
    - [GET /api/mypresentations](#get-apimypresentations)
    - [GET /api/presentations/:identifier](#get-apipresentationsidentifier)
    - [POST /api/feedback](#post-apifeedback)
    - [POST /api/stripe-webhook](#post-apistripe-webhook)
    - [GET /sitemap.xml](#get-sitemapxml)
    - [GET / and /presentation/:slug](#get--and--presentationslug)
    - [Fallback Route](#fallback-route)
6. [Error and Process Handling](#error-and-process-handling)
7. [Project Structure](#project-structure)
8. [Usage Examples](#usage-examples)

---

## Overview

The server (in server/index.js) provides the backend services for the AutoResearch application. Its
main responsibilities are:

- **AI-Power Presentation Creation:** Accepts requests to generate presentations using AI models
  (e.g., GPT and Gemini models).
- **User Management:** Integrates user routes and subscription-based limitations.
- **Content Serving:** Serves static assets (from the dist directory), landing pages, and
  presentation pages with dynamic metadata.
- **Webhook Integration:** Processes Stripe webhook events to update user subscription statuses and
  send relevant analytics events.
- **Metrics and Logging:** Uses Prometheus metrics (via express-prom-bundle), morgan for logging,
  and compression for performance improvements.

---

## Dependencies and Environment Setup

The server relies on several important libraries and environment variables:

- **Express:** Main web framework.
- **CORS:** Allows cross-origin requests.
- **Multer / JSON Parser:** For body parsing with a size limit (except on the Stripe webhook route).
- **express-prom-bundle:** For Prometheus metrics.
- **dotenv:** Loads environment variables (e.g., STRIPE_KEY, MONGODB_URI, PORT, STRIPE_WH_SECRET).
- **Stripe:** To interact with the Stripe API.
- **express-rate-limit:** To restrict request volume (only active in production).
- **Mongoose:** For MongoDB interaction.
- **morgan:** HTTP request logging.
- **compression:** Compresses server responses.
- **Path/URL:** To set paths for static files and templates.
- **Imported Modules:**
    - AI provider integrations (getTextGemini, getTextGpt)
    - Models for User, Presentation, Feedback (in server/models)
    - Middleware for authentication (server/middleware/auth.js)
    - Additional modules such as imageService.js and admin/user route modules.

Before running the server, ensure that your environment (.env) contains the required keys like
STRIPE_KEY, STRIPE_WH_SECRET, MONGODB_URI, PORT, GA_API_SECRET, among others.

---

## Middleware and Server Configuration

1. **Express JSON Parsing with 15mb Limit:**  
   The JSON body parser is conditionally applied. The Stripe webhook endpoint bypasses the body
   parser since it requires raw payload parsing.

2. **Prometheus Metrics:**  
   The promBundle middleware is configured to capture request method, path, status code, and default
   metrics with a creation timestamp.

3. **CORS and Static Files:**  
   The server enables CORS and serves static files from the `../dist` directory.

4. **Morgan and Compression:**  
   morgan logs HTTP requests in 'dev' mode, and compression is applied to improve response
   performance.

5. **Rate Limiting:**  
   In production, the API endpoints under `/api/` are rate limited to 30 requests per 15 minutes.

6. **Database Connection:**  
   Mongoose connects to the MongoDB URI provided in the environment variables.

7. **Route Setup:**  
   The server imports and registers user and admin routes from separate modules.

---

## Helper Functions

### generateAIResponse(prompt, model, temperature)

- **Purpose:**  
  Determines which AI service to use based on the model argument.
- **Parameters:**  
  • prompt (String): The prompt text for the AI model.  
  • model (String): AI model identifier (e.g., 'o3-mini', 'gemini-2.0-pro-exp-02-05').  
  • temperature (Number): The temperature for text generation (default 0.7).
- **Returns:**  
  A promise that resolves with the AI generated response.
- **Usage:**  
  Called internally by the `/api/generate-presentation` endpoint to fetch AI-generated content.

---

### checkAiLimit(req, res, next)

- **Purpose:**  
  Middleware function to limit the number of daily AI requests for users without an active or trial
  subscription.
- **Parameters:**  
  • req: Incoming request containing user token info (req.user.id).  
  • res: Response object.  
  • next: Callback to proceed to next middleware.
- **Behavior:**  
  Increases the user’s AI request count and saves the last request time. If the count exceeds 5 (and
  the user is not subscribed/trialing) on the same day, returns a 429 error with a message "Daily AI
  request limit reached".
- **Usage:**  
  Attached to the route for generating presentations to prevent abuse.

---

### extractCodeSnippet(text)

- **Purpose:**  
  Extracts code or JSON blocks enclosed in triple backticks (optionally with a language hint) from a
  provided string.
- **Parameters:**  
  • text (String): The string to be processed.
- **Returns:**  
  The content inside the code block if found; otherwise, it returns the original text.

---

### slugify(text)

- **Purpose:**  
  Converts a given string into a URL-friendly slug.
- **Parameters:**  
  • text (String): The input text.
- **Returns:**  
  A lowercase, trimmed text with spaces replaced by hyphens and special characters removed.
- **Usage:**  
  Used to generate a unique slug for each presentation.

---

## API Endpoints

### POST /api/generate-presentation

- **Description:**  
  Generates a PowerPoint-like presentation in JSON format using an AI model. The content is
  generated based on a topic provided by the client along with parameters like the number of slides
  and model type.
- **Middlewares:**  
  • authenticateToken – ensures the request is authenticated.  
  • checkAiLimit – enforces daily usage limits.
- **Input (JSON Payload):** • topic (String): The topic for the presentation (limited to the first
  1000 characters).  
  • numSlides (Number, Optional): The number of slides (default is 10).  
  • model (String, Optional): The AI model identifier (default is 'o3-mini').  
  • temperature (Number, Optional): The generation temperature (default is 0.7).
- **Process:**
    1. Reads a presentation schema from presentationSchema.json for reference.
    2. Constructs a prompt incorporating the schema and topic details.
    3. Calls generateAIResponse to obtain the presentation content.
    4. Parses the response by extracting a JSON code snippet and converting it to an object.
    5. Replaces graphics by calling the replaceGraphics utility.
    6. Determines if the presentation should be marked as private based on the user’s subscription
       status.
    7. Saves the new presentation in MongoDB.
- **Response:**  
  Returns the parsed presentation JSON on success, or a 500 error with an error message if parsing
  or generation fails.
- **Example Request Payload:**

    { "topic": "Future of Renewable Energy", "numSlides": 12, "model": "o3-mini", "temperature": 0.6
    }

---

### GET /api/presentations

- **Description:**  
  Retrieves a list of public presentations.
- **Process:**  
  Finds presentations that are either explicitly public (isPrivate: false) or do not have the
  isPrivate flag, then sorts them in descending order of creation.
- **Response:**  
  Returns a limited presentation object (id, title, description, model, first slide title, slug) in
  JSON format.

---

### GET /api/mypresentations

- **Description:**  
  Returns presentations that belong to the authenticated user.
- **Middlewares:**  
  • authenticateToken – ensures that only the logged-in user’s presentations are fetched.
- **Response:**  
  Similar to /api/presentations, returns limited fields for each presentation owned by the user.

---

### GET /api/presentations/:identifier

- **Description:**  
  Retrieves a presentation by its identifier. The identifier can be a MongoDB ObjectId or a slug.
- **Process:**
    1. Checks if the identifier is a valid ObjectId; if yes, fetches by id.
    2. If not found, it attempts to find the presentation by slug.
- **Response:**  
  Returns the full presentation details or a 404 error if the presentation is not found.

---

### POST /api/feedback

- **Description:**  
  Records user feedback.
- **Input (JSON Payload):**  
  • message (String): The feedback message.  
  • type (String): The type/category of feedback.
- **Process:**  
  Creates a new Feedback document, optionally associating a user (if authenticated), and saves it to
  the database.
- **Response:**  
  Returns the saved feedback object with a 201 status code on success.

---

### POST /api/stripe-webhook

- **Description:**  
  Processes incoming Stripe webhook events for subscription updates.
- **Middleware:**  
  Uses express.raw to handle raw JSON payloads required by Stripe’s signature verification.
- **Process:**
    1. Verifies the incoming request using the Stripe signature and secret from the environment.
    2. Logs the event, and for subscription events (created, updated, deleted), retrieves the
       customer’s email and updates the corresponding user’s subscription status and ID in MongoDB.
    3. Sends a Google Analytics event for purchase tracking.
- **Response:**  
  Returns a JSON acknowledgement `{ received: true }` on success or a 400 error with the error
  message if verification fails.

---

### GET /sitemap.xml

- **Description:**  
  Generates an XML sitemap for SEO. It includes a URL for the landing page and one URL for each
  presentation (if the presentation has a slug).
- **Response:**  
  Returns an XML document with Content-Type set to application/xml.

---

### GET / and /presentation/:slug

- **GET /**  
  Serves the landing page (landing.html) from the dist directory.
- **GET /presentation/:slug**  
  Serves a presentation page:
    - Reads the default index.html.
    - Attempts to load a presentation by ObjectId or slug.
    - If a public presentation is found, dynamically injects presentation metadata (title,
      description, slide list) into a full HTML response.
    - If not found or if the presentation is private, the unmodified index.html is served.
- **Response:**  
  Returns HTML content appropriate to the route.

---

### Fallback Route

- **Description:**  
  For all unmatched routes, the server reads and returns the index.html file from the dist folder. A
  404 JSON error handler is also defined for routes that do not match any endpoint.
- **Response:**  
  Returns index.html for client-side routing or a JSON error with a 404 status.

---

## Error and Process Handling

- **Error Handling at the Route Level:**  
  Each endpoint has try–catch blocks to log errors and send appropriate HTTP status codes
  (mostly 500) with error messages.
- **Global Process Events:**
    - `uncaughtException`: Logs any uncaught exceptions.
    - `unhandledRejection`: Logs any unhandled promise rejections.
- **Server Startup:**  
  The application listens on the specified port (default: 3000) and logs a startup message.

- **Environment Setting:**  
  Sets the environment variable `GOOGLE_APPLICATION_CREDENTIALS` at the end of the file.

---

## Project Structure

Below is a summary of how server/index.js fits in the overall project structure:

- **src/** – Contains the frontend code written in React (various JSX files).
- **server/** – Contains all backend code:
    - index.js (this file): Main server configuration and API endpoints.
    - Models (User.js, Presentation.js, Feedback.js): Define MongoDB schemas.
    - Middleware (auth.js): Contains authentication logic.
    - Additional integration files: openai.js, gemini.js, imageService.js, etc.
    - Route files: user.js (user routes), admin.js (admin routes).
- **public/** – Contains assets like landing.html and robots.txt.
- **docs/** – Contains documentation and related texts (privacy policy, release notes, etc.).
- **Other Files:** Dockerfile, docker-compose.yml, vite.config.js, etc., for containerization and
  build configuration.

The server/index.js file is crucial as it orchestrates the API, integrates various modules, and
serves as the backend gateway for the AutoResearch application.

---

## Usage Examples

### Example 1: Generate a Presentation

Send a POST request to /api/generate-presentation (requires authentication):

Request URL:  
https://yourdomain.com/api/generate-presentation

Request Headers: • Authorization: Bearer <access_token>  
• Content-Type: application/json

Request Body: { "topic": "Innovations in Artificial Intelligence", "numSlides": 8, "model":
"o3-mini", "temperature": 0.65 }

Successful Response (HTTP 201): { "title": "Innovations in Artificial Intelligence", "description":
"A concise presentation on the latest tech innovations in AI.", "version": "v1", "theme": "modern",
"slides": [ { "title": "Slide 1", "content": "Introduction" }, { "title": "Slide 2", "content":
"Overview" } // More slides... ] }

### Example 2: Retrieve Public Presentations

Send a GET request to /api/presentations:

Request URL:  
https://yourdomain.com/api/presentations

Successful Response (HTTP 200): [ { "_id": "64a1b2c3d4e5f6... ", "title": "Innovations in AI",
"description": "An engaging presentation on AI advancements", "model": "o3-mini", "firstSlideTitle":
"Introduction", "slug": "innovations-in-ai" }, // Other presentations... ]

### Example 3: Stripe Webhook Event

Stripe sends a POST request to /api/stripe-webhook when a subscription update occurs.  
The server verifies the signature, logs the event, updates the user’s subscription status, and fires
an event to Google Analytics.

---

This documentation should help you understand the role and functionality of server/index.js within
the AutoResearch project. Adjustments and extensions can be made as new features or integrations are
added.

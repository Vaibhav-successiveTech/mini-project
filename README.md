# ConnectSphere - Social Media & Chat Platform

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

ConnectSphere is a full-stack web application designed to provide a seamless social networking experience. It allows users to connect with others, share their thoughts through posts, engage in real-time conversations, and customize their profiles. The application features a responsive, dark-themed design built with Next.js and Material-UI, powered by a robust Node.js/Express backend.

## Features

-   **User Authentication**: Secure registration and login system using JSON Web Tokens (JWT).
-   **Comprehensive User Profiles**: Users can create and edit detailed profiles including:
    -   Profile picture
    -   Bio, status, and location
    -   Skills, work experience, and education history
-   **Social Feed (Home)**: A central feed displaying posts from all users in reverse chronological order.
-   **Post Management**:
    -   Create posts with text and image uploads.
    -   View your own posts on a dedicated "My Posts" page.
    -   Edit and delete your posts.
-   **Real-time Interactions**:
    -   Like posts and see like counts update instantly for all users via GraphQL subscriptions.
    -   View and add comments to posts.
-   **Real-time Chat**:
    -   One-on-one private messaging with other users.
    -   Live message updates using GraphQL subscriptions.
    -   Emoji support in chat messages.
-   **Responsive & Interactive UI**:
    -   Clean, modern, and dark-themed UI built with Material-UI.
    -   Resizable sidebars for navigation and chat user lists for a customizable layout.
    -   User search functionality.

## Tech Stack

### Frontend

-   **Framework**: [Next.js](https://nextjs.org/) (React)
-   **UI Library**: [Material-UI (MUI)](https://mui.com/)
-   **API Communication**: [Axios](https://axios-http.com/) for REST, [Apollo Client](https://www.apollographql.com/docs/react/) for GraphQL
-   **Real-time**: GraphQL Subscriptions (via Apollo)
-   **Styling**: Emotion (`sx` prop), CSS-in-JS
-   **Language**: JavaScript (React JSX)
-   **Authentication**: JWT decoding with `jwt-decode`

### Backend

-   **Framework**: Node.js, Express.js
-   **API**: REST & GraphQL (Apollo Server)
-   **Database**: MongoDB (inferred from code structure)
-   **Authentication**: JSON Web Tokens (`jsonwebtoken`)
-   **File Uploads**: Middleware for handling `multipart/form-data` (e.g., `multer`).

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18 or newer recommended)
-   `npm` or `yarn`
-   MongoDB installed locally or a connection string from MongoDB Atlas.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Vaibhav-successiveTech/mini-project.git
    cd mini-project
    ```

2.  **Set up the Backend:**

    ```bash
    cd backend
    npm install
    ```

    Create a `.env` file in the `backend` directory and add the following environment variables.

    ```env
    # The port for the backend server
    PORT=5000

    # Your MongoDB connection string
    MONGO_URI=mongodb://localhost:27017/connectsphere

    # A secret key for signing JWTs
    JWT_SECRET=your-super-secret-key
    ```

    Start the backend server:

    ```bash
    npm start
    # The server will be running on http://localhost:5000
    ```

3.  **Set up the Frontend:**

    Open a new terminal window.

    ```bash
    cd frontend
    npm install
    ```

    Create a `.env.local` file in the `frontend` directory to point to your backend API.

    ```env
    # The URL of your backend server
    NEXT_PUBLIC_API_URL=http://localhost:5000
    ```

    Start the frontend development server:

    ```bash
    npm run dev
    # The application will be running on http://localhost:3000
    ```

4.  **Open the Application:**

    Open your browser and navigate to `http://localhost:3000`. You can now register a new user and start exploring the application.

## Project Structure

```
mini-project/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── app/                # Next.js App Router pages
    │   ├── apis/               # API constants
    │   ├── components/         # React components
    │   ├── graphql/            # GraphQL queries and mutations
    │   └── ...
    └── package.json
```

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
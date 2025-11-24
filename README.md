# Portfolio_Three.js

## Description

This is my portfolio website, built using React, Three.js, and styled with Tailwind CSS. It showcases my skills and experience in software development, focusing on machine learning and web application development. The website includes interactive 3D elements created with Blender and integrated using Three.js.

## Features and Functionality

*   **Interactive 3D Models:**  The website features 3D models of a laptop, stars, and the Earth, created in Blender and integrated with Three.js. These models are used throughout the site to enhance visual appeal.
*   **Responsive Design:** The website is designed to be responsive and accessible on various devices, using Tailwind CSS for styling and responsive layouts.
*   **Email Contact Form:** A contact form allows visitors to send me messages directly via email, utilizing the EmailJS service. The form is located in the `src/components/Contact.jsx` file. It requires configuration with your own EmailJS service ID, template ID, and public key.
*   **Downloadable CV:** A button in the contact section allows visitors to download my CV in both Polish (`michal_maciej_pl.pdf`) and English (`michal_maciej_en.pdf`).
*   **Project Showcase:** Displays a selection of my projects with descriptions, technologies used, and links to the source code on GitHub.
*   **Education and Work Experience:**  Provides a timeline of my education and work experience, highlighting key skills and achievements.
*   **Technology Stack Visualization:** Uses Three.js to create interactive "balls" that represent the technologies I'm familiar with.

## Technology Stack

*   **React:** A JavaScript library for building user interfaces.
*   **Three.js:** A JavaScript 3D library used for rendering 3D graphics in the browser.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly designing custom user interfaces.
*   **Framer Motion:** A motion library for React used for animations and transitions.
*   **EmailJS:** A service to send emails directly from client-side JavaScript.
*   **React Vertical Timeline Component:** A component for creating vertical timeline displays, used for education and work experience sections.
*   **@react-three/fiber:** React renderer for Three.js
*   **@react-three/drei:** Useful helpers for react-three-fiber

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** (Version >=12.0.0)  Download from [https://nodejs.org/](https://nodejs.org/)
*   **npm:** (Usually comes with Node.js) or **yarn:** `npm install -g yarn`

## Installation Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Michalmaciej/Portfolio_Three.js.git
    cd Portfolio_Three.js
    ```

2.  **Install dependencies:**

    Using npm:

    ```bash
    npm install
    ```

    Or using yarn:

    ```bash
    yarn install
    ```

3.  **Environment Variables:**

    The contact form in `src/components/Contact.jsx` uses EmailJS.  You'll need to configure the following environment variables.  While this project does not explicitly use `.env` files, you will need to hard code these into `src/components/Contact.jsx` for email to function.

    ```javascript
    const SERVICE_ID = "YOUR_SERVICE_ID";  // Replace with your EmailJS service ID
    const TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // Replace with your EmailJS template ID
    const PUBLIC_KEY = "YOUR_PUBLIC_KEY";   // Replace with your EmailJS public key
    ```

    Replace `YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID`, and `YOUR_PUBLIC_KEY` with your actual EmailJS credentials.  You can obtain these from the EmailJS website after creating an account and setting up a service and template.

4. **File Downloads:**

The contact form also includes the ability to download CV files. Ensure `michal_maciej_pl.pdf` and `michal_maciej_en.pdf` are in the project's root directory.

## Usage Guide

1.  **Start the development server:**

    Using npm:

    ```bash
    npm run dev
    ```

    Or using yarn:

    ```bash
    yarn run dev
    ```

2.  **Open the application in your browser:**

    The application should be running at `http://localhost:5173/` (or the port shown in your console output).

## API Documentation (N/A)

This project does not have a backend API. It primarily utilizes frontend technologies and third-party services like EmailJS for form submissions.

## Contributing Guidelines

Contributions are welcome! Here's how you can contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive commit messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the `main` branch of the original repository.

## License Information

This project has no specified license. All rights are reserved by the owner.

## Contact/Support Information

For any questions, suggestions, or support, feel free to contact me at:

*   Email: mich.kowa.01@gmail.com
*   GitHub: [https://github.com/Michalmaciej](https://github.com/Michalmaciej)

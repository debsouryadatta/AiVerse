<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/debsouryadatta/aiverse">
    <img src="https://res.cloudinary.com/diyxwdtjd/image/upload/v1734098503/projects/aiverse-logo_mbtjg8.png" alt="Logo" width="250" height="250">
  </a>

  <h3 align="center">AiVerse</h3>

  <p align="center">
    AiVerse - Unleash the Power of AI in Learning. Join the Community!
    <br />
    <br />
    <a href="https://aiverse.souryax.tech/">View Site</a>
    ·
    <a href="https://github.com/debsouryadatta/aiverse/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/debsouryadatta/aiverse/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
        <li><a href="#aiverse-demo">AiVerse Demo</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#cloning-the-repository">Cloning the Repository</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#set-up-environment-variables">Set Up Environment Variables</a></li>
        <li><a href="#running-the-project">Running the Project</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

AiVerse is an AI-powered learning platform cum community that makes learning smarter and more engaging. It combines AI course generation, personalized learning tools, and community features into one seamless experience.

Whether you're creating AI-generated courses, following custom learning roadmaps, or interacting with voice mentors, AiVerse provides the tools you need to learn effectively. With our credits system, you can access premium features while engaging with a vibrant community of learners.

Built with modern technologies like Next.js, FastAPI, and LangChain, AiVerse is designed to make learning more accessible and interactive for everyone.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### AiVerse Demo
<p>Check out the live site of AiVerse here.</p>
<a style="display: flex; justify-content: center;" href="https://aiverse.souryax.tech/">
    <img src="https://res.cloudinary.com/diyxwdtjd/image/upload/v1734083939/projects/Screenshot_2024-12-13_at_3.24.58_PM_nsld3o.png" alt="Logo" width="800" height="450">
</a>

### Key Features
- Explore Posts and Courses:
  - Browse and discover a vast collection of user generated courses
  - Explore the user created posts and learn from others
  - Upcoming features: Explore blogs posts, quizzes, and more

- Generate Courses:
  - Create courses with AI-powered content generation
  - Course generation using LangChain and GROQ API
  - Concept check with AI-generated MCQs
  - YouTube video integration
  - Unsplash API for imagery
  - Course visibility control with invite codes
  - Featured courses carousel
  - Like, comment, share and export as PDF courses efficiently 

- Ai Tools:
  - Roadmaps:
    - Generate Roadmaps with visual representation
    - Save Roadmaps and export them.
  - Voice Mentor:
    - Create and manage voice mentors
    - Talk to personalized voice mentors
    - Give detailed instructions of how the voice mentor should behave
  - Upcoming ai tools:
    - Chat with any website content
    - Chat with pdfs
    - Ai agents and much more

- Robust Credits System:
  - Generate courses, leverage ai tools, everything using credits
  - Buy credits using Stripe easy checkout
  - Starter Pack: 2000 credits for $19.99
  - Standard Pack: 5000 credits for $39.99
  - Premium Pack: 10000 credits for $69.99

- Social Features:
  - User profiles with follow system
  - Share generated courses and created posts with the community
  - Like, comment, and share functionality
  - Bookmark system for courses and posts
  - Upcoming features: Live chat and video calls with web sockets & WebRTC

- Modern UI/UX:
  - Responsive design with Shadcn UI and Aceternity UI kit
  - Dark mode support with next-themes
  - Interactive landing page with spotlight effects and animations
  - Sidebar navigation for better user experience

- Advanced Search:
  - Debounce-throttled search functionality
  - Search across courses, posts, and profiles

- Authentication & Security:
  - NextAuth integration
  - Profile management with Cloudinary image upload

- Technical Features:
  - Separate FastAPI service for AI operations
  - Docker containerization
  - CI/CD pipeline with GitHub Actions
  - Database management with Prisma and PostgreSQL

### Built With

- Core:
  - Next.js (React framework)
  - Typescript
  - Prisma (ORM)
  - PostgreSQL (Database)
  - FastAPI (Python framework for ai operations)
  - LangChain (LLM framework)


- Additional:
  - GROQ API (for LLM response & speech to text)
  - Deepgram (for text to speech)
  - NextAuth (Authentication)
  - Stripe (for payment processing)
  - Docker (for containerization)
  - GitHub Actions (for CI/CD)
  - Zustand (for state management)
  - Cloudinary (for image upload)
  - YouTube API (for video content)
  - Unsplash API (for course imagery)
  - Lodash (for debounce functionality)
  - NextThemes (Theme support)
  - Shadcn UI (for design)
  - Framer Motion (for animations)
  - Aceternity UI kit (for design)
  - html2canvas & jspdf (for PDF export)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm
- Python 3.8+
- Docker (optional)
- PostgreSQL

### Cloning the Repository
```bash
git clone https://github.com/debsouryadatta/AiVerse.git
cd aiverse
```

### Installation

1. Install frontend dependencies:
```bash
cd nextjs-app
npm install
```

2. Install backend dependencies:
```bash
cd ../fastapi-app
pip install -r requirements.txt
```

### Set Up Environment Variables

1. Frontend (.env):
```plaintext
# Next Auth
AUTH_SECRET=your-secret-key
AUTH_GOOGLE_ID=your-google-id
AUTH_GOOGLE_SECRET=your-google-secret
AUTH_URL=http://localhost:3000

# Database
DATABASE_URL=your-postgresql-url

# APIs
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
CLOUDINARY_UPLOAD_PRESET=your-cloudinary-preset
CLOUDINARY_FOLDER=your-cloudinary-folder

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# Deepgram
NEXT_PUBLIC_DEEPGRAM_API_KEY=your-deepgram-api-key
NEXT_PUBLIC_GROQ_API_KEY=your-groq-api-key

# Base URLs
NEXTJS_BASE_URL=http://localhost:3000
FASTAPI_BASE_URL=http://localhost:8000
```

2. Backend (.env):
```plaintext
# Groq API/Youtube API/Unsplash API
GROQ_API_KEY=your-groq-api-key
YOUTUBE_API_KEY=your-youtube-api-key
UNSPLASH_API_KEY=your-unsplash-api-key

# Langchain API for langsmith [Optional]
LANGCHAIN_TRACING_V2=your-langchain-tracing-v2
LANGCHAIN_ENDPOINT=your-langchain-endpoint
LANGCHAIN_API_KEY=your-langchain-api-key
LANGCHAIN_PROJECT=your-langchain-project
LANGCHAIN_CALLBACKS_BACKGROUND=your-langchain-callbacks-background
```

### Running the Project

1. Start the frontend:
```bash
cd nextjs-app
npm run dev
```

2. Start the backend:
```bash
cd fastapi-app
python3 main.py
```

### Running the Project with Docker
```bash
docker-compose up --build
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- CONTACT -->
## Contact

Debsourya Datta - [LinkedIn Profile](https://www.linkedin.com/in/debsourya-datta-177909225) - debsouryadatta@gmail.com

Project Link: [https://github.com/debsouryadatta/aiverse](https://github.com/debsouryadatta/aiverse)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
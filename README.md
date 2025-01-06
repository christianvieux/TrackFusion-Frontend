# TrackFusion Frontend

A modern music streaming interface built with Next.js, designed to provide an engaging user experience for music discovery and playback.

## Quick Start

Set up your development environment in a few simple steps:

```bash
# Get the code
git clone https://github.com/christianvieux/TrackFusion-Frontend.git
cd trackfusion-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001) to see your application.

## Environment Configuration

The included `.env.example` file contains the necessary configuration for local development:

```plaintext
# API and URL Configuration
API_URL=YourAPIURL # Example: http://localhost:3000
NEXT_PUBLIC_FRONTEND_URL=YourFrontendURL # Example: http://localhost:3001

# Supported File Types
NEXT_PUBLIC_ALLOWED_AUDIO_TYPES=audio/mp3,audio/wav,audio/wave,audio/mpeg,audio/ogg,audio/x-wav,audio/x-m4a,audio/aac
NEXT_PUBLIC_ALLOWED_IMAGE_TYPES=image/jpeg,image/jpg,image/png,image/heic,image/heif
```

## Development Notes

The frontend connects to the TrackFusion backend API for data management. For the best development experience, ensure your backend server is running at the URL specified in your environment variables.

## Next Steps

As development continues, planned improvements include enhanced music playback controls, user playlist management, and social sharing features.

## Questions?

Reach out through:
- Email: christianvieux.dev@gmail.com
- LinkedIn: https://www.linkedin.com/in/christian-vieux-dev/
- GitHub: https://github.com/christianvieux
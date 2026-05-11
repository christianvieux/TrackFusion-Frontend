# TrackFusion Frontend

A modern music streaming interface built with Next.js, designed to provide an engaging user experience for music discovery and playback.

## Live Demo

here: https://trackfusionweb.vercel.app/home

## Backend Repository

here: https://github.com/christianvieux/TrackFusion-Backend

---

## Quick Start

Set up your development environment in a few simple steps:

```bash
# Get the code
git clone https://github.com/christianvieux/TrackFusion-Frontend.git
cd trackfusion-frontend

# IMPORTANT: This project depends on the backend API
# Make sure you clone and run the backend as well:
# https://github.com/christianvieux/TrackFusion-Backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001) to see your application.

---

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

### Important Notes

* `API_URL` must match your running backend server
* If your backend isn’t running, most features will break (auth, uploads, music data, etc.)

---

## Development Notes

The frontend connects to the TrackFusion backend API for:

* User authentication
* Music upload and streaming
* Playlist and track management
* Image and audio handling

Before running locally:

1. Clone the backend repo
   [https://github.com/christianvieux/TrackFusion-Backend](https://github.com/christianvieux/TrackFusion-Backend)

2. Start the backend server

3. Make sure your `.env.local` matches your backend URL

---

## Tech Stack

* **Framework**: Next.js 16
* **UI Library**: React 19 with HeroUI
* **Styling**: Tailwind CSS 4
* **Animations**: Framer Motion
* **HTTP Client**: Axios
* **Search**: Fuse.js
* **Audio Visualization**: AudioMotion Analyzer
* **Image Processing**: browser-image-compression
* **Carousel**: Embla Carousel
* **Notifications**: React Hot Toast

---

## Features

### User Experience
* **Music Discovery**: Browse and search music with fuzzy search functionality
* **Audio Playback**: Interactive audio player with visualizer and playback controls
* **User Authentication**: Secure login/signup with password reset capabilities
* **User Profiles**: Customizable profile with picture uploads and settings management

### Track Management
* **Upload & Configuration**: Upload audio and image files with metadata editing
* **Favorites System**: Save and organize favorite tracks
* **Track Sharing**: Share tracks via modal with social features
* **Playlist Support**: Create and manage personal music collections

### Advanced Features
* **Audio Visualization**: Real-time audio spectrum analysis
* **Track Analysis**: Detailed track attribute visualization and statistics
* **Image Processing**: Optimized image compression for efficient uploads
* **Responsive Design**: Mobile-optimized interface with smooth animations

---

## Project Links

Frontend Live Site:
[https://trackfusionweb.vercel.app/home](https://trackfusionweb.vercel.app/home)

Frontend Repository:
[https://github.com/christianvieux/TrackFusion-Frontend](https://github.com/christianvieux/TrackFusion-Frontend)

Backend Repository:
[https://github.com/christianvieux/TrackFusion-Backend](https://github.com/christianvieux/TrackFusion-Backend)

---

## Questions?

Reach out through:

* Email: [christianvieux.dev@gmail.com](mailto:christianvieux.dev@gmail.com)
* LinkedIn: [https://www.linkedin.com/in/christian-vieux-dev/](https://www.linkedin.com/in/christian-vieux-dev/)
* GitHub: [https://github.com/christianvieux](https://github.com/christianvieux)
# BlueCrate Web Client

Modern Next.js food delivery frontend for BlueCrate Foods platform.

## Features

- 🏠 Beautiful landing page with hero section
- 🍕 Restaurant browsing and search
- 🛒 Shopping cart with persistent storage
- 💳 Checkout and order placement
- 📱 Fully responsive design
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast and optimized with Next.js

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable components (Navbar, Footer, Layout)
├── pages/          # Next.js pages and routes
├── styles/         # Global styles and Tailwind CSS
├── stores/         # Zustand state management
└── lib/            # Utilities and API client
```

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Notifications**: React Hot Toast

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API Gateway URL (default: http://localhost:8000)

## Features Overview

### Homepage
- Hero section with search
- Featured restaurants
- How it works section
- Call-to-action sections

### Restaurants
- Browse all restaurants
- Filter by category
- Search functionality
- Restaurant details with menu

### Cart & Checkout
- Persistent shopping cart
- Quantity management
- Order summary
- Secure checkout form

### Authentication
- User login
- User registration
- Form validation

## Backend Integration

This frontend connects to the BlueCrate microservices backend via the API Gateway at port 8000. Make sure the backend services are running:

```bash
cd ../.. && docker-compose up
```

## Contributing

This is part of the BlueCrate Foods microservices platform. See the main README for more information.

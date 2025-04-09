# SC2006-Lab Project

A mobile application for travelers to discover location-based recommendations by integrating interactive map functionality with personalized sorting options. Built with React Native (Expo) frontend and a Go backend server, this app enables users to explore points of interest, create trip itineraries, and find attractions based on customizable filtering criteria.

## Table of Contents
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Install](#install)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [Test](#test)
- [Architecture](#architecture)
- [Design Patterns](#design-patterns)
- [Technologies Used](#technologies-used)
- [Contributors](#contributors)
- [License](#license)

## Project Structure

- `client/`: React Native (Expo) mobile application
- `server/`: Go backend server with Fiber framework

## Features

- Interactive map interface with Google Maps integration
- Carpark availability information and filtering
- EV charging station locator
- Weather information integration
- Route computation and display
- Favorites management system

## Prerequisites

- Node.js and npm
- Go 1.15+
- Expo CLI
- Google Maps API key

## Install

```sh
# Clone the repository
git clone [your-repository-url]
cd SC2006-Lab

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
go mod download
```

## Environment Setup

Set up environment variables as needed:

```sh
# For the client
cp client/.env.example client/.env  # Then edit with your API keys

# For the server
cp server/.env.example server/.env  # Then edit with your API keys
```

## Usage

```sh
# Start the backend server
cd server
go run main.go

# In a separate terminal, start the frontend
cd client
npx expo start
```

After starting the Expo server:
- Press `a` to open on Android emulator/device
- Press `i` to open on iOS simulator/device
- Scan the QR code with Expo Go app on your physical device

## Test

```sh
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
go test ./...
```

## Architecture

### Client Folder Architecture
```
client/
├── assets/              # Images, fonts, and static resources
├── components/          # Reusable UI components
│   ├── common/          # Shared components (buttons, inputs, etc.)
│   ├── map/             # Map-related components
│   └── screens/         # Screen-specific components
├── navigation/          # Navigation configuration
├── screens/             # Application screens
├── services/            # API services and external integrations
├── store/               # State management
│   ├── actions/         # Redux actions
│   ├── reducers/        # Redux reducers
│   └── hooks/           # Custom React hooks
├── types/               # TypeScript type definitions
└── utils/               # Helper functions and utilities
```

### Server Folder Architecture
```
server/
├── api/                 # API routes and handlers
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   └── routes/          # Route definitions
├── config/              # Configuration files
├── models/              # Data models and types
├── services/            # Business logic and external API integrations
├── utils/               # Helper functions and utilities
└── database/            # Database connection and queries
```

## Design Patterns

### Frontend Design Patterns
- **Container/Presentational Pattern**: Separating logic from UI components
- **Provider Pattern**: Using React Context for state management across components
- **Custom Hooks**: Encapsulating and reusing stateful logic across components
- **Render Props**: Sharing code between components using props whose value is a function

### Backend Design Patterns
- **Middleware Pattern**: Processing requests through a chain of handlers
- **Repository Pattern**: Abstracting data access logic
- **Dependency Injection**: Providing dependencies to components instead of hardcoding them
- **Service Layer**: Separating business logic from API controllers

### Architecture Patterns
- **MVC (Model-View-Controller)**: Organizing backend code by responsibility
- **Microservices**: Independent services communicating through APIs
- **REST API**: Standard HTTP methods for CRUD operations

## Technologies Used

### Frontend
- React Native with Expo
- TypeScript
- NativeWind (TailwindCSS for React Native)
- React Navigation
- Google Maps API

### Backend
- Go
- Fiber framework
- Various Singapore government APIs (LTA, URA, etc.)
- OneMap API
- Google Routes API

## Contributors

SC2006 SCMB Group 3

## License

[Include your license information here]

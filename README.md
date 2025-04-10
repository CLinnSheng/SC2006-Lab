<h1 align="center">SweetSpot - Your Smart Carpark & Weather Companion</h1>
<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version 1.0.0"/>
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License MIT"/>
  <img src="https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey" alt="Platform iOS | Android"/>
</p>

<p align="center">
  <b>Find the perfect parking spot in seconds!</b> SweetSpot helps you discover available carparks within a 2km radius of any location. Built with React Native (Expo) and Go, this app provides real-time information for all vehicle types including EVs, with weather forecasts and navigation assistance.
</p>

---

## Demo

![demo](./assets/demo.gif)

---

## 📌 Table of Contents

- [Demo](#demo)
- [📌 Table of Contents](#-table-of-contents)
- [📂 Directory Structure](#-directory-structure)
- [✨ Features](#-features)
- [🧰 Tech Stack](#-tech-stack)
- [⚙️ Prerequisites](#️-prerequisites)
- [🔑 API Keys](#-api-keys)
- [🚀 Getting Started](#-getting-started)
- [🛠️ Environment Setup](#️-environment-setup)
- [💻 Run Application](#-run-application)
  - [📍Local Development](#local-development)
  - [🐳 Containerized Deployment](#-containerized-deployment)
  - [📱 Accessing the App](#-accessing-the-app)
- [📡 API Documentation](#-api-documentation)
  - [🌐 Base URL](#-base-url)
  - [API Endpoint](#api-endpoint)
- [Design Patterns](#design-patterns)
  - [Frontend Design Patterns](#frontend-design-patterns)
  - [Backend Design Patterns](#backend-design-patterns)
  - [Architecture Patterns](#architecture-patterns)
- [👥 Contributors](#-contributors)

---

## 📂 Directory Structure

```
project-root/
├── client/                     # Frontend application (React Native/Expo)
│   ├── app/                    # Main application code
│   │   ├── component/          # Reusable UI components
│   │   ├── constants/          # Application constants
│   │   ├── context/            # React context providers
│   │   ├── screen/             # Screen components
│   │   └── utils/              # Utility functions
│   │   └── hooks/              # Custom React Hooks
│   ├── assets/                 # Static assets
│   ├── .env.example            # Example environment file
│   ├── .gitignore              # Git ignore file
│   ├── app.json                # Expo app configuration
│   ├── babel.config.js         # Babel configuration
│   ├── expo-env.d.ts           # Expo environment type definitions
│   ├── global.css              # Global CSS styles
│   ├── metro.config.js         # Metro bundler configuration
│   ├── nativewind-env.d.ts     # NativeWind type definitions
│   ├── package-lock.json       # NPM lock file
│   ├── package.json            # NPM package configuration
│   ├── README.md               # Client documentation
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── tsconfig.json           # TypeScript configuration
│
└── server/                     # Backend application (Go)
    ├── api/                    # API routes and handlers
    ├── data/                   # Data layer
    ├── database/               # Database connections and models
    ├── external_services/      # External API integrations
    ├── handler/                # Request handlers
    ├── middleware/             # Middleware functions
    ├── model/                  # Data models
    ├── utils/                  # Utility functions
    ├── .env.example            # Example environment file
    ├── .gitignore              # Git ignore file
    ├── docker-compose.yaml     # Docker Compose configuration
    ├── Dockerfile              # Docker configuration
    ├── go.mod                  # Go module file
    ├── go.sum                  # Go dependencies checksum
    ├── main.go                 # Application entry point
    ├── output.txt              # Output logs
    ├── LICENSE                 # License information
    ├── Makefile                # Build automation
    └── README.md               # Server documentation
```

---

## ✨ Features

- 🗺️ **Interactive Map Interface** - Visually explore carparks with Google Maps integration
- 🅿️ **Real-time Availability** - Get up-to-the-second data on open parking spaces
- 🚗 **Multi-vehicle Support** - Find parking for cars, EVs, motorcycles, and heavy vehicles
- ⚡ **EV Charging Stations** - Locate carparks with electric vehicle charging capabilities
- 🌦️ **Weather Integration** - Plan ahead with current conditions and 3-hour forecasts
- 🧭 **Smart Navigation** - View estimated travel distance and time to each carpark
- 📊 **Sorting Options** - Organize carparks by availability, distance, or price
- 📱 **Cross-platform** - Works seamlessly on both iOS and Android devices

---

## 🧰 Tech Stack

**Frontend:**

- React Native with Expo

**Backend:**

- Go (Golang) 1.23.6+
- RESTful API architecture
- Docker containerization
- Redis (Caching and optimize API endpoint)

---

## ⚙️ Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/)
- npm (Node Package Manager)
- [Go 1.23.6+](https://go.dev/dl/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Docker](https://docs.docker.com/engine/install/) (for containerized deployment)
- [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/) (caching to optimize Api endpoint)

**Quick Install Commands:**

```bash
# Linux
sudo apt-get update
sudo apt-get install nodejs npm
npm install -g expo-cli

# macOS (using Homebrew)
brew update
brew install node
npm install -g expo-cli
```

---

## 🔑 API Keys

You'll need to obtain API keys from the following services:

- **[Google Cloud Platform](https://console.cloud.google.com/apis/)**

  - Enable: Maps SDK (Android & iOS), Places API, Weather API, Street View Static API
  - Used for: map rendering, location search, weather data, street view images, getting EV lots

- **[URA](https://eservice.ura.gov.sg/maps/api/reg.html)**

  - Used for: real-time carpark availability data

- **[OneMap](https://www.onemap.gov.sg/apidocs/)**

  - Used for: routing and navigation services

- **[LTA DataMall](https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html)**
  - Used for: additional carpark information (shopping malls, streets)

---

## 🚀 Getting Started

```Bash
# Clone the repository
git clone git@github.com:CLinnSheng/SC2006-Lab.git
cd SC2006-Lab
```

## 🛠️ Environment Setup

Configure your environment variables before running the application. Create .env files in both the client and server directories based on the .env.example files provided and replace the placeholder values with your actual API keys.

```sh
# For the client
cp client/.env.example client/.env  # Edit with your API keys

# For the server
cp server/.env.example server/.env  # Edit with your API keys
```

## 💻 Run Application

Make sure you are in the root directory of the project (/SC2006-Lab)

### 📍Local Development

```Bash
# Run both server and client locally
make run-local

# Clean build binaries
make clean
```

### 🐳 Containerized Deployment

Ensure Docker is installed and running:

```Bash
# Build and run with Docker
make run-container

# Build Docker images only
make build-container

# View the logging of the server running on the container
docker log SweetSpot --follow
```

### 📱 Accessing the App

Once the Expo server is up:

- Press `a` to open on Android emulator/device
- Press `i` to open on iOS simulator/device
- Scan the QR code with Expo Go app on your physical device

---

## 📡 API Documentation

### 🌐 Base URL

http://localhost:<PORT>

> The `<PORT>` is defined in your `.env` file under the `server` directory. By default, it is usually set to `8080`.

**Example:**
http://localhost:8080

### API Endpoint

| Method | Endpoint               | Description                                 |
| ------ | ---------------------- | ------------------------------------------- |
| POST   | `/api/carpark/nearby/` | Get nearby car parks based on user location |

POST /api/carpark/nearby
Originally intended as a GET method, but used POST due to large payload.
**Request Body:**

```json
{
  "CurrentUserLocation": {
    "latitude": 1.3521,
    "longitude": 103.8198
  },
  "SearchLocation": {
    "latitude": 1.3521,
    "longitude": 103.8198
  },
  "EVLot": [
    {
      "formattedAddress": "38 Cleantech Loop, Singapore 636741",
      "location": {
        "latitude": 1.3530720999999999,
        "longitude": 103.6914374
      },
      "displayName": {
        "text": "SP Mobility Charging Station",
        "languageCode": "en"
      },
      "shortFormattedAddress": "38 Cleantech Loop, Singapore",
      "evChargeOptions": {
        "connectorCount": 7,
        "connectorAggregation": [
          {
            "type": "EV_CONNECTOR_TYPE_CCS_COMBO_2",
            "maxChargeRateKw": 100,
            "count": 2
          },
          {
            "type": "EV_CONNECTOR_TYPE_TYPE_2",
            "maxChargeRateKw": 7.400000095367432,
            "count": 5
          }
        ]
      }
    }
    //.. remaining EV lots
  ]
}
```

**Response Body**

```json
{
  "CarPark": [
    {
      "address": "BLK 401-408 SIN MING AVENUE",
      "carParkID": "BE3",
      "carParkType": "",
      "latitude": 1.3623638203409012,
      "longitude": 103.83440656538859,
      "lotDetails": {
        "C": {
          "availableLots": "186",
          "totalLots": "319"
        }
      },
      "routeInfo": {
        "distance": "1.7",
        "duration": "5",
        "polyline": "a{gGa~txRSIcC_Hc@oAu@yBQ}@cAmFSaAO{@i@uCeBMqAMq@AM]?_@@a@?[FoFB_C?sAAWISUUWIy@Ey@E{@?{A@eB@aAIk@G_@ECeBi@wHNc@"
      }
    }
    //.. remaining return CarPark
  ],
  "EV": [
    {
      "chargers": [
        {
          "availableCount": "N/A",
          "count": "4",
          "maxChargeRateKW": "11.0",
          "type": "EV_CONNECTOR_TYPE_TYPE_2"
        }
      ],
      "displayName": "",
      "formattedAddress": "903 Jurong West Street 91, Singapore 640903",
      "location": {
        "latitude": 0,
        "longitude": 0
      },
      "routeInfo": {
        "distance": "0.0",
        "duration": "0",
        "polyline": ""
      },
      "shortFormattedAddress": "903 Jurong West Street 91, Singapore",
      "totalChargers": 4
    }
    //.. remaining return EV lots
  ]
}
```

---

## Design Patterns

### Frontend Design Patterns

- **Container/Presentational Pattern**: Separated concerns between components. Container components handled data fetching and logic, while Presentational components focused solely on rendering UI based on props. This improved component reusability and testability.
- **Provider Pattern**: Utilized React Context (via Expo's Context API) to manage application-wide state, such as user authentication and location data, avoiding prop drilling and simplifying state access across deeply nested components.
- **Custom Hooks**: Encapsulated reusable stateful logic, like fetching data from APIs or handling user input, making our components cleaner and the logic easier to reuse across different views. For example, we created a `useLocation` hook to manage current location updates.
- **Render Props**: Employed render props in specific scenarios, such as within our map component, to allow parent components to customize the rendering of markers or overlays based on dynamic data.

### Backend Design Patterns

- **Middleware Pattern**: Leveraged Fiber's middleware capabilities to handle cross-cutting concerns like request logging, authentication, and data validation in a modular and organized way, ensuring consistent processing for all API endpoints.
- **Repository Pattern**: Abstracted data access logic for interacting with the Singapore government APIs. This allowed us to easily switch or mock data sources if needed and kept our business logic decoupled from the specifics of API calls.
- **Dependency Injection**: While Go doesn't have built-in DI, we employed manual dependency injection (passing dependencies as function arguments or struct fields) to improve testability and reduce coupling between components, particularly in our service layer.
- **Service Layer**: Implemented a service layer to contain the core business logic of our application, such as fetching and processing data from multiple APIs and calculating routes. This kept our API controllers lean and focused on request/response handling.

### Architecture Patterns

- **MVC (Model-View-Controller)**: Organized our backend Go code using the MVC pattern. Models represented data structures, Controllers handled API requests and responses, and (though not strictly "Views" in a traditional web sense) our response serializers acted as a form of view logic for presenting data.
- **Microservices (Conceptual):** While this project might be a monolith, we designed our modules and services with a potential future transition to microservices in mind, ensuring clear boundaries and independent functionality.
- **REST API**: Designed our backend API following RESTful principles, using standard HTTP methods (GET, POST, etc.) for CRUD operations on resources like car parks and EV charging stations, ensuring interoperability and ease of use for frontend developers.

---

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/CLinnSheng">
        <img src="https://github.com/CLinnSheng.png" width="100px;" alt=""/>
        <br />
        <sub><b>@CLinnSheng</b></sub>
      </a>
      <br />
      <sub>Fullstack Development, Documentation</sub>
    </td>
    <td align="center">
      <a href="https://github.com/shamz-10">
        <img src="https://github.com/shamz-10.png" width="100px;" alt=""/>
        <br />
        <sub><b>@shamz-10</b></sub>
      </a>
      <br />
      <sub>Frontend UI/UX, Documentation</sub>
    </td>
    <td align="center">
      <a href="https://github.com/piperatthegateofdawn">
        <img src="https://github.com/piperatthegateofdawn.png" width="100px;" alt=""/>
        <br />
        <sub><b>@piperatthegateofdawn0</b></sub>
      </a>
      <br />
      <sub>Frontend UI/UX, Documentation</sub>
    </td><td align="center">
      <a href="https://github.com/X-Jiarui">
        <img src="https://github.com/X-Jiarui.png" width="100px;" alt=""/>
        <br />
        <sub><b>@X-Jiarui0</b></sub>
      </a>
      <br />
      <sub>Frontend UI/UX, Documentation</sub>
    </td><td align="center">
      <a href="https://github.com/Yeet94">
        <img src="https://github.com/Yeet94.png" width="100px;" alt=""/>
        <br />
        <sub><b>@Yeet94</b></sub>
      </a>
      <br />
      <sub>Frontend UI/UX, Documentation</sub>
    </td>
  </tr>
</table>

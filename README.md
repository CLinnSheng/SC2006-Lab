# 🚗 SC2006-Lab Project: SweetSpot - Your Smart Carpark & Weather Companion ☀️

> **Find the perfect parking spot in seconds!** SweetSpot helps you discover available carparks within a 2km radius of any location. Built with React Native (Expo) and Go, this app provides real-time information for all vehicle types including EVs, with weather forecasts and navigation assistance.

---

## 📌 Table of Contentse of Contents

- [ Directory Structure](#-directory-structure)
- [ Features](#-features)
- [ Tech Stack](#-tech-stack)
- [ Prerequisites](#️-prerequisites)
- [ API Keys](#-api-keys)
- [ Getting Started](#-getting-started)
- [ Environment Setup](#️-environment-setup)
- [ Run Application](#-run-application)
  - [Local Development](#local-development)
  - [ Container Containerized Deployment](#container-containerized-deployment)
  - [Accessing the App](#-accessing-the-app)
- [ API Documentation](#-api-documentation)
  - [ Base URL](#-base-url)

---

<!--
- [SC2006-Lab Project](#sc2006-lab-project)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Environment Setup](#environment-setup)
  - [Usage](#usage)
  - [Test](#test)
  - [API Documentation](#api-documentation)
    - [Base URL](#base-url)
    - [Endpoints](#endpoints)
      - [Car Park API](#car-park-api)
        - [GET /carpark/nearby](#get-carparknearby)
    - [Authentication](#authentication)
    - [Rate Limiting](#rate-limiting)
    - [Error Responses](#error-responses)
    - [Data Formats](#data-formats)
  - [Architecture](#architecture)
    - [Client Folder Architecture](#client-folder-architecture)
    - [Server Folder Architecture](#server-folder-architecture)
  - [Design Patterns](#design-patterns)
    - [Frontend Design Patterns](#frontend-design-patterns)
    - [Backend Design Patterns](#backend-design-patterns)
    - [Architecture Patterns](#architecture-patterns)
  - [Technologies Used](#technologies-used)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Contributors](#contributors)
  - [License](#license) -->

## 📂 Directory Structure
TESTING

## ✨ Features

- 🗺️  **Interactive Map Interface** - Visually explore carparks with Google Maps integration
- 🅿️  **Real-time Availability** - Get up-to-the-second data on open parking spaces
- 🚗 **Multi-vehicle Support** - Find parking for cars, EVs, motorcycles, and heavy vehicles
- ⚡ **EV Charging Stations** - Locate carparks with electric vehicle charging capabilities
- 🌦️  **Weather Integration** - Plan ahead with current conditions and 3-hour forecasts
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
- Redis (Caching and optimize api endpoint)
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

### 🐳 Container Containerized Deployment

Ensure Docker is installed and running:

```Bash
# Build and run with Docker
make run-container

# Build Docker images only
make build-container
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
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/carpark/nearby/` | Get nearby car parks based on user location |

POST /api/carpark/nearby
Suppose to be get method but the request payload is too large
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
    },
    //.. (rest of EVLot)
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
    },
    //.. (rest of return carPark)
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
    },
    //.. (rest of return EV lots)
  ]
}
```

# 🚗 SC2006-Lab Project: SweetSpot - Your Smart Carpark & Weather Companion ☀️

> Discover available carparks effortlessly within a 2km radius of your searched or current location. Built with a sleek React Native (Expo) frontend and a robust Go backend server, this application provides real-time carpark information for all vehicle types: cars (including EVs), motorcycles, and heavy vehicles. Not only can you view the number of available lots and sort by availability and distance, but you'll also get estimated travel distance and time, plus up-to-the-minute weather conditions and a 3-hour forecast.

---

## 📌 Table of Contentse of Contents

- [🚗 SC2006-Lab Project: SweetSpot - Your Smart Carpark \& Weather Companion ☀️](#-sc2006-lab-project-sweetspot---your-smart-carpark--weather-companion-️)
  - [📌 Table of Contentse of Contents](#-table-of-contentse-of-contents)
  - [✨ Features](#-features)
  - [⚙️ Prerequisites](#️-prerequisites)
  - [🔑 API Keys](#-api-keys)
  - [🚀 Getting Started](#-getting-started)
  - [🛠️ Environment Setup](#️-environment-setup)
  - [💻 Run Application](#-run-application)
    - [📍Local](#local)
    - [🐳 Container](#-container)
  - [📡 API Documentation](#-api-documentation)
    - [🌐 Base URL](#-base-url)

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

## ✨ Features

- 🗺️ **Interactive Map:** Seamless integration with Google Maps allows users to visually explore nearby carparks and their locations.
- 🅿️ **Carpark Availability:** Real-time information on the number of available lots, with filtering options based on vehicle type (car, EV, motorcycle, heavy vehicle).
- ⚡ **EV Charging:** Easily locate carparks equipped with Electric Vehicle charging stations, making it convenient for EV owners.
- ☀️ **Weather Integration:** Displays current weather conditions and a detailed 3-hour forecast for the selected location, helping users plan their trips.
- 🧭 **Intelligent Navigation:** Calculates and displays the estimated travel distance and time to each carpark, aiding in decision-making.

---

## ⚙️ Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/)
- npm (Node Package Manager)
- [Go 1.23.6+](https://go.dev/dl/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Docker](https://docs.docker.com/engine/install/) (for containerized deployment)

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

- [Google Api](https://console.cloud.google.com/apis/): Used for map rendering, place searching, weather information, static street view images and finding nearby EV.
  - Maps SDK for Android & iOS
  - Places API (New)
  - Weather API
  - Street View Static API
- [URA](https://eservice.ura.gov.sg/maps/api/reg.html): Provide access to real-time carpark availability and carpark information
- [OneMap](https://www.onemap.gov.sg/apidocs/): For routing
- [LTA](https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html): Another source for carpark information which includes carpark from shopping malls and streets.

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

### 📍Local

```Bash
# Run both server and client locally
make run-local

# Clean build binaries
make clean
```

### 🐳 Container

Ensure Docker is installed and running:

```Bash
make run-container
```

Once the Expo server is up:

- Press `a` to open on Android emulator/device
- Press `i` to open on iOS simulator/device
- Scan the QR code with Expo Go app on your physical device

---

## 📡 API Documentation

### 🌐 Base URL

http://localhost:<PORT>/api

> The `<PORT>` is defined in your `.env` file under the `server` directory. By default, it is usually set to `8080`.

**Example:**
http://localhost:8080/api

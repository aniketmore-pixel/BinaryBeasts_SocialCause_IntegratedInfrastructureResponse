# SheherSetu: Integrated Infrastructure Response Platform

SheherSetu is a next-generation smart city command center designed to revolutionize urban infrastructure management. By integrating AI-powered analysis, real-time IoT simulations, and citizen reporting, the platform provides officials with a comprehensive digital twin to monitor, predict, and respond to infrastructure issues proactively.

The system features dedicated portals for both city officials and citizens, creating a collaborative ecosystem for maintaining and improving urban infrastructure.

## Screenshots
<img width="1920" height="1080" alt="Screenshot (225)" src="https://github.com/user-attachments/assets/ccd9169a-033b-470d-92ad-bfbe7d1a4101" />
<img width="1920" height="1080" alt="Screenshot (228)" src="https://github.com/user-attachments/assets/cf8e76a7-324c-443c-a204-665991ea3a8a" />
<img width="1920" height="1080" alt="Screenshot (229)" src="https://github.com/user-attachments/assets/97a0c55a-fc30-4a43-8634-63a895943e31" />
<img width="1920" height="1080" alt="Screenshot (230)" src="https://github.com/user-attachments/assets/15274e29-d48c-4c3b-82d3-207277144be7" />
<img width="1920" height="1080" alt="Screenshot (226)" src="https://github.com/user-attachments/assets/b7980c74-2f6c-4b71-b72a-296cc742303a" />
<img width="1920" height="1080" alt="Screenshot (231)" src="https://github.com/user-attachments/assets/4cc6d795-85d0-4907-8f13-90f0c15ecfae" />
<img width="1920" height="1080" alt="Screenshot (232)" src="https://github.com/user-attachments/assets/4530b44f-7e82-496e-b5a4-f16d1cf77cc0" />
<img width="1920" height="1080" alt="Screenshot (233)" src="https://github.com/user-attachments/assets/2b1861b8-9ee6-4463-9c0d-b7f7fff6a332" />
<img width="1920" height="1080" alt="Screenshot (234)" src="https://github.com/user-attachments/assets/c87e9fd3-945b-440a-b78f-4facf5f7385b" />
<img width="1920" height="1080" alt="Screenshot (235)" src="https://github.com/user-attachments/assets/d0cd280f-988b-4274-82ce-e6a63a213c82" />
<img width="1920" height="1080" alt="Screenshot (236)" src="https://github.com/user-attachments/assets/d97124bf-2b4c-4ecc-82d3-e8b7af41c10b" />
<img width="1920" height="1080" alt="Screenshot (237)" src="https://github.com/user-attachments/assets/876b2188-d71a-49f4-b3fe-70969d014ca9" />
<img width="1920" height="1080" alt="Screenshot (238)" src="https://github.com/user-attachments/assets/89419b66-9296-4def-9434-ab6608403d0a" />


## Key Features

-   **Unified Command Center**: A centralized dashboard for officials featuring analytics on city health, budget utilization, and incident tracking, providing a holistic view of the city's operational status.

-   **AI Vision Engine**: Automatically analyzes uploaded images to detect road damage, cracks, and structural stress. This is powered by a suite of models including Groq for vision analysis, TensorFlow/Keras for health predictions, and PyTorch for pothole detection.

-   **Live Digital Twin**: An interactive map visualizes real-time, simulated IoT sensor data for critical assets. This includes monitoring vibration on bridges, pressure in water pipelines, and frequency/load on power grids.

-   **Citizen Engagement Portal**: An intuitive interface for citizens to report issues with photo evidence, track the status of their reports, and view community-wide alerts, fostering civic participation.

-   **Predictive Failure Analysis**: Implements a "Doomsday Time Travel Graph" to forecast infrastructure failure dates based on historical data and decay models, estimating the financial impact of proactive vs. reactive maintenance.

-   **Smart Contract Management**: A MongoDB-backed system allows officials to create and manage repair contracts with contractors, including a simulated escrow mechanism for releasing payments based on project milestones.

-   **AI-Powered Assistance**: The platform incorporates a Gemini-powered chatbot for user assistance and a Groq-based engine to generate executive summaries for complex infrastructure reports, aiding in rapid decision-making.

## System Architecture

The platform is built on a modern microservice-oriented architecture:

-   **Frontend**: A responsive user interface built with **React (Vite)** and styled with **Tailwind CSS**. It uses **React Leaflet** for map visualizations and **Recharts** for data analytics.

-   **Backend**: The core API is a **Node.js (Express)** server that handles user authentication, data management, and business logic. It connects to **Supabase** for primary data storage and **MongoDB** for contract management.

-   **AI & ML Microservices (Python)**:
    -   **InfraScan API**: A **FastAPI** service leveraging the **Groq Vision API** to provide detailed JSON-based assessments of infrastructure images.
    -   **Health Prediction API**: A **Flask** server hosting a **TensorFlow/Keras** model to predict the health scores of structures like walls and buildings.
    -   **IoT Sensor Simulation**: A **Flask** server that simulates and streams realistic telemetry data for various virtual IoT sensors.

## Getting Started

To run this project locally, you will need Node.js, npm, and Python installed.

### 1. Clone the Repository

```bash
git clone https://github.com/aniketmore-pixel/BinaryBeasts_SocialCause_IntegratedInfrastructureResponse.git
cd BinaryBeasts_SocialCause_IntegratedInfrastructureResponse
```

### 2. Backend Setup

The main backend server handles authentication, database operations, and orchestrates calls to AI services.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file and add the required environment variables (see below)

# Start the server
node server.js
```

The backend server will run on `http://localhost:5002`.

### 3. Frontend Setup

The React frontend provides the user interface for all portals.

```bash
# From the root directory

# Install dependencies
npm install

# Create a .env.local file for the Gemini API Key:
# VITE_GEMINI_API_KEY=your_gemini_api_key

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port specified by Vite).

### 4. AI & Simulation Services (Python)

Each Python service must be run in a separate terminal.

#### a. InfraScan API (Vision Analysis)

```bash
cd model_files/infra-analyzer

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8047
```

#### b. Health Prediction API (Structural Health)

```bash
cd model_files

# Install dependencies
pip install tensorflow flask flask-cors Pillow

# Start the server
python kunal.py
```

#### c. IoT Sensor Simulation

```bash
cd model_files/sensor-simulation

# Install dependencies
pip install flask flask-cors

# Start the server
python sensor_server.py
```

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Supabase Credentials
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Port for the backend server
PORT=5002

# JWT Secret for signing tokens
JWT_SECRET=your_jwt_secret_key

# Groq API Key for AI summaries
GROQ_API_KEY=your_groq_api_key

# MongoDB Connection String for contracts
MONGO_URI=your_mongodb_connection_string
```

Create a `.env.local` file in the root directory for the frontend:
```env
# Gemini API Key for the chatbot
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Usage

Once all services are running, you can access the platform through the frontend URL.

-   **Login as an Official/Admin**: Use credentials for a user with the `OFFICIAL` or `ADMIN` role in your Supabase `users` table. You will be redirected to the main analytics dashboard at `/analytics`.

-   **Login as a Citizen**: Register a new account or use credentials for a user with the `USER` role. You will be redirected to the citizen portal at `/citizen-portal` where you can report issues.# SheherSetu: Integrated Infrastructure Response Platform

SheherSetu (formerly UrbanIQ) is a next-generation smart city command center designed to revolutionize urban infrastructure management. By integrating AI-powered analysis, real-time IoT simulations, and citizen reporting, the platform provides officials with a comprehensive digital twin to monitor, predict, and respond to infrastructure issues proactively.

The system features dedicated portals for both city officials and citizens, creating a collaborative ecosystem for maintaining and improving urban infrastructure.

## Key Features

-   **Unified Command Center**: A centralized dashboard for officials featuring analytics on city health, budget utilization, and incident tracking, providing a holistic view of the city's operational status.

-   **AI Vision Engine**: Automatically analyzes uploaded images to detect road damage, cracks, and structural stress. This is powered by a suite of models including Groq for vision analysis, TensorFlow/Keras for health predictions, and PyTorch for pothole detection.

-   **Live Digital Twin**: An interactive map visualizes real-time, simulated IoT sensor data for critical assets. This includes monitoring vibration on bridges, pressure in water pipelines, and frequency/load on power grids.

-   **Citizen Engagement Portal**: An intuitive interface for citizens to report issues with photo evidence, track the status of their reports, and view community-wide alerts, fostering civic participation.

-   **Predictive Failure Analysis**: Implements a "Doomsday Time Travel Graph" to forecast infrastructure failure dates based on historical data and decay models, estimating the financial impact of proactive vs. reactive maintenance.

-   **Smart Contract Management**: A MongoDB-backed system allows officials to create and manage repair contracts with contractors, including a simulated escrow mechanism for releasing payments based on project milestones.

-   **AI-Powered Assistance**: The platform incorporates a Gemini-powered chatbot for user assistance and a Groq-based engine to generate executive summaries for complex infrastructure reports, aiding in rapid decision-making.

## System Architecture

The platform is built on a modern microservice-oriented architecture:

-   **Frontend**: A responsive user interface built with **React (Vite)** and styled with **Tailwind CSS**. It uses **React Leaflet** for map visualizations and **Recharts** for data analytics.

-   **Backend**: The core API is a **Node.js (Express)** server that handles user authentication, data management, and business logic. It connects to **Supabase** for primary data storage and **MongoDB** for contract management.

-   **AI & ML Microservices (Python)**:
    -   **InfraScan API**: A **FastAPI** service leveraging the **Groq Vision API** to provide detailed JSON-based assessments of infrastructure images.
    -   **Health Prediction API**: A **Flask** server hosting a **TensorFlow/Keras** model to predict the health scores of structures like walls and buildings.
    -   **IoT Sensor Simulation**: A **Flask** server that simulates and streams realistic telemetry data for various virtual IoT sensors.

## Getting Started

To run this project locally, you will need Node.js, npm, and Python installed.

### 1. Clone the Repository

```bash
git clone https://github.com/aniketmore-pixel/BinaryBeasts_SocialCause_IntegratedInfrastructureResponse.git
cd BinaryBeasts_SocialCause_IntegratedInfrastructureResponse
```

### 2. Backend Setup

The main backend server handles authentication, database operations, and orchestrates calls to AI services.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file and add the required environment variables (see below)

# Start the server
node server.js
```

The backend server will run on `http://localhost:5002`.

### 3. Frontend Setup

The React frontend provides the user interface for all portals.

```bash
# From the root directory

# Install dependencies
npm install

# Create a .env.local file for the Gemini API Key:
# VITE_GEMINI_API_KEY=your_gemini_api_key

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port specified by Vite).

### 4. AI & Simulation Services (Python)

Each Python service must be run in a separate terminal.

#### a. InfraScan API (Vision Analysis)

```bash
cd model_files/infra-analyzer

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8047
```

#### b. Health Prediction API (Structural Health)

```bash
cd model_files

# Install dependencies
pip install tensorflow flask flask-cors Pillow

# Start the server
python kunal.py
```

#### c. IoT Sensor Simulation

```bash
cd model_files/sensor-simulation

# Install dependencies
pip install flask flask-cors

# Start the server
python sensor_server.py
```

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Supabase Credentials
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Port for the backend server
PORT=5002

# JWT Secret for signing tokens
JWT_SECRET=your_jwt_secret_key

# Groq API Key for AI summaries
GROQ_API_KEY=your_groq_api_key

# MongoDB Connection String for contracts
MONGO_URI=your_mongodb_connection_string
```

Create a `.env.local` file in the root directory for the frontend:
```env
# Gemini API Key for the chatbot
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Usage

Once all services are running, you can access the platform through the frontend URL.

-   **Login as an Official/Admin**: Use credentials for a user with the `OFFICIAL` or `ADMIN` role in your Supabase `users` table. You will be redirected to the main analytics dashboard at `/analytics`.

-   **Login as a Citizen**: Register a new account or use credentials for a user with the `USER` role. You will be redirected to the citizen portal at `/citizen-portal` where you can report issues.

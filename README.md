# Smart Supply Chain Optimization Cockpit

This project is a web-based decision-support tool for supply chain managers. It provides a comprehensive cockpit to forecast demand, optimize shipments, simulate daily operations under uncertainty, and analyze different scenarios to improve business outcomes like cost reduction and service level improvement.

## Features

- **Dashboard**: A strategic overview of the most critical Key Performance Indicators (KPIs): Total Cost, Service Level, Inventory Turns, and Cost Savings.
- **Demand Forecasting**: Visualizes historical sales data and generates a forward-looking demand forecast with confidence intervals.
- **Shipment Optimization**: A prescriptive analytics engine that calculates the most efficient shipment plan based on user-defined goals (Cost vs. Service Level) and a configurable time horizon.
- **Operations Simulation**: A risk analysis module to stress-test the optimized plan against real-world stochasticity like demand volatility and lead-time variability.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Data Visualization**: Recharts
- **Backend (Simulated)**: A mock API service is used within the frontend to simulate backend responses for development and demonstration purposes.

## Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 18 or newer)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/smart-supply-chain.git
    cd smart-supply-chain
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application

To start the local development server, run the following command:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port). The server supports Hot Module Replacement, so any changes you make to the source code will be reflected in the browser instantly.

## Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles TypeScript and builds the application for production in the `dist` folder.
- `npm run preview`: Serves the production build locally to preview it.

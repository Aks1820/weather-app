# SkyCast - Open-Meteo Weather Application

A high-performance, responsive weather web application built with React, Vite, and Tailwind CSS. The application integrates seamlessly with the [Open-Meteo API](https://open-meteo.com) to deliver real-time localized climate data, historical trends, and dynamic sun cycle tracking.

## 🚀 Features

- **Automatic Location Detection**: Instantly detects your browser GPS location upon landing to fetch precise localized weather data.
- **Current & Hourly Forecast**: View up-to-date atmospheric conditions (Temperature, Humidity, Precipitation) alongside beautifully mapped interactive area charts.
- **Historical Weather Analysis**: Select custom date ranges spanning back up to 2 years to analyze long-term trends for Temperature, Precipitation, Maximum Wind Speed, and Air Quality.
- **Interactive Sun Cycle Tracking**: Features a custom dual Line Chart tracking precise Sunrise and Sunset times visually across the calendar.
- **Microsecond Navigation**: Engineered with an in-memory caching service layer, guaranteeing instantaneous data delivery when quickly switching between tabs or analyzing huge API payloads.
- **Mobile-First Design**: Fully responsive Tailwind CSS UI featuring frosted glassmorphism components, custom segmented navigation pills, and crisp SVG icon styling.

## 🛠️ Technology Stack

- **Core**: React.js 18 + TypeScript (via Vite for lightning-fast compilation)
- **Styling**: Tailwind CSS
- **Data Visualization**: Recharts (Custom Tooltips & Gradients)
- **APIs**: Open-Meteo (Forecast API, Air Quality API, Historical Archive API)
- **Date Automation**: `date-fns` & `date-fns-tz`
- **Routing**: React Router DOM v6
- **Icons**: Lucide React

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <your-github-repo-url>
   cd weather-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `https://weather-app-9cpm.vercel.app/` to view the application in the browser.

## 🌐 Live Deployment
*This application requires zero server-side setup or secret keys and can be deployed instantly to Vercel or Netlify by importing the GitHub repository.*

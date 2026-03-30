import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WeatherProvider } from "./context/WeatherContext";
import Layout from "./components/Layout";
// Lazy load pages for performance
import React, { Suspense } from "react";

const CurrentWeatherPage = React.lazy(
  () => import("./pages/CurrentWeatherPage"),
);
const HistoricalWeatherPage = React.lazy(
  () => import("./pages/HistoricalWeatherPage"),
);

function App() {
  return (
    <WeatherProvider>
      <Router>
        <Layout>
          <Suspense
            fallback={
              <div className="flex h-screen items-center justify-center text-slate-300">
                Loading Application...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<CurrentWeatherPage />} />
              <Route path="/historical" element={<HistoricalWeatherPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </WeatherProvider>
  );
}

export default App;

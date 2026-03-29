// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import React from "react";
import useWeather from "./useFetchData";

const WeatherIcon = ({ icon }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  return (
    <motion.img
      src={iconUrl}
      alt="weather icon"
      className="h-20 w-20 drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)]"
      animate={{ y: [0, -7, 0], rotate: [0, 3, 0, -3, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    />
  );
};

const MetricCard = ({ title, value, unit, helper, delay = 0 }) => (
  <motion.div
    className="metric-card"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
    whileHover={{ y: -2, scale: 1.01 }}
  >
    <h3 className="metric-title">{title}</h3>
    <p className="metric-value">
      {value} {unit}
    </p>
    {helper ? <p className="metric-helper">{helper}</p> : null}
  </motion.div>
);

const App = () => {
  const [city, setCity] = React.useState("Delhi");
  const [searchCity, setSearchCity] = React.useState("Delhi");
  const { weatherData, loading, error } = useWeather(searchCity);

  const handleSearch = () => {
    if (city.trim()) {
      setSearchCity(city.trim());
    }
  };

  const getWindDirection = (deg) => {
    if (deg === undefined || deg === null) return "N/A";
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(deg / 45) % 8];
  };

  const formatTime = (unixSeconds) =>
    new Date(unixSeconds * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatVisibility = (meters) =>
    meters ? `${(meters / 1000).toFixed(1)} km` : "N/A";

  const detailRows = weatherData
    ? [
        ["Country", weatherData.sys.country || "N/A"],
        ["Coordinates", `${weatherData.coord.lat}, ${weatherData.coord.lon}`],
        [
          "Min / Max",
          `${Math.round(weatherData.main.temp_min)}° / ${Math.round(
            weatherData.main.temp_max
          )}°`,
        ],
        [
          "Sea Level",
          weatherData.main.sea_level ? `${weatherData.main.sea_level} hPa` : "N/A",
        ],
        [
          "Ground Level",
          weatherData.main.grnd_level
            ? `${weatherData.main.grnd_level} hPa`
            : "N/A",
        ],
        ["Visibility", formatVisibility(weatherData.visibility)],
      ]
    : [];

  return (
    <div className="app-shell">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <motion.div
        className="weather-panel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Live Weather Insights
          </motion.p>
          <motion.h1
            className="panel-title"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            Forecast-ready dashboard for any city.
          </motion.h1>
          <motion.div
            className="search-row"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
          >
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search city (e.g. Mumbai, Tokyo, Berlin)"
              className="search-input"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <motion.button
              onClick={handleSearch}
              className="search-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Show Weather
            </motion.button>
          </motion.div>
        </div>

        {!searchCity && !weatherData && !loading && !error && (
          <div className="empty-state">
            Type a city name and press Enter to view weather details.
          </div>
        )}

        {loading && <div className="status-message">Loading latest weather...</div>}

        {error && <div className="status-message error-message">{error}</div>}

        {weatherData && !loading && !error && (
          <motion.div
            className="weather-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            <div className="top-grid">
              <div className="summary-card">
                <div className="summary-head">
                  <h2 className="city-name">
                    {weatherData.name}, {weatherData.sys.country}
                  </h2>
                  <WeatherIcon icon={weatherData.weather[0].icon} />
                </div>
                <p className="time-text">
                  Updated: {new Date(weatherData.dt * 1000).toLocaleDateString()} {" "}
                  {formatTime(weatherData.dt)}
                </p>
                <div className="temperature-row">
                  <motion.h2
                    className="temperature"
                    animate={{ letterSpacing: ["0px", "0.5px", "0px"] }}
                    transition={{ repeat: Infinity, duration: 3.5 }}
                  >
                    {Math.round(weatherData.main.temp)}°C
                  </motion.h2>
                  <div>
                    <p className="description-text capitalize">
                      {weatherData.weather[0].description}
                    </p>
                    <p className="feels-like-text">
                      Feels like {Math.round(weatherData.main.feels_like)}°C
                    </p>
                  </div>
                </div>
              </div>

              <div className="details-card">
                <h3 className="section-title">Quick Details</h3>
                <div className="details-grid">
                  {detailRows.map(([label, value]) => (
                    <div key={label} className="detail-row">
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="metric-grid">
              <MetricCard
                title="Humidity"
                value={weatherData.main.humidity}
                unit="%"
                helper="Relative air moisture"
                delay={0.04}
              />
              <MetricCard
                title="Wind Speed"
                value={weatherData.wind.speed.toFixed(1)}
                unit="m/s"
                helper={`Direction ${getWindDirection(weatherData.wind.deg)}`}
                delay={0.08}
              />
              <MetricCard
                title="Cloud Cover"
                value={weatherData.clouds.all}
                unit="%"
                helper="Total sky coverage"
                delay={0.12}
              />
              <MetricCard
                title="Pressure"
                value={weatherData.main.pressure}
                unit="hPa"
                helper="Atmospheric pressure"
                delay={0.16}
              />
              <MetricCard
                title="Sunrise"
                value={formatTime(weatherData.sys.sunrise)}
                unit=""
                helper="Local morning time"
                delay={0.2}
              />
              <MetricCard
                title="Sunset"
                value={formatTime(weatherData.sys.sunset)}
                unit=""
                helper="Local evening time"
                delay={0.24}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default App;

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
      className="w-24 h-24"
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    />
  );
};

const WeatherCard = ({ title, value, unit, icon }) => (
  <motion.div
    className="bg-white/20 backdrop-blur-lg rounded-xl p-4 flex items-center gap-4 hover:bg-white/30 transition-all"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <span className="text-2xl">{icon}</span>
    <div>
      <h3 className="text-sm text-gray-200">{title}</h3>
      <p className="text-lg text-white font-semibold">
        {value} {unit}
      </p>
    </div>
  </motion.div>
);

const App = () => {
  const [city, setCity] = React.useState("");
  const [searchCity, setSearchCity] = React.useState("");
  const { weatherData, loading, error } = useWeather(searchCity);

  const handleSearch = () => {
    if (city.trim()) {
      setSearchCity(city.trim());
      setCity("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-6">
          <motion.div
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search city..."
              className="flex-1 bg-white/20 text-white placeholder-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <motion.button
              onClick={handleSearch}
              className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              🔍
            </motion.button>
          </motion.div>
        </div>

        {loading && (
          <div className="text-center text-white py-8">Loading...</div>
        )}

        {error && (
          <div className="text-center text-red-300 py-8">{error}</div>
        )}

        {weatherData && !loading && !error && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {weatherData.name}
                </h1>
                <p className="text-sm text-gray-200">
                  {new Date(weatherData.dt * 1000).toLocaleDateString()}{" "}
                  {new Date(weatherData.dt * 1000).toLocaleTimeString()}
                </p>
              </div>
              <WeatherIcon icon={weatherData.weather[0].icon} />
            </div>

            <div className="text-center mb-6">
              <motion.h2
                className="text-5xl font-bold text-white"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                {Math.round(weatherData.main.temp)}°C
              </motion.h2>
              <p className="text-lg text-gray-100 capitalize">
                {weatherData.weather[0].description}
              </p>
              <p className="text-sm text-gray-200">
                Feels like {Math.round(weatherData.main.feels_like)}°C
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <WeatherCard
                title="Humidity"
                value={weatherData.main.humidity}
                unit="%"
                icon="💧"
              />
              <WeatherCard
                title="Wind Speed"
                value={weatherData.wind.speed.toFixed(1)}
                unit="m/s"
                icon="🌬️"
              />
              <WeatherCard
                title="Cloud Cover"
                value={weatherData.clouds.all}
                unit="%"
                icon="☁️"
              />
              <WeatherCard
                title="Pressure"
                value={weatherData.main.pressure}
                unit="hPa"
                icon="🌡️"
              />
              <WeatherCard
                title="Sunrise"
                value={new Date(
                  weatherData.sys.sunrise * 1000
                ).toLocaleTimeString()}
                unit=""
                icon="🌅"
              />
              <WeatherCard
                title="Sunset"
                value={new Date(
                  weatherData.sys.sunset * 1000
                ).toLocaleTimeString()}
                unit=""
                icon="🌄"
              />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default App;
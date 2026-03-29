import { useState, useEffect } from 'react';

const useWeather = (city) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const baseUrl =
          import.meta.env.VITE_WEATHER_BASE_URL ||
          'https://api.openweathermap.org/data/2.5';

        if (!apiKey) {
          throw new Error(
            'Missing API key. Set VITE_OPENWEATHER_API_KEY in your .env file.'
          );
        }

        const response = await fetch(
          `${baseUrl}/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) {
          throw new Error(`${city} not found. Try another city.`);
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  return { weatherData, loading, error };
};

export const useGeolocationWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestLocation = () => {
    setLoading(true);
    setError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoordinates(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (geolocationError) => {
          console.warn('Location access denied, using Delhi as default');
          fetchWeatherByCoordinates(28.7041, 77.1025, true); // Delhi coordinates
        }
      );
    } else {
      console.warn('Geolocation not supported, using Delhi as default');
      fetchWeatherByCoordinates(28.7041, 77.1025, true); // Delhi coordinates
    }
  };

  const fetchWeatherByCoordinates = async (lat, lon, isDefault = false) => {
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const baseUrl =
        import.meta.env.VITE_WEATHER_BASE_URL ||
        'https://api.openweathermap.org/data/2.5';

      if (!apiKey) {
        throw new Error(
          'Missing API key. Set VITE_OPENWEATHER_API_KEY in your .env file.'
        );
      }

      const response = await fetch(
        `${baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      setWeatherData(data);
      if (isDefault) {
        console.log('Using Delhi as default location');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return { weatherData, loading, error, requestLocation };
};

export default useWeather;

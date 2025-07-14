import { useState, useEffect } from 'react';
import { getForecastByCoords } from '../services/weatherService';

function useWeather(coords) {
  const [forecastList, setForecastList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!coords) return;

    const { lat, lon } = coords;

    getForecastByCoords(lat, lon)
      .then(setForecastList)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [coords]);

  return { forecastList, loading, error };
}

export default useWeather;

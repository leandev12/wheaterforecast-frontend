import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function getForecastByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
  const res = await axios.get(url);
  return res.data.list;
}


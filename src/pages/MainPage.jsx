import React, { useState, useEffect } from 'react';
import RoutineForm from '../components/RoutineForm';
import RoutineList from '../components/RoutineList';
import WeatherSuggestions from '../components/WeatherSuggestions';
import useWeather from '../hooks/useWeather';
import { Navigate, useNavigate } from 'react-router-dom';

function MainApp() {
  const [routines, setRoutines] = useState([]);
  const [coords, setCoords] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        console.error('Geolocalización denegada o fallida:', err);
      }
    );
  }, []);

  const { forecastList, loading, error } = useWeather(coords);

  const addRoutine = (routine) => {
    setRoutines(prev => [...prev, routine]);
  };

  return (
    <div className="container">
      <h1>Planificador de Rutinas</h1>
      <RoutineForm onAddRoutine={addRoutine} />
      <RoutineList routines={routines} />
      {!loading && !error && forecastList.length > 0 && (
        <WeatherSuggestions routines={routines} forecastList={forecastList} />
      )}
      {loading && <p>Obteniendo el clima...</p>}
      {error && <p>Error al obtener datos del clima.</p>}
      <button type='button' onClick={() => {navigate('/simulation')}}>Simulacion de Concurrencia</button>
    </div>
  );
}

export default MainApp;

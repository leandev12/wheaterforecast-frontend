import React, { useEffect, useState } from 'react';

const SIMULATED_NAMES = ['lucas', 'ana', 'kevin', 'maria', 'pedro', 'sofia', 'jose', 'elena', 'luis', 'carla'];

function generateRandomUserName() {
  const name = SIMULATED_NAMES[Math.floor(Math.random() * SIMULATED_NAMES.length)];
  const suffix = Math.floor(Math.random() * 1000);
  return `${name}${suffix}`;
}

function UserRegistrationSimulator() {
  const [results, setResults] = useState([]);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const city_id = 3654157;
  const [locationReady, setLocationReady] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
        setLocationReady(true);
      },
      (err) => {
        setResults(prev => [
          {
            user_name: 'Sin ubicación',
            status: 'Error al obtener geolocalización: ' + err.message,
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
      }
    );
  }, []);

  const simulateUserRegistration = async () => {
    const user_name = generateRandomUserName();
    const password = '123456';

    if (lat === null || lon === null) {
      setResults(prev => [
        {
          user_name,
          status: 'Ubicación aún no disponible',
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
      return;
    }

    try {
      const params = new URLSearchParams({
        user_name,
        password,
        lat: lat.toString(),
        lon: lon.toString(),
        city_id: city_id.toString(),
      });

      const url = `https://wheaterforecast-copy-production.up.railway.app/usuarios/register-query/?${params.toString()}`;

      const response = await fetch(url, {
        method: 'POST', // usando POST como pediste
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Fallo en la solicitud');
      }

      const data = await response.json();

      setResults(prev => [
        {
          user_name,
          status: data?.status === 'OK' ? 'Registrado' : 'Falló',
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } catch (err) {
      setResults(prev => [
        {
          user_name,
          status: 'Error de red: ' + err.message,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    }
  };

  useEffect(() => {
    if (!locationReady) return;

    const interval = setInterval(() => {
      for (let i = 0; i < 5; i++) {
        simulateUserRegistration();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [locationReady]);

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h2>Simulación de Registro Concurrente de Usuarios</h2>
      <p>
        {locationReady
          ? 'Ubicación obtenida. Registrando 5 usuarios cada 5 segundos...'
          : 'Esperando ubicación del usuario...'}
      </p>
      <ul>
        {results.slice(0, 20).map((r, idx) => (
          <li key={idx}>
            <strong>{r.user_name}</strong>: {r.status} ({r.time})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserRegistrationSimulator;

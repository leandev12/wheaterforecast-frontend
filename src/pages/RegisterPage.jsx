import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [user_name, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const city_id = 3654157;

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (!user_name || !password) {
      return setError('Todos los campos son obligatorios');
    }

    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    if (!navigator.geolocation) {
      setError('Geolocalización no soportada por el navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const params = new URLSearchParams({
            user_name,
            password,
            lat: lat.toString(),
            lon: lon.toString(),
            city_id: city_id.toString(),
          });

          const url = `https://wheaterforecast-copy-production.up.railway.app/usuarios/register-query/?${params.toString()}`;

          const response = await fetch(url, { method: 'POST' });

          if (!response.ok) {
            const message = await response.text();
            throw new Error(message || 'Error al registrar usuario');
          }

          await response.json();

          alert(`✅ Usuario registrado: ${user_name}`);
          navigate('/');
        } catch (err) {
          setError('Error al registrar usuario: ' + err.message);
        }
      },
      (geoError) => {
        setError('Error al obtener ubicación: ' + geoError.message);
      }
    );
  };

  return (
    <div className="container">
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Usuario"
          value={user_name}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Registrarse</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link></p>
      </form>
    </div>
  );
}

export default RegisterPage;

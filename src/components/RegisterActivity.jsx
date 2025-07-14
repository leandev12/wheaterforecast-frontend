import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RegisterActivity.css';

function RegisterActivity() {
  const [userName, setUserName] = useState('');
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!userName || !activityName) {
      setMessage('Los campos con * son obligatorios.');
      return;
    }

    try {
      const res = await axios.post(
        `https://wheaterforecast-copy-production.up.railway.app/actividades/activitys/?user_name=${encodeURIComponent(userName)}&activity_name=${encodeURIComponent(activityName)}&description=${encodeURIComponent(description)}`
      );

      if (res.data?.status === 'OK') {
        setMessage('Actividad registrada exitosamente');
        setUserName('');
        setActivityName('');
        setDescription('');
      } else {
        setMessage('Error al registrar actividad');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error de conexión con el servidor');
    }
  };

  return (
    <div className="register-container">
      <h2>Registrar Actividad</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Usuario *:
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Nombre de usuario"
            required
          />
        </label>

        <label>
          Nombre de Actividad *:
          <input
            type="text"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            placeholder="Ej: Caminar, Tender ropa"
            required
          />
        </label>

        <label>
          Descripción:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción opcional"
          />
        </label>

        <button type="submit">Registrar</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default RegisterActivity;

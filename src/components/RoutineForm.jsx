import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/RoutineForm.css';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function RoutineForm({ onAddRoutine }) {
  const [activity, setActivity] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [activitiesList, setActivitiesList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://wheaterforecast-copy-production.up.railway.app/actividades/get_activitys/')
      .then((res) => {
        if (res.data?.status === 'OK') {
          setActivitiesList(res.data.data); // accede a "data"
        }
      })
      .catch((err) => {
        console.error('Error al cargar actividades:', err);
      });
  }, []);

  const handleDayChange = (day, time) => {
    setSchedule(prev => {
      const exists = prev.find(d => d.day === day);
      return exists
        ? prev.map(d => d.day === day ? { ...d, time } : d)
        : [...prev, { day, time }];
    });
  };

  const toggleDay = (day) => {
    setSchedule(prev => {
      const exists = prev.find(d => d.day === day);
      return exists
        ? prev.filter(d => d.day !== day)
        : [...prev, { day, time: '07:00' }];
    });
  };

  const isChecked = (day) => schedule.some(d => d.day === day);
  const getTime = (day) => schedule.find(d => d.day === day)?.time || '07:00';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activity || schedule.length === 0) return;
    onAddRoutine({ activity, schedule });
    setActivity('');
    setSchedule([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={activity} onChange={(e) => setActivity(e.target.value)}>
        <option value="">Seleccione una actividad</option>
        {activitiesList.map((a) => (
          <option key={a.id} value={a.activity_name}>
            {a.activity_name}
          </option>
        ))}
      </select>
      <button style={{ marginBottom: '20px' }}type="button" onClick={() => navigate("/register-activity")}>
        Agregar actividad
      </button>

      <div className="checkbox-group">
        {days.map(day => (
          <div key={day}>
            <label>
              <input
                type="checkbox"
                checked={isChecked(day)}
                onChange={() => toggleDay(day)}
              />
              {day}
            </label>
            {isChecked(day) && (
              <input
                type="time"
                className='time-input'
                value={getTime(day)}
                onChange={(e) => handleDayChange(day, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <button type="submit">Agregar rutina</button>
    </form>
  );
}

export default RoutineForm;

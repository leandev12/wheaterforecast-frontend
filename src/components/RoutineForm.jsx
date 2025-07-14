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

  const user_name = 'test_user'; // Puedes cambiar esto con props o contexto si lo tienes

  useEffect(() => {
    axios.get('https://wheaterforecast-copy-production.up.railway.app/actividades/get_activities/')
      .then((res) => {
        if (res.data?.status === 'OK') {
          setActivitiesList(res.data.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activity || schedule.length === 0) return;

    const selectedActivity = activitiesList.find(a => a.activity_name === activity);
    if (!selectedActivity) {
      alert('Actividad no encontrada');
      return;
    }

    try {
      // Ejecutar múltiples requests para cada día seleccionado
      const requests = schedule.map(({ day, time }) => {
        const fullDate = new Date();
        fullDate.setHours(...time.split(':'));
        const dateISO = fullDate.toISOString();

        const params = new URLSearchParams({
          user_name,
          user_act: selectedActivity.id.toString(),
          estatus: 'pendiente',
          message: `Rutina para ${day} a las ${time}`,
          date: dateISO,
        });

        const url = `https://wheaterforecast-copy-production.up.railway.app/recomendaciones/user_recommendation/?${params.toString()}`;

        return axios.post(url);
      });

      await Promise.all(requests);

      alert('Rutina registrada exitosamente');
      onAddRoutine({ activity, schedule });
      setActivity('');
      setSchedule([]);
    } catch (err) {
      console.error('Error al registrar rutina:', err);
      alert('Error al registrar la rutina');
    }
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
      <button style={{ marginBottom: '20px' }} type="button" onClick={() => navigate("/register-activity")}>
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

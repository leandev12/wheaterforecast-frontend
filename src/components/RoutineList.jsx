import React from 'react';
import '../styles/RoutineList.css';
function RoutineList({ routines }) {
  if (routines.length === 0) return <p>No hay rutinas aún.</p>;

  return (
    <div>
      <h2>Rutinas Ingresadas</h2>
      <ul>
        {routines?.map((r, idx) => (
          <li key={idx}>
            <strong>{r.activity}</strong>:
              {r.schedule.map((s) => (
                <div>
                  {s.day} a las {s.time}
                </div>
              ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoutineList;

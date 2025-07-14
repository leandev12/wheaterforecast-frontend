import React from 'react';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);

function WeatherSuggestions({ routines, forecastList }) {
  const now = dayjs();

  const findClosestForecast = (targetDateTime) => {
    return forecastList.reduce((closest, entry) => {
      const entryTime = dayjs(entry.dt_txt);
      const diff = Math.abs(entryTime.diff(targetDateTime));
      const closestDiff = Math.abs(dayjs(closest.dt_txt).diff(targetDateTime));
      return diff < closestDiff ? entry : closest;
    }, forecastList[0]);
  };

  const recommendations = routines.flatMap(({ activity, schedule }) => {
    return schedule.map(({ day, time }) => {
      const dayIndex = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(day.toLowerCase());
      const targetDate = now.day() <= dayIndex
        ? now.weekday(dayIndex)
        : now.add(1, 'week').weekday(dayIndex);

      const fullDateTime = targetDate.hour(Number(time.split(':')[0])).minute(Number(time.split(':')[1]));

      const closestForecast = findClosestForecast(fullDateTime);

      const betterOption = forecastList.find(f =>
        f.weather[0].main !== 'Rain' &&
        f.main.temp > closestForecast.main.temp &&
        dayjs(f.dt_txt).isSameOrBefore(now.add(5, 'day'))
      );

      if (betterOption) {
        const altDate = dayjs(betterOption.dt_txt).format('dddd HH:mm');
        return `🌤️ Para "${activity}" el ${day} a las ${time}, podrías considerar el ${altDate} con ${betterOption.weather[0].description}, ${Math.round(betterOption.main.temp)}°C.`;
      }

      return null;
    });
  }).filter(Boolean);

  return (
    <div>
      <h2>Recomendaciones</h2>
      {recommendations.length > 0 ? (
        <ul>
          {recommendations.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      ) : (
        <p>No hay recomendaciones por ahora.</p>
      )}
    </div>
  );
}

export default WeatherSuggestions;

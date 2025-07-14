const dayOrder = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export const mapDayToIndex = (day) => {
  return dayOrder.indexOf(day.toLowerCase());
};

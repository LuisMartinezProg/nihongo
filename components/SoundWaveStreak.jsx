// Elemento visual distintivo de la app: en vez de un badge genérico de
// racha, la racha semanal se dibuja como una onda de sonido — coherente
// con que esta es una app de escucha y habla.
export default function SoundWaveStreak({ days }) {
  return (
    <div className="waveform" role="img" aria-label="Racha de los últimos 7 días">
      {days.map((d) => (
        <span
          key={d.date}
          className={`waveform__bar ${d.done ? "waveform__bar--active" : ""} ${
            d.isToday ? "waveform__bar--today" : ""
          }`}
        />
      ))}
    </div>
  );
}

import { Home, BarChart3, Settings } from "lucide-react";

const ITEMS = [
  { id: "home", label: "Inicio", Icon: Home },
  { id: "progress", label: "Progreso", Icon: BarChart3 },
  { id: "settings", label: "Ajustes", Icon: Settings },
];

export default function BottomNav({ screen, onNavigate }) {
  return (
    <nav className="bottom-nav">
      {ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`bottom-nav__item ${screen === id ? "is-active" : ""}`}
          onClick={() => onNavigate(id)}
        >
          <Icon size={20} />
          <span className="bottom-nav__label">{label}</span>
        </button>
      ))}
    </nav>
  );
}

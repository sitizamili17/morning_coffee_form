function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) && pw.length >= 8) s++;

  if (!pw) return { label: "Belum ada seduhan", color: "#8a6a55", pct: 0 };
  if (s <= 1) return { label: "Cold Brew · terlalu lemah", color: "#3B82F6", pct: 25 };
  if (s <= 3) return { label: "Warm Coffee · cukup hangat", color: "#EAB308", pct: 60 };
  return { label: "Hot Espresso · sangat kuat", color: "#EF4444", pct: 100 };
}

export default function PasswordThermometer({ password }) {
  const { label, color, pct } = getStrength(password);

  return (
    <div className="thermo" aria-live="polite">
      <div className="tube">
        <div className="mercury" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="bulb" style={{ background: color }} />
      <span style={{ color }}>{label}</span>
    </div>
  );
}
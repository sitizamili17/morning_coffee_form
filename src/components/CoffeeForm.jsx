import { useState } from "react";
import FogGlass from "./FogGlass";
import PasswordThermometer from "./PasswordThermometer";

const REVEAL_AT = 40; // persen kaca yang harus terhapus

const ROASTS = [
  { id: "light", name: "Light Roast", tier: "Free Member" },
  { id: "medium", name: "Medium Roast", tier: "Pro Member" },
  { id: "dark", name: "Dark Roast", tier: "VIP Member" },
];

const INITIAL = { name: "", email: "", password: "", roast: "light", shot: false, oat: false };

export default function CoffeeForm() {
  const [revealed, setRevealed] = useState(false);
  const [form, setForm] = useState(INITIAL);
  const [steam, setSteam] = useState(false);
  const [done, setDone] = useState(false);

  const chosen = ROASTS.find((r) => r.id === form.roast);
  const addons = [form.shot && "Extra Espresso Shot", form.oat && "Oat Milk"].filter(Boolean);

  const set = (key) => (e) =>
    setForm({ ...form, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setSteam(true);
    setTimeout(() => setDone(true), 1100);
    setTimeout(() => setSteam(false), 1600);
  };

  const reset = () => {
    setForm(INITIAL);
    setDone(false);
  };

  return (
    <div className="mc-root">
      <main className={`mc-stage ${revealed ? "on" : ""}`}>
        {done ? (
          <section className="mc-glass mc-done">
            <svg width="84" height="84" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M8 18h26v10a12 12 0 0 1-12 12h-2A12 12 0 0 1 8 28V18Z" fill="#FFF8F0" />
              <path d="M34 20h3a5 5 0 0 1 0 10h-3" fill="none" stroke="#FFF8F0" strokeWidth="3" />
              <path className="wisp w1" d="M13 12c-3-3 3-5 0-8" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              <path className="wisp w2" d="M21 12c-3-3 3-5 0-8" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              <path className="wisp w3" d="M29 12c-3-3 3-5 0-8" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h1>Seduhanmu sudah siap, {form.name || "Sahabat Kopi"}.</h1>
            <p>Konfirmasi dikirim ke {form.email || "emailmu"}.</p>
            <ul className="receipt">
              <li><span>Keanggotaan</span><b>{chosen.tier}</b></li>
              <li><span>Sangrai</span><b>{chosen.name}</b></li>
              <li><span>Tambahan</span><b>{addons.length ? addons.join(", ") : "Tidak ada"}</b></li>
            </ul>
            <button className="brew" type="button" onClick={reset}>
              Daftarkan akun lain
            </button>
          </section>
        ) : (
          <form className="mc-glass" onSubmit={submit}>
            <header>
              <svg width="46" height="46" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M8 18h26v10a12 12 0 0 1-12 12h-2A12 12 0 0 1 8 28V18Z" fill="#FFF8F0" />
                <path d="M34 20h3a5 5 0 0 1 0 10h-3" fill="none" stroke="#FFF8F0" strokeWidth="3" />
                <path className="wisp w1" d="M16 12c-3-3 3-5 0-8" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                <path className="wisp w2" d="M24 12c-3-3 3-5 0-8" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div>
                <h1>Daftar jadi member kafe</h1>
                <p>Isi data singkat ini, lalu kami seduhkan akunmu.</p>
              </div>
            </header>

            <label>
              Nama untuk ditulis di gelas kopi
              <input required value={form.name} onChange={set("name")} placeholder="Contoh: Rani" />
            </label>

            <label>
              Email konfirmasi pesanan &amp; membership
              <input required type="email" value={form.email} onChange={set("email")} placeholder="nama@email.com" />
            </label>

            <label>
              Password
              <input required type="password" value={form.password} onChange={set("password")} placeholder="Minimal 8 karakter" />
            </label>
            <PasswordThermometer password={form.password} />

            <fieldset>
              <legend>Pilih sangrai favoritmu</legend>
              <div className="roasts">
                {ROASTS.map((r) => (
                  <label key={r.id} className={`roast ${form.roast === r.id ? "sel" : ""}`}>
                    <input
                      type="radio"
                      name="roast"
                      checked={form.roast === r.id}
                      onChange={() => setForm({ ...form, roast: r.id })}
                    />
                    <b>{r.name}</b>
                    <small>{r.tier}</small>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>Tambahan</legend>
              <label className="toggle">
                <input type="checkbox" checked={form.shot} onChange={set("shot")} />
                <i /> Extra Espresso Shot
              </label>
              <label className="toggle">
                <input type="checkbox" checked={form.oat} onChange={set("oat")} />
                <i /> Oat Milk Substitute
              </label>
            </fieldset>

            <button className="brew" type="submit">
              {steam && (
                <span className="puffs" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <em key={n} style={{ left: `${15 + n * 17}%`, animationDelay: `${n * 0.12}s` }} />
                  ))}
                </span>
              )}
              Brew &amp; Register My Account
            </button>
          </form>
        )}
      </main>

      <FogGlass revealAt={REVEAL_AT} onReveal={() => setRevealed(true)} />
    </div>
  );
}
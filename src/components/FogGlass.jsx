import { useEffect, useRef, useState } from "react";

export default function FogGlass({ revealAt = 40, onReveal }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const moves = useRef(0);
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);

  // Siapkan kaca berembun
  useEffect(() => {
    const c = canvasRef.current;
    const paint = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      const g = c.getContext("2d");
      g.globalCompositeOperation = "source-over";
      g.fillStyle = "rgba(226,208,190,0.93)";
      g.fillRect(0, 0, c.width, c.height);
      for (let i = 0; i < 90; i++) {
        const x = Math.random() * c.width;
        const y = Math.random() * c.height;
        const r = 40 + Math.random() * 140;
        const gr = g.createRadialGradient(x, y, 0, x, y, r);
        gr.addColorStop(0, "rgba(255,248,240,0.35)");
        gr.addColorStop(1, "rgba(255,248,240,0)");
        g.fillStyle = gr;
        g.fillRect(x - r, y - r, r * 2, r * 2);
      }
    };
    paint();
    window.addEventListener("resize", paint);
    return () => window.removeEventListener("resize", paint);
  }, []);

  // Hitung persen kaca yang sudah bening
  const measure = () => {
    const c = canvasRef.current;
    const { data } = c.getContext("2d").getImageData(0, 0, c.width, c.height);
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 24) {
      total++;
      if (data[i] < 128) clear++;
    }
    const pct = Math.round((clear / total) * 100);
    setProgress(pct);
    if (pct >= revealAt) {
      setRevealed(true);
      onReveal?.();
    }
  };

  const scratch = (e) => {
    if (!drawing.current || revealed) return;
    const g = canvasRef.current.getContext("2d");
    const x = e.clientX;
    const y = e.clientY;
    g.globalCompositeOperation = "destination-out";
    g.lineCap = g.lineJoin = "round";
    g.lineWidth = 80;
    g.beginPath();
    g.moveTo(last.current?.x ?? x, last.current?.y ?? y);
    g.lineTo(x, y);
    g.stroke();
    last.current = { x, y };
    if (++moves.current % 8 === 0) measure();
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`mc-fog ${revealed ? "gone" : ""}`}
        onPointerDown={(e) => {
          drawing.current = true;
          last.current = null;
          e.currentTarget.setPointerCapture(e.pointerId);
          scratch(e);
        }}
        onPointerMove={scratch}
        onPointerUp={() => (drawing.current = false)}
        onPointerCancel={() => (drawing.current = false)}
      />
      {!revealed && (
        <div className="mc-hint">
          Kaca berembun. Usap dengan jari atau mouse.
          <div className="bar">
            <div style={{ width: `${Math.min(100, (progress / revealAt) * 100)}%` }} />
          </div>
        </div>
      )}
    </>
  );
}
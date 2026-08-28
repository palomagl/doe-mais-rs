let ctx: AudioContext | null = null;
let enabled = true;

export function setSoundEnabled(v: boolean) {
  enabled = v;
  if (typeof localStorage !== "undefined") localStorage.setItem("doemais-hero-sound", String(v));
}

export function isSoundEnabled() {
  if (typeof localStorage === "undefined") return enabled;
  const v = localStorage.getItem("doemais-hero-sound");
  return v === null ? enabled : v === "true";
}

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType, gain = 0.06, delay = 0) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + delay);
  g.gain.setValueAtTime(0.0001, c.currentTime + delay);
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + delay + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + delay + duration);
  osc.connect(g).connect(c.destination);
  osc.start(c.currentTime + delay);
  osc.stop(c.currentTime + delay + duration + 0.02);
}

export type SoundName =
  | "collect"
  | "correct"
  | "wrong"
  | "levelup"
  | "achievement"
  | "gameover"
  | "click"
  | "jump"
  | "hit";

export function playSound(name: SoundName) {
  if (!isSoundEnabled()) return;
  switch (name) {
    case "collect":
      tone(880, 0.08, "triangle", 0.05);
      tone(1320, 0.07, "triangle", 0.03, 0.04);
      break;
    case "correct":
      tone(660, 0.1, "sine", 0.06);
      tone(880, 0.12, "sine", 0.06, 0.09);
      tone(1180, 0.16, "sine", 0.05, 0.18);
      break;
    case "wrong":
      tone(220, 0.16, "sawtooth", 0.04);
      tone(160, 0.22, "sawtooth", 0.035, 0.12);
      break;
    case "levelup":
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.16, "triangle", 0.055, i * 0.09));
      break;
    case "achievement":
      [784, 988, 1318].forEach((f, i) => tone(f, 0.2, "sine", 0.05, i * 0.1));
      break;
    case "gameover":
      [440, 349, 262].forEach((f, i) => tone(f, 0.26, "triangle", 0.05, i * 0.16));
      break;
    case "click":
      tone(520, 0.045, "square", 0.025);
      break;
    case "jump":
      tone(420, 0.09, "square", 0.03);
      tone(720, 0.06, "square", 0.02, 0.05);
      break;
    case "hit":
      tone(180, 0.2, "sawtooth", 0.05);
      break;
  }
}

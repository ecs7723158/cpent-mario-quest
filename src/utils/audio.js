// 8-bit Retro Chiptune & Mario Sound Engine (Web Audio API)
let audioCtx = null;
let isMuted = false;

function getAudioContext() {
  if (isMuted) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundMuted(muted) {
  isMuted = muted;
}

export function isSoundMuted() {
  return isMuted;
}

// 🪙 Classic Mario Coin Sound (B5 -> E6)
export function soundCoin() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(987.77, now); // B5
  osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.35);
}

// 🦘 Classic Mario Jump Sound (sweep up)
export function soundJump() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.exponentialRampToValueAtTime(550, now + 0.15);
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.15);
}

// 🍄 Power-Up / Mushroom Sound
export function soundPowerUp() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const notes = [330, 392, 659, 523, 587, 784];
  const now = ctx.currentTime;
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.06;
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.09, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.06);
  });
}

// 🧪 Green Warp Pipe Sound
export function soundPipe() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const freqs = [350, 300, 260, 220, 180, 150];
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.04;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.04);
  });
}

// 🔥 Fireball Shot Sound
export function soundFireball() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);
  gain.gain.setValueAtTime(0.14, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.12);
}

// 👟 Enemy Stomp / Kick Shell
export function soundStomp() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  osc.type = 'square';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

// 🚩 Stage Clear Fanfare (Iconic Super Mario Bros. Level Complete Theme!)
export function soundStageClear() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  // G3, C4, E4, G4, C5, E5, G5, E5
  const melody = [
    { f: 196.00, d: 0.12 }, // G3
    { f: 261.63, d: 0.12 }, // C4
    { f: 329.63, d: 0.12 }, // E4
    { f: 392.00, d: 0.12 }, // G4
    { f: 523.25, d: 0.12 }, // C5
    { f: 659.25, d: 0.12 }, // E5
    { f: 783.99, d: 0.28 }, // G5 (hold)
    { f: 659.25, d: 0.24 }, // E5
    // G#3, C4, D#4, G#4, C5, D#5, G#5, D#5
    { f: 207.65, d: 0.12 }, // G#3
    { f: 261.63, d: 0.12 }, // C4
    { f: 311.13, d: 0.12 }, // D#4
    { f: 415.30, d: 0.12 }, // G#4
    { f: 523.25, d: 0.12 }, // C5
    { f: 622.25, d: 0.12 }, // D#5
    { f: 830.61, d: 0.28 }, // G#5 (hold)
    { f: 622.25, d: 0.24 }, // D#5
    // A#3, D4, F4, A#4, D5, F5, A#5...
    { f: 233.08, d: 0.12 }, // A#3
    { f: 293.66, d: 0.12 }, // D4
    { f: 349.23, d: 0.12 }, // F4
    { f: 466.16, d: 0.12 }, // A#4
    { f: 587.33, d: 0.12 }, // D5
    { f: 698.46, d: 0.12 }, // F5
    { f: 932.33, d: 0.40 }  // A#5 (Victory triumph!)
  ];

  let elapsed = 0;
  melody.forEach(note => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + elapsed;
    osc.type = 'square';
    osc.frequency.setValueAtTime(note.f, start);
    gain.gain.setValueAtTime(0.12, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + note.d);
    elapsed += note.d * 0.95;
  });
}

// ☠️ Lose Life / Damage
export function soundDamage() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.linearRampToValueAtTime(100, now + 0.25);
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.25);
}

// 🚨 Alarm Sound
export function soundAlarm() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(580, now);
  osc.frequency.linearRampToValueAtTime(880, now + 0.12);
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.15);
}

export function soundClick() {
  soundJump();
}

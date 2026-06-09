let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

function burstNoise(
  ctx: AudioContext,
  t: number,
  {
    freq,
    q,
    gainPeak,
    decay,
  }: { freq: number; q: number; gainPeak: number; decay: number },
) {
  const len = Math.floor(ctx.sampleRate * decay);
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.12));
  }

  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = freq;
  bp.Q.value = q;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainPeak, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);

  src.connect(bp).connect(gain).connect(ctx.destination);
  src.start(t);
  src.stop(t + decay + 0.01);
}

function metallicPing(ctx: AudioContext, t: number, freq: number, vol: number) {
  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.4, t + 0.025);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.04);
}

/** Light ratchet tick when crossing a detent during coast */
export function playDetentTick() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  burstNoise(ctx, t, { freq: 3400, q: 10, gainPeak: 0.1, decay: 0.022 });
  metallicPing(ctx, t + 0.002, 2100, 0.04);
}

/** Pre-lock rumble as gear teeth align just before stopping */
export function playGearEngage() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(90, t);
  osc.frequency.exponentialRampToValueAtTime(55, t + 0.09);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.06, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

  burstNoise(ctx, t, { freq: 900, q: 4, gainPeak: 0.08, decay: 0.06 });
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.12);
}

/** Final mechanical lock-in clunk */
export function playGearLock() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;

  const thud = ctx.createOscillator();
  thud.type = 'triangle';
  thud.frequency.setValueAtTime(140, t);
  thud.frequency.exponentialRampToValueAtTime(38, t + 0.1);

  const thudGain = ctx.createGain();
  thudGain.gain.setValueAtTime(0.42, t);
  thudGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

  burstNoise(ctx, t, { freq: 1800, q: 8, gainPeak: 0.28, decay: 0.04 });
  burstNoise(ctx, t + 0.006, { freq: 480, q: 3.5, gainPeak: 0.18, decay: 0.06 });
  metallicPing(ctx, t + 0.01, 620, 0.09);
  metallicPing(ctx, t + 0.022, 1100, 0.05);

  thud.connect(thudGain).connect(ctx.destination);
  thud.start(t);
  thud.stop(t + 0.16);
}

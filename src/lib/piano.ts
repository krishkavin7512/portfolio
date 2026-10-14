"use client";

/*
 * A tiny piano synth on the Web Audio API: no samples, just a few detuned partials with a
 * hammer click, a closing low-pass and a short generated reverb. Browsers only allow audio
 * after a click or key press, so callers unlock() from inside such a handler first.
 */

let ctx: AudioContext | null = null;
let out: GainNode | null = null;

function impulse(c: AudioContext, seconds: number) {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
  }
  return buf;
}

function setup() {
  if (ctx) return ctx;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new Ctor();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 3;
  out = ctx.createGain();
  out.gain.value = 0.55;
  const dry = ctx.createGain();
  dry.gain.value = 1;
  const wet = ctx.createGain();
  wet.gain.value = 0.22;
  const verb = ctx.createConvolver();
  verb.buffer = impulse(ctx, 2.2);
  out.connect(dry).connect(comp);
  out.connect(verb).connect(wet).connect(comp);
  comp.connect(ctx.destination);
  return ctx;
}

export function audioReady() {
  return ctx?.state === "running";
}

/** Call from a click / keydown handler. Resolves true once sound can play. */
export async function unlock() {
  const c = setup();
  if (c.state !== "running") await c.resume().catch(() => undefined);
  return c.state === "running";
}

const NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function frequency(note: string) {
  const m = note.match(/^([A-G]#?)(\d)$/);
  if (!m) return 440;
  const midi = NAMES.indexOf(m[1]) + (Number(m[2]) + 1) * 12;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function play(note: string, velocity = 0.8) {
  if (!ctx || !out || ctx.state !== "running") return;
  const c = ctx;
  const t = c.currentTime;
  const f = frequency(note);
  const tail = 2.4;

  const voice = c.createGain();
  voice.gain.setValueAtTime(0, t);
  voice.gain.linearRampToValueAtTime(0.42 * velocity, t + 0.004);
  voice.gain.exponentialRampToValueAtTime(0.14 * velocity, t + 0.35);
  voice.gain.exponentialRampToValueAtTime(0.0001, t + tail);

  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.Q.value = 0.6;
  lp.frequency.setValueAtTime(Math.min(f * 9, 12000), t);
  lp.frequency.exponentialRampToValueAtTime(Math.max(f * 2.5, 400), t + 1.2);
  lp.connect(voice).connect(out);

  // partials: fundamental (slightly detuned pair), octave, twelfth
  const partials: [OscillatorType, number, number, number][] = [
    ["triangle", 1, 0.55, 0],
    ["triangle", 1, 0.35, 5],
    ["sine", 2, 0.22, -3],
    ["sine", 3, 0.07, 2],
  ];
  for (const [type, mult, gain, cents] of partials) {
    const o = c.createOscillator();
    o.type = type;
    o.frequency.value = f * mult;
    o.detune.value = cents;
    const g = c.createGain();
    g.gain.value = gain;
    o.connect(g).connect(lp);
    o.start(t);
    o.stop(t + tail);
  }

  // hammer: a 25 ms burst of filtered noise
  const len = Math.floor(c.sampleRate * 0.025);
  const nb = c.createBuffer(1, len, c.sampleRate);
  const nd = nb.getChannelData(0);
  for (let i = 0; i < len; i++) nd[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const noise = c.createBufferSource();
  noise.buffer = nb;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = Math.min(f * 6, 6000);
  const ng = c.createGain();
  ng.gain.value = 0.05 * velocity;
  noise.connect(bp).connect(ng).connect(out);
  noise.start(t);
}

/**
 * SHERO Procedural Audio Engine (Web Audio API)
 * Implements melodious anime-style ambient music, soft piano arpeggio loops,
 * city soundscapes, footsteps, and interaction cues.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private pianoLoopInterval: number | null = null;

  constructor() {
    const savedMute = localStorage.getItem('shero_sound_muted');
    this.isMuted = savedMute === 'true';
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('shero_sound_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.startAmbientBGM();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Plays a single gentle piano tone with harmonic decay
   */
  public playPianoNote(freq: number, duration: number = 2.0, volume: number = 0.04) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;
      // Fundamental oscillator
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Gentle piano envelope
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio policy safe
    }
  }

  /**
   * Continuous gentle anime piano melody loop & ambient synthesizer pad
   */
  public startAmbientBGM() {
    if (this.isMuted || this.isBgmPlaying) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.bgmGain) return;
      this.isBgmPlaying = true;

      // Soft Pentatonic / Lofi Anime chords sequence (Am9 - Fmaj7 - C - G)
      const pianoChords = [
        [220.0, 261.63, 329.63, 392.0],  // Am7 (A3, C4, E4, G4)
        [174.61, 261.63, 329.63, 392.0], // Fmaj7 (F3, C4, E4, G4)
        [261.63, 329.63, 392.0, 523.25], // C (C4, E4, G4, C5)
        [196.0, 246.94, 293.66, 392.0]   // G (G3, B3, D4, G4)
      ];

      let chordIdx = 0;
      let arpeggioIdx = 0;

      const triggerArpeggio = () => {
        if (!this.isBgmPlaying || this.isMuted || !this.ctx) return;
        const currentChord = pianoChords[chordIdx % pianoChords.length];
        const noteFreq = currentChord[arpeggioIdx % currentChord.length];

        this.playPianoNote(noteFreq, 2.2, 0.025);

        arpeggioIdx++;
        if (arpeggioIdx >= currentChord.length) {
          arpeggioIdx = 0;
          chordIdx++;
        }
      };

      triggerArpeggio();
      this.pianoLoopInterval = window.setInterval(triggerArpeggio, 650);
    } catch {
      // Audio policy safe
    }
  }

  public stopBGM() {
    if (this.pianoLoopInterval !== null) {
      clearInterval(this.pianoLoopInterval);
      this.pianoLoopInterval = null;
    }
    this.isBgmPlaying = false;
  }

  // Button hover sound (delicate glassy tick)
  public playHover() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(560, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {}
  }

  // Button click / confirmation sound
  public playSelect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(960, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }

  // Interaction cue (e.g. approaching an NPC or inspecting route board)
  public playInteractPrompt() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;
      [659.25, 880.0].forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.05, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.15);
      });
    } catch {}
  }

  // Footstep sound for player movement
  public playFootstep() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {}
  }

  // Correct choice fanfare
  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.09, this.ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(this.ctx.currentTime + idx * 0.07);
        osc.stop(this.ctx.currentTime + idx * 0.07 + 0.25);
      });
    } catch {}
  }

  // Incorrect choice chord
  public playIncorrect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const notes = [311.13, 293.66, 277.18, 196.0]; // Eb4, D4, Db4, G3
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.07, this.ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + idx * 0.1 + 0.35);
      });
    } catch {}
  }

  // Victory fanfare
  public playVictory() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const melody = [
        { f: 440, t: 0.12 },
        { f: 554.37, t: 0.12 },
        { f: 659.25, t: 0.12 },
        { f: 880, t: 0.35 }
      ];
      let offset = 0;
      melody.forEach(note => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, this.ctx.currentTime + offset);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + offset + note.t);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(this.ctx.currentTime + offset);
        osc.stop(this.ctx.currentTime + offset + note.t);
        offset += note.t;
      });
    } catch {}
  }
}

export const soundCtrl = new SoundController();

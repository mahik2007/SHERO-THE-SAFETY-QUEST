class SpeechManager {
  private isVoiceEnabled: boolean = true;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      const saved = localStorage.getItem('shero_voice_enabled');
      this.isVoiceEnabled = saved !== 'false';
    } else {
      this.isVoiceEnabled = false;
    }
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public getVoiceEnabled(): boolean {
    return this.isVoiceEnabled && this.isSupported();
  }

  public toggleVoice(): boolean {
    this.isVoiceEnabled = !this.isVoiceEnabled;
    localStorage.setItem('shero_voice_enabled', String(this.isVoiceEnabled));
    if (!this.isVoiceEnabled && this.synth) {
      this.synth.cancel();
    }
    return this.isVoiceEnabled;
  }

  public speak(text: string, rate: number = 1.0, pitch: number = 1.1) {
    if (!this.getVoiceEnabled() || !this.synth) return;

    try {
      this.synth.cancel(); // Stop any pending speech
      const cleanText = text.replace(/[*_#"`]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = rate;
      utterance.pitch = pitch;

      // Select female or natural voice if available
      const voices = this.synth.getVoices();
      const femaleVoice = voices.find(
        v => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira'))
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('[SHERO Speech] TTS synthesis failed:', e);
    }
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
    }
  }
}

export const speechCtrl = new SpeechManager();

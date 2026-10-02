// Browser Web Speech API fallback for local development & resilient voice interaction
export class BrowserVoiceEngine {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;
  private isSpeaking = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
      this.synthesis = window.speechSynthesis || null;
    }
  }

  public isSupported(): boolean {
    return !!(this.recognition || this.synthesis);
  }

  public speak(
    text: string, 
    onStart?: () => void, 
    onEnd?: () => void, 
    onError?: (err: any) => void
  ): void {
    if (!this.synthesis) {
      onEnd?.();
      return;
    }

    this.synthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      this.isSpeaking = true;
      onStart?.();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      onError?.(e);
      onEnd?.();
    };

    this.synthesis.speak(utterance);
  }

  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: any) => void
  ): void {
    if (!this.recognition) {
      onError?.(new Error('Speech Recognition not supported in this browser.'));
      return;
    }

    if (this.isListening) return;

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = (finalTranscript || interimTranscript).trim();
      if (text) {
        onResult(text, !!finalTranscript);
      }
    };

    this.recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech') {
        onError?.(event);
      }
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        try {
          this.recognition.start();
        } catch {
          // ignore auto-restart errors
        }
      }
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (err) {
      onError?.(err);
    }
  }

  public stopListening(): void {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
  }

  public stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public stopAll(): void {
    this.stopListening();
    this.stopSpeaking();
  }
}

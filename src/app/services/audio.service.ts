import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioService {

  private audioCtx: AudioContext | null = null;

  playBeep(): void {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }
}

import { Injectable } from '@angular/core';
import { SolitaireDifficulty } from '../../models/game/solitaire-board';
import { Card } from '../../models/game/card';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioVolume: number;
  private audioMuted: boolean;

  private buttonSound: HTMLAudioElement;
  private dragStartSound: HTMLAudioElement;
  private dragStopSound: HTMLAudioElement;
  private drawThreeSound: HTMLAudioElement;
  private errorSound: HTMLAudioElement;
  private flipUpSound: HTMLAudioElement;
  private levelCompleteSound: HTMLAudioElement;
  private notificationSound: HTMLAudioElement;
  private undoSound: HTMLAudioElement;


  constructor() {
    this.audioVolume = 1.0;
    this.audioMuted = false;

    this.buttonSound = new Audio("/assets/sounds/button.mp3");
    this.dragStartSound = new Audio("/assets/sounds/dragStart.wav");
    this.dragStopSound = new Audio("/assets/sounds/dragStop.wav");
    this.drawThreeSound = new Audio("/assets/sounds/drawThree.wav");
    this.errorSound = new Audio("/assets/sounds/error.mp3");
    this.flipUpSound = new Audio("/assets/sounds/flipUp.wav");
    this.levelCompleteSound = new Audio("/assets/sounds/level-complete.wav");
    this.notificationSound = new Audio("/assets/sounds/notification.mp3");
    this.undoSound = new Audio("/assets/sounds/undo.wav");
  }

  public toggleMute(): boolean {
    return this.audioMuted = !this.audioMuted;
  }

  public changeVolume(vol: number): void {
    this.audioVolume = vol;
  }

  private prepareSound(soundElement: HTMLAudioElement): void {
    soundElement.volume = this.audioVolume;
    soundElement.muted = this.audioMuted;
  }

  public play_buttonSound(): void {
    this.prepareSound(this.buttonSound);
    this.buttonSound.play();
  }

  public play_dragStartSound(): void {
    this.prepareSound(this.dragStartSound);
    this.dragStartSound.play();
  }

  public play_dragStopSound(): void {
    this.prepareSound(this.dragStopSound);
    this.dragStopSound.play();
  }

  public play_drawCardsSound(difficulty: SolitaireDifficulty, deck: Card[]): void {
    if (deck.length > 1 && difficulty === SolitaireDifficulty.Hard) {
      this.prepareSound(this.drawThreeSound);
      this.drawThreeSound.play();
      return;
    }

    this.prepareSound(this.flipUpSound);
    this.flipUpSound.play();
  }

  public play_errorSound(): void {
    this.prepareSound(this.errorSound);
    this.errorSound.play();
  }

  public play_flipUpSound(): void {
    this.prepareSound(this.flipUpSound);
    this.flipUpSound.play();
  }

  public play_levelCompleteSound(): void {
    this.prepareSound(this.levelCompleteSound);
    this.levelCompleteSound.play();
  }

  public play_notificationSound(): void {
    this.prepareSound(this.notificationSound);
    this.notificationSound.play();
  }

  public play_undoSound(): void {
    this.prepareSound(this.undoSound);
    this.undoSound.play();
  }
}

import { Injectable } from '@angular/core';
import { SolitaireBoard, SolitaireDifficulty } from '../../models/game/solitaire-board';
import { Card } from '../../models/game/card';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private volume: number;
  private muted: boolean;

  private sound_cardDropSucessful: HTMLAudioElement;
  private sound_cardDropUnsuccessful: HTMLAudioElement;
  private sound_cardFlipUp: HTMLAudioElement;
  private sound_cardPickUp: HTMLAudioElement;

  private sound_deckDraw3: HTMLAudioElement;
  private sound_deckRewind: HTMLAudioElement;
  
  private sound_levelComplete: HTMLAudioElement;
  
  private sound_button: HTMLAudioElement;
  private sound_notification: HTMLAudioElement;
  private sound_popUp: HTMLAudioElement;
  private sound_undo: HTMLAudioElement;
  private sound_error: HTMLAudioElement;


  constructor() {
    this.volume = 1.0;
    this.muted = false;

    this.sound_cardDropSucessful = new Audio("/assets/sounds/card-drop-successful.wav");
    this.sound_cardDropUnsuccessful = new Audio("/assets/sounds/card-drop-unsuccessful.wav");
    this.sound_cardFlipUp = new Audio("/assets/sounds/card-flip-up.wav");
    this.sound_cardPickUp = new Audio("/assets/sounds/card-pickup.wav");
  
    this.sound_deckDraw3 = new Audio("/assets/sounds/deck-draw-3.wav");
    this.sound_deckRewind = new Audio("/assets/sounds/deck-rewind.wav");
    
    this.sound_levelComplete = new Audio("/assets/sounds/level-complete.wav");
    
    this.sound_button = new Audio("/assets/sounds/button.wav");
    this.sound_notification = new Audio("/assets/sounds/notification.wav");
    this.sound_popUp = new Audio("/assets/sounds/popup.wav");
    this.sound_undo = new Audio("/assets/sounds/undo.wav");
    this.sound_error = new Audio("/assets/sounds/error.wav");
  }

  public toggleMute(): boolean {
    return this.muted = !this.muted;
  }

  public changeVolume(vol: number): void {
    this.volume = vol;
  }

  private prepareSound(soundElement: HTMLAudioElement): void {
    soundElement.volume = this.volume;
    soundElement.muted = this.muted;
  }

  public play_cardDropSuccessful(): void {
    this.prepareSound(this.sound_cardDropSucessful);
    this.sound_cardDropSucessful.play();
  }

  public play_cardDropUnsuccessful(): void {
    this.prepareSound(this.sound_cardDropUnsuccessful);
    this.sound_cardDropUnsuccessful.play();
  }

  public play_cardFlipUp(): void {
    this.prepareSound(this.sound_cardFlipUp);
    this.sound_cardFlipUp.play();
  }

  public play_cardPickUp(): void {
    this.prepareSound(this.sound_cardPickUp);
    this.sound_cardPickUp.play();
  }

  public play_deckDraw(board: SolitaireBoard): void {
    if (board.deckStock.length > 1) {
      this.prepareSound(this.sound_deckDraw3);
      this.sound_deckDraw3.play();
      return;
    }

    if (board.deckStock.length === 1) {
      this.prepareSound(this.sound_cardFlipUp);
      this.sound_cardFlipUp.play();
      return;
    }

    if (board.deckStock.length === 0 && board.deckWaste.length > 0) {
      this.prepareSound(this.sound_deckRewind);
      this.sound_deckRewind.play();
      return;
    }
  }

  public play_deckRewind(): void {
    this.prepareSound(this.sound_deckRewind);
    this.sound_deckRewind.play();
  }
  
  public play_levelComplete(): void {
    this.prepareSound(this.sound_levelComplete);
    this.sound_levelComplete.play();
  }

  public play_buttonPress(): void {
    this.prepareSound(this.sound_button);
    this.sound_button.play();
  }
  
  public play_notification(): void {
    this.prepareSound(this.sound_notification);
    this.sound_notification.play();
  }
  
  public play_popUp(): void {
    this.prepareSound(this.sound_popUp);
    this.sound_popUp.play();
  }
  
  public play_undo(): void {
    this.prepareSound(this.sound_undo);
    this.sound_undo.play();
  }
  
  public play_error(): void {
    this.prepareSound(this.sound_error);
    this.sound_error.play();
  }
}

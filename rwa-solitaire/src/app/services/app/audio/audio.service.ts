import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { Store } from '@ngrx/store'

import { SolitaireDifficulty } from '../../../models/solitaire/solitaire-difficulty';
import { SolitaireBoard } from '../../../models/solitaire/solitaire-board';
import { selectAudioMuted, selectAudioVolume } from '../../../store/selectors/audio.selectors';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  #sound_cardDropSucessful = new Audio("/sounds/card-drop-successful.wav");
  #sound_cardDropUnsuccessful = new Audio("/sounds/card-drop-unsuccessful.wav");
  #sound_cardFlipUp = new Audio("/sounds/card-flip-up.wav");
  #sound_cardPickUp = new Audio("/sounds/card-pickup.wav");
  #sound_deckDraw3 = new Audio("/sounds/deck-draw-3.wav");
  #sound_deckRewind = new Audio("/sounds/deck-rewind.wav");
  #sound_levelComplete = new Audio("/sounds/level-complete.wav");
  #sound_button = new Audio("/sounds/button.wav");
  #sound_notification = new Audio("/sounds/notification.wav");
  #sound_popUp = new Audio("/sounds/popup.wav");
  #sound_undo = new Audio("/sounds/undo.wav");
  #sound_error = new Audio("/sounds/error.wav");

  constructor(private store: Store) {  
    this.#initializeSubscriptions();
  }

  #initializeSubscriptions() {
    combineLatest([
      this.store.select(selectAudioVolume),
      this.store.select(selectAudioMuted),
    ]).pipe(
      takeUntilDestroyed()
    ).subscribe(([volume, muted]) => {
      this.#prepareSound(volume, muted);
    });
  }

  #prepareSound(volume: number, muted: boolean) {
    this.#sound_cardDropSucessful.muted = muted;
    this.#sound_cardDropUnsuccessful.muted = muted;
    this.#sound_cardFlipUp.muted = muted;
    this.#sound_cardPickUp.muted = muted;
    this.#sound_deckDraw3.muted = muted;
    this.#sound_deckRewind.muted = muted;
    this.#sound_levelComplete.muted = muted;
    this.#sound_button.muted = muted;
    this.#sound_notification.muted = muted;
    this.#sound_popUp.muted = muted;
    this.#sound_undo.muted = muted;
    this.#sound_error.muted = muted;

    this.#sound_cardDropSucessful.volume = volume;
    this.#sound_cardDropUnsuccessful.volume = volume;
    this.#sound_cardFlipUp.volume = volume;
    this.#sound_cardPickUp.volume = volume;
    this.#sound_deckDraw3.volume = volume;
    this.#sound_deckRewind.volume = volume;
    this.#sound_levelComplete.volume = volume;
    this.#sound_button.volume = volume;
    this.#sound_notification.volume = volume;
    this.#sound_popUp.volume = volume;
    this.#sound_undo.volume = volume;
    this.#sound_error.volume = volume;
  }

  play_cardDropSuccessful(): void {
    this.#sound_cardDropSucessful.play();
  }

  play_cardDropUnsuccessful(): void {
    this.#sound_cardDropUnsuccessful.play();
  }

  play_cardFlipUp(): void {
    this.#sound_cardFlipUp.play();
  }

  play_cardPickUp(): void {
    this.#sound_cardPickUp.play();
  }

  public play_deckDraw(board: SolitaireBoard, difficulty: SolitaireDifficulty): void {
    const soundToPlay = 
      (board.deckStock.length === 0 && board.deckWaste.length > 0) ? this.#sound_deckRewind :
      (difficulty === SolitaireDifficulty.Easy || board.deckStock.length === 1) ? this.#sound_cardFlipUp :
      (difficulty === SolitaireDifficulty.Hard && board.deckStock.length > 1) ? this.#sound_deckDraw3 :
      null;

    if (soundToPlay) {
      soundToPlay.play();
    }
  }

  play_deckRewind(): void {
    this.#sound_deckRewind.play();
  }
  
  play_levelComplete(): void {
    this.#sound_levelComplete.play();
  }

  play_buttonPress(): void {
    this.#sound_button.play();
  }
  
  play_notification(): void {
    this.#sound_notification.play();
  }
  
  play_popUp(): void {
    this.#sound_popUp.play();
  }
  
  play_undo(): void {
    this.#sound_undo.play();
  }
  
  play_error(): void {
    this.#sound_error.play();
  }
}
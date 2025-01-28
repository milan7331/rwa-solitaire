import { Injectable, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store'

import { SolitaireDifficulty } from '../../models/solitaire/solitaire-difficulty';
import { SolitaireBoard } from '../../models/solitaire/solitaire-board';
import { selectAudioMuted, selectAudioVolume } from '../../store/selectors/audio.selectors';

@Injectable({
  providedIn: 'root'
})
export class AudioService implements OnDestroy {
  #destroy$ = new Subject<void>();

  #volume: number = 0.8;
  #muted: boolean = false;

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
    this.#initialize();
  }

  #initialize() {
    this.store.select(selectAudioVolume)
    .pipe(takeUntil(this.#destroy$))
    .subscribe((volume) => {
      this.#volume = volume;
      this.#prepareSound();
    });

  this.store.select(selectAudioMuted)
    .pipe(takeUntil(this.#destroy$))
    .subscribe((muted) => {
      this.#muted = muted;
      this.#prepareSound();
    });
  }
  
  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }

  #prepareSound() {
    this.#sound_cardDropSucessful.muted = this.#muted;
    this.#sound_cardDropUnsuccessful.muted = this.#muted;
    this.#sound_cardFlipUp.muted = this.#muted;
    this.#sound_cardPickUp.muted = this.#muted;
    this.#sound_deckDraw3.muted = this.#muted;
    this.#sound_deckRewind.muted = this.#muted;
    this.#sound_levelComplete.muted = this.#muted;
    this.#sound_button.muted = this.#muted;
    this.#sound_notification.muted = this.#muted;
    this.#sound_popUp.muted = this.#muted;
    this.#sound_undo.muted = this.#muted;
    this.#sound_error.muted = this.#muted;

    this.#sound_cardDropSucessful.volume = this.#volume;
    this.#sound_cardDropUnsuccessful.volume = this.#volume;
    this.#sound_cardFlipUp.volume = this.#volume;
    this.#sound_cardPickUp.volume = this.#volume;
    this.#sound_deckDraw3.volume = this.#volume;
    this.#sound_deckRewind.volume = this.#volume;
    this.#sound_levelComplete.volume = this.#volume;
    this.#sound_button.volume = this.#volume;
    this.#sound_notification.volume = this.#volume;
    this.#sound_popUp.volume = this.#volume;
    this.#sound_undo.volume = this.#volume;
    this.#sound_error.volume = this.#volume;
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

  public play_deckDraw(board: SolitaireBoard): void {
    const soundToPlay = 
      (board.deckStock.length === 0 && board.deckWaste.length > 0) ? this.#sound_deckRewind :
      (board.difficulty === SolitaireDifficulty.Easy || board.deckStock.length === 1) ? this.#sound_cardFlipUp :
      (board.difficulty === SolitaireDifficulty.Hard && board.deckStock.length > 1) ? this.#sound_deckDraw3 :
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
import { Store } from '@ngrx/store';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { selectAppVolume, selectAppMuted } from '../../store/selectors/audio.selectors';
import { SolitaireBoard, SolitaireDifficulty } from '../../models/game/solitaire-board';

@Injectable({
  providedIn: 'root'
})
export class AudioService implements OnDestroy {
  #destroy$ = new Subject<void>();

  #volume: number = 0.8;
  #muted: boolean = false;

  #sound_cardDropSucessful: HTMLAudioElement;
  #sound_cardDropUnsuccessful: HTMLAudioElement;
  #sound_cardFlipUp: HTMLAudioElement;
  #sound_cardPickUp: HTMLAudioElement;
  #sound_deckDraw3: HTMLAudioElement;
  #sound_deckRewind: HTMLAudioElement;
  #sound_levelComplete: HTMLAudioElement;
  #sound_button: HTMLAudioElement;
  #sound_notification: HTMLAudioElement;
  #sound_popUp: HTMLAudioElement;
  #sound_undo: HTMLAudioElement;
  #sound_error: HTMLAudioElement;
  
  constructor(private store: Store) {
    this.store.select(selectAppVolume)
      .pipe(takeUntil(this.#destroy$))
      .subscribe((volume) => this.#volume = volume);

    this.store.select(selectAppMuted)
      .pipe(takeUntil(this.#destroy$))
      .subscribe((muted) => this.#muted = muted);

    this.#sound_cardDropSucessful = new Audio("/assets/sounds/card-drop-successful.wav");
    this.#sound_cardDropUnsuccessful = new Audio("/assets/sounds/card-drop-unsuccessful.wav");
    this.#sound_cardFlipUp = new Audio("/assets/sounds/card-flip-up.wav");
    this.#sound_cardPickUp = new Audio("/assets/sounds/card-pickup.wav");
    this.#sound_deckDraw3 = new Audio("/assets/sounds/deck-draw-3.wav");
    this.#sound_deckRewind = new Audio("/assets/sounds/deck-rewind.wav");
    this.#sound_levelComplete = new Audio("/assets/sounds/level-complete.wav");
    this.#sound_button = new Audio("/assets/sounds/button.wav");
    this.#sound_notification = new Audio("/assets/sounds/notification.wav");
    this.#sound_popUp = new Audio("/assets/sounds/popup.wav");
    this.#sound_undo = new Audio("/assets/sounds/undo.wav");
    this.#sound_error = new Audio("/assets/sounds/error.wav");
  }

  ngOnDestroy() {
    this.#destroy$.next();
    this.#destroy$.complete();
  }

  private prepareSound(soundElement: HTMLAudioElement): void {
    soundElement.volume = this.#volume;
    soundElement.muted = this.#muted;
  }

  public play_cardDropSuccessful(): void {
    this.prepareSound(this.#sound_cardDropSucessful);
    this.#sound_cardDropSucessful.play();
  }

  public play_cardDropUnsuccessful(): void {
    this.prepareSound(this.#sound_cardDropUnsuccessful);
    this.#sound_cardDropUnsuccessful.play();
  }

  public play_cardFlipUp(): void {
    this.prepareSound(this.#sound_cardFlipUp);
    this.#sound_cardFlipUp.play();
  }

  public play_cardPickUp(): void {
    this.prepareSound(this.#sound_cardPickUp);
    this.#sound_cardPickUp.play();
  }

  public play_deckDraw(board: SolitaireBoard): void {

    if (board.deckStock.length === 0 && board.deckWaste.length > 0) {
      this.prepareSound(this.#sound_deckRewind);
      this.#sound_deckRewind.play();
      return;
    }

    if (board.difficulty === SolitaireDifficulty.Easy || board.deckStock.length === 1) {
      this.prepareSound(this.#sound_cardFlipUp);
      this.#sound_cardFlipUp.play();
      return;
    }

    if (board.difficulty === SolitaireDifficulty.Hard && board.deckStock.length > 1) {
      this.prepareSound(this.#sound_deckDraw3);
      this.#sound_deckDraw3.play();
      return;
    }
  }

  public play_deckRewind(): void {
    this.prepareSound(this.#sound_deckRewind);
    this.#sound_deckRewind.play();
  }
  
  public play_levelComplete(): void {
    this.prepareSound(this.#sound_levelComplete);
    this.#sound_levelComplete.play();
  }

  public play_buttonPress(): void {
    this.prepareSound(this.#sound_button);
    this.#sound_button.play();
  }
  
  public play_notification(): void {
    this.prepareSound(this.#sound_notification);
    this.#sound_notification.play();
  }
  
  public play_popUp(): void {
    this.prepareSound(this.#sound_popUp);
    this.#sound_popUp.play();
  }
  
  public play_undo(): void {
    this.prepareSound(this.#sound_undo);
    this.#sound_undo.play();
  }
  
  public play_error(): void {
    this.prepareSound(this.#sound_error);
    this.#sound_error.play();
  }
}

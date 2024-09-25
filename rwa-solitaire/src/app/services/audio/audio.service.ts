import { Store } from '@ngrx/store';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { selectAppVolume, selectAppMuted } from '../../store/selectors/audio.selectors';
import { SolitaireBoard, SolitaireDifficulty } from '../../models/game/solitaire-board';

@Injectable({
  providedIn: 'root'
})
export class AudioService implements OnDestroy {
  private _store: Store;
  private _destroy$ = new Subject<void>();

  private _volume: number = 0.8;
  private _muted: boolean = false;

  private _sound_cardDropSucessful: HTMLAudioElement;
  private _sound_cardDropUnsuccessful: HTMLAudioElement;
  private _sound_cardFlipUp: HTMLAudioElement;
  private _sound_cardPickUp: HTMLAudioElement;
  private _sound_deckDraw3: HTMLAudioElement;
  private _sound_deckRewind: HTMLAudioElement;
  private _sound_levelComplete: HTMLAudioElement;
  private _sound_button: HTMLAudioElement;
  private _sound_notification: HTMLAudioElement;
  private _sound_popUp: HTMLAudioElement;
  private _sound_undo: HTMLAudioElement;
  private _sound_error: HTMLAudioElement;

  constructor(store: Store) {
    this._store = store;
    this._store.select(selectAppVolume)
      .pipe(takeUntil(this._destroy$))
      .subscribe((volume) => this._volume = volume);

    this._store.select(selectAppMuted)
      .pipe(takeUntil(this._destroy$))
      .subscribe((muted) => this._muted = muted);

    this._sound_cardDropSucessful = new Audio("/assets/sounds/card-drop-successful.wav");
    this._sound_cardDropUnsuccessful = new Audio("/assets/sounds/card-drop-unsuccessful.wav");
    this._sound_cardFlipUp = new Audio("/assets/sounds/card-flip-up.wav");
    this._sound_cardPickUp = new Audio("/assets/sounds/card-pickup.wav");
    this._sound_deckDraw3 = new Audio("/assets/sounds/deck-draw-3.wav");
    this._sound_deckRewind = new Audio("/assets/sounds/deck-rewind.wav");
    this._sound_levelComplete = new Audio("/assets/sounds/level-complete.wav");
    this._sound_button = new Audio("/assets/sounds/button.wav");
    this._sound_notification = new Audio("/assets/sounds/notification.wav");
    this._sound_popUp = new Audio("/assets/sounds/popup.wav");
    this._sound_undo = new Audio("/assets/sounds/undo.wav");
    this._sound_error = new Audio("/assets/sounds/error.wav");
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private prepareSound(soundElement: HTMLAudioElement): void {
    soundElement.volume = this._volume;
    soundElement.muted = this._muted;
  }

  public play_cardDropSuccessful(): void {
    this.prepareSound(this._sound_cardDropSucessful);
    this._sound_cardDropSucessful.play();
  }

  public play_cardDropUnsuccessful(): void {
    this.prepareSound(this._sound_cardDropUnsuccessful);
    this._sound_cardDropUnsuccessful.play();
  }

  public play_cardFlipUp(): void {
    this.prepareSound(this._sound_cardFlipUp);
    this._sound_cardFlipUp.play();
  }

  public play_cardPickUp(): void {
    this.prepareSound(this._sound_cardPickUp);
    this._sound_cardPickUp.play();
  }

  public play_deckDraw(board: SolitaireBoard): void {

    if (board.deckStock.length === 0 && board.deckWaste.length > 0) {
      this.prepareSound(this._sound_deckRewind);
      this._sound_deckRewind.play();
      return;
    }

    if (board.difficulty === SolitaireDifficulty.Easy || board.deckStock.length === 1) {
      this.prepareSound(this._sound_cardFlipUp);
      this._sound_cardFlipUp.play();
      return;
    }

    if (board.difficulty === SolitaireDifficulty.Hard && board.deckStock.length > 1) {
      this.prepareSound(this._sound_deckDraw3);
      this._sound_deckDraw3.play();
      return;
    }
  }

  public play_deckRewind(): void {
    this.prepareSound(this._sound_deckRewind);
    this._sound_deckRewind.play();
  }
  
  public play_levelComplete(): void {
    this.prepareSound(this._sound_levelComplete);
    this._sound_levelComplete.play();
  }

  public play_buttonPress(): void {
    this.prepareSound(this._sound_button);
    this._sound_button.play();
  }
  
  public play_notification(): void {
    this.prepareSound(this._sound_notification);
    this._sound_notification.play();
  }
  
  public play_popUp(): void {
    this.prepareSound(this._sound_popUp);
    this._sound_popUp.play();
  }
  
  public play_undo(): void {
    this.prepareSound(this._sound_undo);
    this._sound_undo.play();
  }
  
  public play_error(): void {
    this.prepareSound(this._sound_error);
    this._sound_error.play();
  }
}

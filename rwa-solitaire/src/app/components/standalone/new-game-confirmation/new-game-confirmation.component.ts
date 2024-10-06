import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AudioService } from '../../../services/audio/audio.service';

@Component({
  selector: 'app-new-game-confirmation',
  templateUrl: './new-game-confirmation.component.html',
  styleUrl: './new-game-confirmation.component.scss'
})
export class NewGameConfirmationComponent {
  @Input() visible: boolean = false;
  @Input() diffChange: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() newGame: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private audio: AudioService) {}

  visibilityChanged(): void {
    this.visibleChange.emit(this.visible);
  }

  startNewGame(): void {
    this.audio.play_buttonPress();
    this.visible = false;
    this.visibilityChanged();
    this.newGame.emit(true);
  }

  cancel(): void {
    this.audio.play_buttonPress();
    this.visible = false;
    this.visibilityChanged();
  }

}

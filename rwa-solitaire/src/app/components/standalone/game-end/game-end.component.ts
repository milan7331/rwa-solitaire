import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio/audio.service';

@Component({
  selector: 'app-game-end',
  templateUrl: './game-end.component.html',
  styleUrl: './game-end.component.scss'
})

export class GameEndComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() newGame: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router, private audio: AudioService) {}

  visibilityChanged(): void {
    this.visibleChange.emit(this.visible);
  }

  playAgain(): void {
    this.audio.play_buttonPress();
    this.visible = false;
    this.visibilityChanged();
    this.newGame.emit(true);
  }

  backToHome(): void {
    this.audio.play_buttonPress();
    this.visible = false;
    this.visibilityChanged();
    this.router.navigate(["/"]);
  }

}

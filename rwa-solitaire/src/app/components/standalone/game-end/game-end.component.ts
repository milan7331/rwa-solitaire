import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-end',
  templateUrl: './game-end.component.html',
  styleUrl: './game-end.component.scss'
})

export class GameEndComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() newGame: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  visibilityChanged(): void {
    this.visibleChange.emit(this.visible);
  }

  playAgain(): void {
    this.visible = false;
    this.visibilityChanged();
    this.newGame.emit(true);
  }

  backToHome(): void {
    this.visible = false;
    this.visibilityChanged();
    this.router.navigate(["/"]);
  }

}

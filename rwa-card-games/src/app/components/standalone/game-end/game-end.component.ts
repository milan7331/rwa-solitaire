import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-end',
  templateUrl: './game-end.component.html',
  styleUrl: './game-end.component.scss'
})

export class GameEndComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  visibilityChanged(): void {
    this.visibleChange.emit(this.visible);
  }

}

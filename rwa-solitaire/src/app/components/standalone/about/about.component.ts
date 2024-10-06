import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AudioService } from '../../../services/audio/audio.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private audio: AudioService) {}

  visibilityChanged(): void {
    this.visibleChange.emit(this.visible);
  }

  openInNewTab(url: string): void {
    window.open(url, '_blank', 'noopener, noreferrer');
    this.audio.play_buttonPress();
  }
}

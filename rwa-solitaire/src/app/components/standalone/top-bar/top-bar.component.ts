import { Component, inject } from '@angular/core';
import { Router } from '@angular/router'
import { AudioService } from '../../../services/audio/audio.service';
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  private router: Router;
  private audio: AudioService;

  constructor() {
    this.router = inject(Router);
    this.audio = inject(AudioService);
  }

  loadHomePage(): void {
    this.router.navigate(["/home"]);
    this.audio.play_buttonPress();
  }
}

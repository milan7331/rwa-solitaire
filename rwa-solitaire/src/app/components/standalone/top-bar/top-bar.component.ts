import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { AudioService } from '../../../services/audio/audio.service';
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  constructor(private router: Router, private audio: AudioService) {}

  loadHomePage(): void {
    this.router.navigate(["/home"]);
    this.audio.play_buttonPress();
  }
}

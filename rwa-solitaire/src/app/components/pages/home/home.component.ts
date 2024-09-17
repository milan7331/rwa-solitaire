import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio/audio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  aboutVisible: boolean = false;
  private audio: AudioService;
  private router: Router;

  constructor() {
    this.audio = inject(AudioService);
    this.router = inject(Router);
  }

  loadAboutPage(): void {
    this.aboutVisible = true;
    this.audio.play_buttonPress();
  }

  loadSolitairePage(difficulty: string): void {
    switch (difficulty) {
      case "easy":
        this.router.navigate(["/solitaire"]);
        break;

      case "hard":
        this.router.navigate(["/solitaire"]);  
        break;

      default:
        this.router.navigate(["/*"]);
        break;
    }
    this.audio.play_buttonPress();
  }

  loadLeaderboardsPage(): void {
    this.router.navigate(["/leaderboards"]);
    this.audio.play_buttonPress();
  }


  addButtonIcons(type: string): void {

  }

  removeButtonIcons(type: string): void {
    
  }
}

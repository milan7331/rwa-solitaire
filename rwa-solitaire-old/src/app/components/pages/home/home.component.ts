import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio/audio.service';
import { SolitaireDifficulty } from '../../../models/solitaire/solitaire-board';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  aboutVisible: boolean = false;

  constructor(private router: Router, private audio: AudioService) {}

  loadAboutPage(): void {
    this.aboutVisible = true;
    this.audio.play_buttonPress();
  }

  loadSolitairePage(difficulty: string): void {
    switch (difficulty) {
      case "easy":
        this.router.navigate(["/solitaire"], { state: { difficulty: SolitaireDifficulty.Easy }});
        break;

      case "hard":
        this.router.navigate(["/solitaire"], { state: { difficulty: SolitaireDifficulty.Hard }});
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
}

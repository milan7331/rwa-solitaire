import { Component } from '@angular/core';

import { SolitaireDifficulty } from '../../../models/solitaire/solitaire-difficulty';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio/audio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {
  difficulty = SolitaireDifficulty;

  constructor(
    private readonly router: Router,
    private readonly audio: AudioService
  ) {

  }

  loadSolitairePage(difficulty: SolitaireDifficulty) {
    this.router.navigate(['/solitaire'], { state: { difficulty }});
    // this.audio.play_buttonPress();
  }

  loadLeaderboardsPage() {
    this.router.navigate(['/leaderboards']);
    // this.audio.play_buttonPress();
  }

  loadAboutPage() {
    // ngrx variant?
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark');
  }

}

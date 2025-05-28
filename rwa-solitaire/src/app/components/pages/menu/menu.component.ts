import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { UserStatsComponent } from "../../standalone/user-stats/user-stats.component";
import { SolitaireDifficulty } from '../../../models/solitaire/solitaire-difficulty';
import { AudioService } from '../../../services/app/audio/audio.service';
import { logoutActions } from '../../../store/actions/auth.actions';

@Component({
  selector: 'app-menu',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    UserStatsComponent
],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  standalone: true,
})
export class MenuComponent {
  SolitaireDifficulty = SolitaireDifficulty;
  difficulty: SolitaireDifficulty;
  
  constructor(
    private readonly router: Router,
    private readonly store: Store,
    private readonly audio: AudioService,
  ) {
    this.difficulty = SolitaireDifficulty.Hard;
  }

  continueGame(): void {
    this.audio.play_buttonPress();
    // dispatch za load u store i onda start game
  }

  loadSolitairePage(): void {
    this.audio.play_buttonPress();
    this.router.navigate(['solitaire'], { state: { difficulty: this.difficulty }});
  }

  loadLeaderboardsPage(): void {
    this.audio.play_buttonPress();
    this.router.navigate(['leaderboards']);
  }

  loadEditProfilePage(): void {
    // IZMENITI!!
    this.audio.play_buttonPress();
  }

  logout(): void {
    this.router.navigate(['home']);
    this.audio.play_buttonPress();
    this.store.dispatch(logoutActions.logout());
  }

  changeDifficulty(): void {
    this.audio.play_buttonPress();
    this.difficulty = (this.difficulty === 0) ? 1 : 0;
  }

}

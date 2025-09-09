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
import { logoutActions } from '../../../store/actions/user.actions';

@Component({
  selector: 'app-menu',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatDividerModule,
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
    this.difficulty = SolitaireDifficulty.Easy;
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
    this.audio.play_buttonPress();
    this.router.navigate(['edit-user']);
  }

  logout(): void {
    this.audio.play_buttonPress();
    this.router.navigate(['home']);
    this.store.dispatch(logoutActions.logout());
  }

  setDifficulty(diff: SolitaireDifficulty) {
    this.audio.play_buttonPress();
    this.difficulty = diff;
  }
}

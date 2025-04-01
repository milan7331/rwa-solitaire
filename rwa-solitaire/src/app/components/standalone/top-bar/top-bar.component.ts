import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AudioService } from '../../../services/app/audio/audio.service';
import { ThemeService } from '../../../services/app/theme/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
  standalone: true
})
export class TopBarComponent {
  constructor(
    private readonly audio: AudioService,
    private readonly theme: ThemeService,
    private readonly router: Router,
  ) {}

  loadHomePage(): void {
    this.router.navigate(['']);
    this.audio.play_buttonPress();
  }

  loadLoginPage(): void {
    this.router.navigate(['/login']);
    this.audio.play_buttonPress();
  }

  loadRegisterPage(): void {
    this.router.navigate(['/register']);
    this.audio.play_buttonPress();
  }

  loadLeaderboardsPage(): void {
    this.router.navigate(['/leaderboards']);
    this.audio.play_buttonPress();
  }

  loadAboutPage(): void {
    this.router.navigate(['/about']);
    this.audio.play_buttonPress();
  }

  toggleDarkMode(): void {
    this.theme.toggleLightMode();
    this.audio.play_buttonPress();
  }
}

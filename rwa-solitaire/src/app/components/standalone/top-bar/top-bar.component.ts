import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AudioService } from '../../../services/app/audio/audio.service';
import { ThemeService } from '../../../services/app/theme/theme.service';
import { AboutComponent } from '../about/about.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatButtonToggleModule,
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

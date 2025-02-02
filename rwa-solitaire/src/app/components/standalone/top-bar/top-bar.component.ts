import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AudioService } from '../../../services/audio/audio.service';
import { ThemeService } from '../../../services/theme/theme.service';

@Component({
  selector: 'app-top-bar',
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
  standalone: true
})
export class TopBarComponent {
  constructor(
    private readonly audio: AudioService,
    private readonly theme: ThemeService
  ) {}

  toggleDarkMode(): void {
    this.theme.toggleLightMode();
    this.audio.play_buttonPress();
  }
}

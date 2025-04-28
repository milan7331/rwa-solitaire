import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';

import { SolitaireDifficulty } from '../../../models/solitaire/solitaire-difficulty';
import { AudioService } from '../../../services/app/audio/audio.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatListModule,
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true
})
export class HomeComponent {
  difficulty = SolitaireDifficulty;
  
  constructor(
    private readonly router: Router,
    private readonly audio: AudioService,
  ) {}
 
  loadSolitairePage(difficulty: SolitaireDifficulty) {
    this.router.navigate(['/solitaire'], { state: {difficulty} });
    this.audio.play_buttonPress();
  }
}
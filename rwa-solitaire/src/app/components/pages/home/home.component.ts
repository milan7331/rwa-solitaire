import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { SolitaireDifficulty } from '../../../models/solitaire/solitaire-difficulty';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio/audio.service';
import { WindowService } from '../../../services/window/window.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
  ],
  providers: [
    WindowService
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true
})
export class HomeComponent implements OnDestroy{
  destroy$ = new Subject<void>();
  difficulty = SolitaireDifficulty;
  
  // Note: background animations are set to work with fixed dimensions -> font-size 30px & 60 px margin
  suits = '♠♥♦♣';
  bgElements: string = '';
  bgElementCount: { x: number, y: number } = { x: 40, y: 30 };
  
  constructor(
    private readonly router: Router,
    private readonly audio: AudioService,
    private readonly winService: WindowService
  ) {
    winService.windowSize$
      .pipe(takeUntil(this.destroy$))
      .subscribe((win) => {
        this.bgElementCount = this.#getBgElementCount(win.width, win.height);
        this.bgElements = this.#fillBgElementsArray(this.bgElementCount);
      });

  }

  #getBgElementCount(x: number, y: number): { x: number, y: number } {
    if (x < 300 || y < 200) return { x:40, y:30 };

    let xNum = Math.floor((x - 120) / 150);
    if (xNum % 4 === 0) xNum++;
    let yNum = Math.floor((y - 120) / 150);
    if (yNum % 4 === 0) yNum++;

    return { x:xNum, y:yNum }
  }

  #fillBgElementsArray(elementCount: {x: number, y: number}): string {
    const result = Math.floor((elementCount.x * elementCount.y) / 4);
    const rest = (elementCount.x * elementCount.y) % 4;

    this.bgElements = this.suits.repeat(result);
    this.bgElements = this.bgElements.concat(this.suits.slice(0, rest));

    return this.bgElements;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}


  // loadSolitairePage(difficulty: SolitaireDifficulty) {
  //   this.router.navigate(['/solitaire'], { state: { difficulty }});
  //   // this.audio.play_buttonPress();
  // }
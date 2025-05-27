import { Component, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';

import { Leaderboard } from '../../../models/leaderboard/leaderboard';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { selectLeaderboardPage } from '../../../store/selectors/leaderboards.selectors';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-leaderboard-display',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
  ],
  templateUrl: './leaderboard-display.component.html',
  styleUrl: './leaderboard-display.component.scss',
  standalone: true,
})
export class LeaderboardDisplayComponent implements OnInit {
  leaderboardPage$: Observable<Leaderboard>;

  constructor(private readonly store: Store) {
    this.leaderboardPage$ = of({} as Leaderboard);
  }

  ngOnInit(): void {
    this.leaderboardPage$ = this.store.select(selectLeaderboardPage);
  }
}

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { UserStats } from '../../../models/user/user-stats';
import { selectUserStats } from '../../../store/selectors/user.selectors';
import { CommonModule } from '@angular/common';
import { userMenuActions } from '../../../store/actions/user.actions';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-stats',
  imports: [
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './user-stats.component.html',
  styleUrl: './user-stats.component.scss',
  standalone: true
})
export class UserStatsComponent implements OnInit {
  stats$: Observable<UserStats>;

  constructor(private readonly store: Store) {
    this.stats$ = of({
      averageSolveTime: 0,
      fastestSolveTime: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      totalTimePlayed: 0
    } as UserStats)
  }

  ngOnInit(): void {
    this.store.dispatch(userMenuActions.getUserStats());
    this.stats$ = this.store.select(selectUserStats);
  }
}

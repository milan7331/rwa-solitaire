import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { UserStats } from '../../../models/user/user-stats';
import { selectUsername, selectUserStats } from '../../../store/selectors/user.selectors';
import { CommonModule } from '@angular/common';
import { userStatsActions } from '../../../store/actions/user.actions';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-stats',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './user-stats.component.html',
  styleUrl: './user-stats.component.scss',
  standalone: true
})
export class UserStatsComponent implements OnInit {
  username$: Observable<string>;
  stats$: Observable<UserStats>;

  constructor(private readonly store: Store) {

    this.username$ = of('');
    this.stats$ = of({ averageSolveTime: 0, fastestSolveTime: 0, gamesPlayed: 0, gamesWon: 0, totalTimePlayed: 0 } as UserStats);
  }

  ngOnInit(): void {
    this.username$ = this.store.select(selectUsername);
    this.stats$ = this.store.select(selectUserStats);
  }
}

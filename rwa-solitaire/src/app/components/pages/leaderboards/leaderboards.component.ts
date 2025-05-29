import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { leaderboardsActions } from '../../../store/actions/leaderboards.actions';
import { selectLeaderboardType, selectPageIndex, selectLeaderboardPageCount, selectTimePeriod } from '../../../store/selectors/leaderboards.selectors';

import { LeaderboardType } from '../../../models/leaderboard/leaderboard.enum';
import { LeaderboardDisplayComponent } from "../../standalone/leaderboard-display/leaderboard-display.component";
import { AudioService } from '../../../services/app/audio/audio.service';

@Component({
  selector: 'app-leaderboards',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    LeaderboardDisplayComponent,
  ],
  templateUrl: './leaderboards.component.html',
  styleUrl: './leaderboards.component.scss',
  standalone: true
})
export class LeaderboardsComponent implements  OnInit {
  leaderboardTypeValues = Object.values(LeaderboardType).filter(v => typeof v === 'number');

  leaderboardType$: Observable<LeaderboardType>;
  leaderboardPageCount$: Observable<number>;
  leaderboardPageIndex$: Observable<number>;
  leaderboardTimePeriod$: Observable<string>;

  constructor(
    private readonly store: Store,
    private readonly audio: AudioService,
  ) {
    this.leaderboardType$ = of(LeaderboardType.WEEKLY);
    this.leaderboardPageCount$ = of(0);
    this.leaderboardPageIndex$ = of(0);
    this.leaderboardTimePeriod$ = of('');
  }

  ngOnInit(): void {
    this.leaderboardType$ = this.store.select(selectLeaderboardType);
    this.leaderboardPageCount$ = this.store.select(selectLeaderboardPageCount);
    this.leaderboardPageIndex$ = this.store.select(selectPageIndex);
    this.leaderboardTimePeriod$ = this.store.select(selectTimePeriod);
  }

  changeLeaderboardType(type: LeaderboardType) {
    this.audio.play_buttonPress();
    this.store.dispatch(leaderboardsActions.changeLeaderboardType({ leaderboardType: type }));
  }

  loadNextPage(): void {
    this.audio.play_buttonPress();
    this.store.dispatch(leaderboardsActions.showNextPage());
  }

  loadPreviousPage(): void {
    this.audio.play_buttonPress();
    this.store.dispatch(leaderboardsActions.showPreviousPage());
  }

  loadFistPage(): void {
    this.audio.play_buttonPress();
    this.store.dispatch(leaderboardsActions.showFirstPage());
  }

  loadLastPage(): void {
    this.audio.play_buttonPress();
    this.store.dispatch(leaderboardsActions.showLastPage());
  }

  getLeaderboardText(type: LeaderboardType): string {
    if (type === LeaderboardType.WEEKLY) return 'Weekly';
    if (type === LeaderboardType.MONTHLY) return 'Monthly';
    if (type === LeaderboardType.YEARLY) return 'Yearly';
    return '';
  }

  getPageIndexText(index: number | null, count: number | null): string {
    if (!count) return '0/0';
    if (count >= 1 && index !== null && index !== undefined) return `${index + 1}/${count}`;
    return '0/0';
  }
}

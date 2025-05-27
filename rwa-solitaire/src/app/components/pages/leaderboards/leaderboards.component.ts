import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { leaderboardsActions } from '../../../store/actions/leaderboards.actions';
import { selectLeaderboardType, selectPageIndex, selectLeaderboardPageCount, selectLeaderboardPage, selectTimePeriod } from '../../../store/selectors/leaderboards.selectors';

import { Leaderboard } from '../../../models/leaderboard/leaderboard';
import { LeaderboardType } from '../../../models/leaderboard/leaderboard.enum';
import { LeaderboardDisplayComponent } from "../../standalone/leaderboard-display/leaderboard-display.component";

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
export class LeaderboardsComponent implements  OnInit, AfterViewInit {
  LeaderboardType = LeaderboardType;
  leaderboardTypeValues = Object.values(LeaderboardType).filter(v => typeof v === 'number');

  leaderboardType$: Observable<LeaderboardType>;
  leaderboardType: LeaderboardType;

  leaderboardPage$: Observable<Leaderboard>;
  leaderboardPage: Leaderboard;

  leaderboardPageCount$: Observable<number>;
  leaderboardPageCount: number;

  leaderboardPageIndex$: Observable<number>;
  leaderboardPageIndex: number;

  leaderboardTimePeriod$: Observable<string>;
  leaderboardTimePeriod: string;

  constructor(
    private readonly store: Store,
    private readonly destroyRef: DestroyRef,
  ) {
    this.leaderboardType$ = of(LeaderboardType.WEEKLY);
    this.leaderboardType = LeaderboardType.WEEKLY;
    
    this.leaderboardPage$ = of(this.#createEmptyLeaderboard(15));
    this.leaderboardPage = this.#createEmptyLeaderboard(15);
   
    this.leaderboardPageCount$ = of(0);
    this.leaderboardPageCount = 0;

    this.leaderboardPageIndex$ = of(0);
    this.leaderboardPageIndex = 0;

    this.leaderboardTimePeriod$ = of('');
    this.leaderboardTimePeriod = '';
  }

  ngOnInit(): void {
    this.leaderboardType$ = this.store.select(selectLeaderboardType);
    this.leaderboardType$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((type) => 
      this.leaderboardType = type
    );

    this.leaderboardPage$ = this.store.select(selectLeaderboardPage);
    this.leaderboardPage$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((lb) => {
      this.leaderboardPage = {...lb};
      //console.log(this.leaderboardPage);
      }
    );

    this.leaderboardPageCount$ = this.store.select(selectLeaderboardPageCount);
    this.leaderboardPageCount$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((count) =>
      this.leaderboardPageCount = count
    );

    this.leaderboardPageIndex$ = this.store.select(selectPageIndex);
    this.leaderboardPageIndex$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((index) =>
      this.leaderboardPageIndex = index
    );

    this.leaderboardTimePeriod$ = this.store.select(selectTimePeriod);
    this.leaderboardTimePeriod$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((period) =>
      this.leaderboardTimePeriod = period
    );
  }
  
  ngAfterViewInit(): void {
    this.#createMockData();
  }

  changeLeaderboardType(type: LeaderboardType) {
    this.store.dispatch(leaderboardsActions.changeLeaderboardType({ leaderboardType: type }));
  }
  
  loadNextPage(): void {
    this.store.dispatch(leaderboardsActions.showNextPage());
    console.log(this.leaderboardPage);
  }
  loadPreviousPage(): void {
    this.store.dispatch(leaderboardsActions.showPreviousPage());
  }

  loadFistPage(): void {
    this.store.dispatch(leaderboardsActions.showFirstPage());
        console.log(this.leaderboardPage);

  }

  loadLastPage(): void {
    this.store.dispatch(leaderboardsActions.showLastPage());
    console.log(this.leaderboardPage);
  }

  getLeaderboardText(type: LeaderboardType): string {
    if (type === LeaderboardType.WEEKLY) return 'Weekly';
    if (type === LeaderboardType.MONTHLY) return 'Monthly';
    if (type === LeaderboardType.YEARLY) return 'Yearly';
    return '';
  }


  #createMockData(): void {
    let mockPagesW: Leaderboard[] = [];
    let mockPagesM: Leaderboard[] =[];
    let mockPagesY: Leaderboard[] = [];
    for (let i = 0; i < 5; i++) {
      mockPagesW.push(this.#createMockLeaderboardPage(i * 1000));
    }
    for (let i = 5; i < 10; i++) {
      mockPagesM.push(this.#createMockLeaderboardPage(i * 1000));
    }
    for (let i = 10; i < 15; i++) {
      mockPagesY.push(this.#createMockLeaderboardPage(i * 1000));
    }

    this.store.dispatch(leaderboardsActions.loadAdditionalPagesSuccess({ pages: [...mockPagesW], pageCount: 20, leaderboardType: LeaderboardType.WEEKLY }));
    this.store.dispatch(leaderboardsActions.loadAdditionalPagesSuccess({ pages: [...mockPagesM], pageCount: 15, leaderboardType: LeaderboardType.MONTHLY }));
    this.store.dispatch(leaderboardsActions.loadAdditionalPagesSuccess({ pages: [...mockPagesY], pageCount: 40, leaderboardType: LeaderboardType.YEARLY }));
  }

  #createMockLeaderboardPage(seed: number): Leaderboard {
    const page: Leaderboard = this.#createEmptyLeaderboard(seed);

    let scoreIndex = Math.max(0, seed);

    for (let i = 0; i < 20; i++) {
      page.top20_averageTime.push({ username: `player${scoreIndex}`, score: scoreIndex });
      scoreIndex++;
    }

    for (let i = 0; i < 20; i++) {
      page.top20_bestTime.push({ username: `player${scoreIndex}`, score: scoreIndex });
      scoreIndex++;
    }

    for (let i = 0; i < 20; i++) {
      page.top20_gamesPlayed.push({ username: `player${scoreIndex}`, score: scoreIndex });
      scoreIndex++;
    }

    for (let i = 0; i < 20; i++) {
      page.top20_numberOfMoves.push({ username: `player${scoreIndex}`, score: scoreIndex });
      scoreIndex++;
    }

    return page;
  }

  #createEmptyLeaderboard(seed: number): Leaderboard {
    return {
      timePeriod: new Date(Date.now() - seed),
      top20_averageTime: [],
      top20_bestTime: [],
      top20_gamesPlayed: [],
      top20_numberOfMoves: [],
    }
  }
}

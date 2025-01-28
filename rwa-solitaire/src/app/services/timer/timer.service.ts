import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, map, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService implements OnDestroy{
  #timer$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  #timerSubscription: Subscription | null = null;

  #startTime: number = 0;
  #elapsedTime: number = 0;

  public time$: Observable<number> = this.#timer$.asObservable();
  public formatedTime$: Observable<string> = this.time$.pipe(
    map(seconds => this.#formatDisplayTime(seconds))
  );

  start(): void {
    if (this.#timerSubscription === null) {
      this.#startTime = Date.now();
      this.#timerSubscription = interval(1000).pipe(
        map(() => Math.floor((Date.now() - this.#startTime!) / 1000) + this.#elapsedTime)
      ).subscribe(seconds => {
        this.#timer$.next(seconds);
      });
    }
  }

  pause(): void {
    this.#removeTimerSubscription();

    this.#startTime = 0;
    this.#elapsedTime = this.#timer$.value;
  }

  reset(): void {
    this.#removeTimerSubscription();

    this.#startTime = 0;
    this.#elapsedTime = 0;

    this.#timer$.next(0);
  }

  #formatDisplayTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
  
    return `${this.#padZero(minutes)}:${this.#padZero(seconds)}`;
  }
  
  #padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  #removeTimerSubscription(): boolean {
    if (this.#timerSubscription) {
      this.#timerSubscription.unsubscribe();
      this.#timerSubscription = null;
      return true;
    }

    return false;
  }


  ngOnDestroy(): void {
    this.#removeTimerSubscription();
    this.#timer$.complete();
  }
}

import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, debounceTime, fromEvent, Observable, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowService implements OnDestroy {
  #destroy$: Subject<void>;
  
  #windowSize: BehaviorSubject<{ width: number; height: number }>;
  #cursorPosition: BehaviorSubject<{ x: number, y: number }>;
  
  windowSize$: Observable<{ width: number; height: number }>;
  cursorPosition$: Observable<{ x: number, y: number }>;

  constructor() {
    this.#destroy$ = new Subject<void>();

    this.#windowSize = new BehaviorSubject({ width: window.innerWidth, height: window.innerHeight });
    this.#cursorPosition = new BehaviorSubject({ x: 0, y: 0 });

    this.windowSize$ = this.#windowSize.asObservable();
    this.cursorPosition$ = this.#cursorPosition.asObservable();
  
    this.#initialize();
  }

  #initialize() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntil(this.#destroy$))
      .subscribe(() => {
        this.#windowSize.next({
          width: window.innerWidth,
          height: window.innerHeight
        });
      });

    fromEvent<MouseEvent>(window, 'mousemove')
      .pipe(takeUntil(this.#destroy$))
      .subscribe((event: MouseEvent) => {
        this.#cursorPosition.next({
          x: event.clientX,
          y: event.clientY
        });
      });
  }

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }
}
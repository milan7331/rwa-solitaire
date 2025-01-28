import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, debounceTime, fromEvent, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowService implements OnDestroy {
  #destroy$ = new Subject<void>();

  #windowSize = new BehaviorSubject<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight
  });
  #cursorPosition = new BehaviorSubject<{ x: number, y: number }>({
    x: 0,
    y: 0
  });
  
  public windowSize$ = this.#windowSize.asObservable();
  public cursorPosition$ = this.#cursorPosition.asObservable();

  constructor() {
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
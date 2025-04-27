import { DestroyRef, Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, fromEvent, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class WindowService {  
  #windowSize: BehaviorSubject<{ width: number; height: number }>;
  #cursorPosition: BehaviorSubject<{ x: number, y: number }>;
  
  windowSize$: Observable<{ width: number; height: number }>;
  cursorPosition$: Observable<{ x: number, y: number }>;

  constructor(
    private readonly destroyRef: DestroyRef,
  ) {
    this.#windowSize = new BehaviorSubject({ width: window.innerWidth, height: window.innerHeight });
    this.#cursorPosition = new BehaviorSubject({ x: 0, y: 0 });

    this.windowSize$ = this.#windowSize.asObservable();
    this.cursorPosition$ = this.#cursorPosition.asObservable();
  
    this.#initialize();
  }

  #initialize() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.#windowSize.next({
          width: window.innerWidth,
          height: window.innerHeight
        });
      });

    fromEvent<MouseEvent>(window, 'mousemove')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: MouseEvent) => {
        this.#cursorPosition.next({
          x: event.clientX,
          y: event.clientY
        });
      });
  }
}

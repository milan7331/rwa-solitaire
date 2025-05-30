import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, fromEvent, merge, Observable, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WindowSize } from './window-size';
import { CursorPosition } from './cursor-position';




@Injectable({
  providedIn: 'root'
})
export class WindowService {  
  #windowSize: BehaviorSubject<WindowSize>;
  #cursorPosition: BehaviorSubject<CursorPosition>;
  
  windowSize$: Observable<WindowSize>;
  cursorPosition$: Observable<CursorPosition>;

  constructor() {
    this.#windowSize = new BehaviorSubject({ width: window.innerWidth, height: window.innerHeight });
    this.#cursorPosition = new BehaviorSubject({ x: 0, y: 0 });

    this.windowSize$ = this.#windowSize.asObservable();
    this.cursorPosition$ = this.#cursorPosition.asObservable();
  
    this.#initializeWindowResizing();
    this.#initializeMouseTracking();
  }

  #initializeWindowResizing() {
    merge(
      fromEvent(window, 'resize'),
      fromEvent(document, 'visibilitychange'),
      fromEvent(document, 'fullscreenchange'),
      fromEvent(document, 'webkitfullscreenchange'),
      fromEvent(document, 'msfullscreenchange'),
    ).pipe(
      startWith(0),
      debounceTime(100),
    ).subscribe(() => {
      this.#windowSize.next({ width: window.innerWidth, height: window.innerHeight });
    });
  }

  #initializeMouseTracking() {
    fromEvent<MouseEvent>(window, 'mousemove')
    .subscribe((event: MouseEvent) => {
      this.#cursorPosition.next({
        x: event.clientX,
        y: event.clientY
      });
    });
  }
}

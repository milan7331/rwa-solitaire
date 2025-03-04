import { AfterViewInit, Component, OnInit } from '@angular/core';
import { WindowService } from '../../../services/app/window/window.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-bg-animation',
  imports: [],
  templateUrl: './bg-animation.component.html',
  styleUrl: './bg-animation.component.scss',
  standalone: true
})
export class BgAnimationComponent implements OnInit, AfterViewInit {
  #destroy$: Subject<void>;

  // Note: background animations are set to work with fixed dimensions -> font-size 30px & 60 px margin
  suits = '♠♥♦♣';
  elements: string = '';
  elementCount: { x: number, y: number } = { x: 40, y: 30 };

  constructor(private readonly winService: WindowService) {
    this.#destroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.winService.windowSize$
      .pipe(takeUntil(this.#destroy$))
      .subscribe((win) => {
        this.elementCount = this.#getBgElementCount(win.width, win.height);
        this.elements = this.#fillBgElementsArray(this.elementCount);
      });
  }

  ngAfterViewInit(): void {
    this.#setRandomAnimationTimings();
  }

  #getBgElementCount(x: number, y: number): { x: number, y: number } {
    if (x < 300 || y < 200) return { x:40, y:30 };

    let xNum = Math.floor((x - 120) / 150);
    if (xNum % 4 === 0) xNum++;
    let yNum = Math.floor((y - 120) / 150);
    if (yNum % 4 === 0) yNum++;

    return { x:xNum, y:yNum }
  }

  #fillBgElementsArray(elementCount: {x: number, y: number}): string {
    const result = Math.floor((elementCount.x * elementCount.y) / 4);
    const rest = (elementCount.x * elementCount.y) % 4;

    this.elements = this.suits.repeat(result);
    this.elements = this.elements.concat(this.suits.slice(0, rest));

    return this.elements;
  }

  #setRandomAnimationTimings() {
    const elements = document.querySelectorAll<HTMLElement>('div.bg-element');

    elements.forEach(el => {
      const element = el as HTMLElement;

      const duration = Math.floor(Math.random() * 35) + 5;
      const delay = Math.floor(Math.random() * (duration * 0.8));

      element.style.animationDuration = duration + 's';
      element.style.animationDelay = '-' + delay + 's';
    })
  }
}

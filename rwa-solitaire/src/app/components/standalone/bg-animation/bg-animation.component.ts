import { AfterViewInit, Component, DestroyRef, ElementRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WindowService } from '../../../services/app/window/window.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-bg-animation',
  imports: [],
  templateUrl: './bg-animation.component.html',
  styleUrl: './bg-animation.component.scss',
  standalone: true
})
export class BgAnimationComponent implements OnInit, AfterViewInit {
  // Note: background animations are set to work with fixed dimensions -> font-size 30px & 60 px margin
  suits = '♠♥♦♣';
  elements: string = '';
  elementCount: { x: number, y: number } = { x: 40, y: 30 };

  #excludedRoutes: string[] = ['solitaire'];
  onExcludedRoute: boolean = false;

  

  constructor(
    private readonly router: Router,
    private readonly host: ElementRef,
    private readonly destroyRef: DestroyRef,
    private readonly winService: WindowService,
  ) {}

  ngOnInit(): void {
    this.winService.windowSize$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((win) => {
        this.elementCount = this.#getBgElementCount(win.width, win.height);
        this.elements = this.#fillBgElementsArray(this.elementCount);
        this.#setRandomAnimationTimings();
      });

    this.router.events.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() =>
      this.#removeBgAnimation()
    )
  }

  ngAfterViewInit(): void {
    this.#setRandomAnimationTimings();
    this.#removeBgAnimation();
  }

  #getBgElementCount(xRes: number, yRes: number): { x: number, y: number } {
    if (xRes < 200 || yRes < 200) return { x:40, y:30 };

    let xNum = Math.floor((xRes - 120) / 150);
    if (xNum % 4 === 0) xNum++;
    let yNum = Math.floor((yRes - 120) / 150);
    if (yNum % 4 === 0) yNum++;

    return { x:xNum, y:yNum }
  }

  #fillBgElementsArray(elementCount: {x: number, y: number}): string {
    const result = Math.floor((elementCount.x * elementCount.y) / 4);
    const rest = (elementCount.x * elementCount.y) % 4;

    let newElements = this.suits.repeat(result);
    newElements = newElements.concat(this.suits.slice(0, rest));

    return newElements;
  }

  #setRandomAnimationTimings(): void {
    const nativeElement = this.host.nativeElement;
    if (nativeElement === null || nativeElement === undefined) return;

    const elements = this.host.nativeElement.querySelectorAll('div.bg-element') as HTMLElement[];

    elements.forEach(el => {
      const element = el as HTMLElement;

      const duration = Math.floor(Math.random() * 35) + 5;
      const delay = Math.floor(Math.random() * (duration * 0.8));

      element.style.animationDuration = duration + 's';
      element.style.animationDelay = '-' + delay + 's';
    })
  }
  
  #removeBgAnimation(): void {
    this.onExcludedRoute = this.#checkExcludedRouteActive();
  }

  #checkExcludedRouteActive(): boolean {
    return this.#excludedRoutes.some((route) => {
      return this.router.isActive(route, {
        paths: 'exact',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored',
      });
    });
  }  
}

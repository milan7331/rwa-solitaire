import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, ElementRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WindowService } from '../../../services/app/window/window.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, startWith } from 'rxjs';
import { BgElement } from './bg-element';
import { WindowSize } from '../../../services/app/window/window-size';

@Component({
  selector: 'app-bg-animation',
  imports: [],
  templateUrl: './bg-animation.component.html',
  styleUrl: './bg-animation.component.scss',
  standalone: true
})
export class BgAnimationComponent implements OnInit, AfterViewInit {
  // Note: background animations are set to work with fixed element dimensions set in the constructor
  suits: string;
  elements: BgElement[];
  elementSize: number;
  elementGap: number;

  #excludedRoutes: string[] = ['solitaire'];
  renderAnimation: boolean;

  constructor(
    private readonly router: Router,
    private readonly elementRef: ElementRef,
    private readonly destroyRef: DestroyRef,
    private readonly winService: WindowService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.suits  = '♠♥♦♣';
    this.elements = [];
    this.elementSize = 30;
    this.elementGap = 120;
    this.renderAnimation = false;
  }

  ngOnInit(): void {
    this.winService.windowSize$.pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith({ width: 1920, height: 1080 } as WindowSize)
    ).subscribe((win) => {
        this.elements = this.#getBgElements(win);
        this.cdr.detectChanges();       
      });

    this.router.events.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.renderAnimation = !this.#checkExcludedRouteActive();
    });
  }

  ngAfterViewInit(): void {
    this.#setBgElementSizing();
  }

  #getBgElements(windowSize: WindowSize): BgElement[] {
    const elementCount = this.#getBgElementCount(windowSize);
    return Array.from({length: elementCount}, () => this.#generateRandomBgElement());
  }

  #getBgElementCount(res: WindowSize): number {
    if (res.width < 200 || res.height < 200) return 10;

    let xNum = Math.floor(res.width / (this.elementSize + this.elementGap));
    let yNum = Math.floor(res.height / (this.elementSize + this.elementGap));

    return xNum * yNum;
  }

  #generateRandomBgElement(): BgElement {
    const character = this.suits[Math.floor(Math.random() * this.suits.length)];
    const duration = Math.floor(Math.random() * 35) + 5;
    const delay = Math.floor(Math.random() * (duration * 0.8));

    return { character, duration, delay };
  }

  #setBgElementSizing(): void {
    const host = this.elementRef.nativeElement as HTMLElement;
    if (!host) return;

    host.style.setProperty('--element-size', `${this.elementSize}px`);
    host.style.setProperty('--element-gap', `${this.elementGap}px`);
  }

  #checkExcludedRouteActive(): boolean {
    return this.#excludedRoutes.some((route) =>
      this.router.isActive(route, {
        paths: 'exact',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored',
      })
    );
  }  
}

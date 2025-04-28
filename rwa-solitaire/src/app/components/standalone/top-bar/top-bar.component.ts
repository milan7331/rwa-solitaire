import { Component, DestroyRef, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter, merge, Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AudioService } from '../../../services/app/audio/audio.service';
import { ThemeService } from '../../../services/app/theme/theme.service';
import { AudioControlComponent } from '../audio-control/audio-control.component';
import { selectAudioVolumeIcon } from '../../../store/selectors/audio.selectors';
import { selectUserLoginValid } from '../../../store/selectors/user.selectors';

@Component({
  selector: 'app-top-bar',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
  standalone: true
})
export class TopBarComponent implements OnInit, OnDestroy {
  volumeIcon$: Observable<string>;
  loginValid$: Observable<boolean>;

  #overlayRef: OverlayRef | null;

  constructor(
    private readonly router: Router,
    private readonly store: Store,
    private readonly audio: AudioService,
    private readonly theme: ThemeService,
    private readonly overlay: Overlay,
    private readonly host: ElementRef,
    private readonly destroyRef: DestroyRef,
  ) {
    this.volumeIcon$ = of('volume_up');
    this.loginValid$ = of(false);

    this.#overlayRef = null;
  }
  
  ngOnInit(): void {
    this.volumeIcon$ = this.store.select(selectAudioVolumeIcon);
    this.loginValid$ = this.store.select(selectUserLoginValid);
    this.#initOverlay();
  }

  ngOnDestroy(): void {
    this.#overlayRef?.dispose();
  }

  loadHomePage(): void {
    this.audio.play_buttonPress();
    this.router.navigate(['']);
  }

  logout(): void {
    this.audio.play_buttonPress();
    // treba da trigger akciju -> da se vrati na homepage
  }

  loadLoginPage(): void {
    this.audio.play_buttonPress();
    this.router.navigate(['/login']);
  }

  loadRegisterPage(): void {
    this.audio.play_buttonPress();
    this.router.navigate(['/register']);
  }

  loadLeaderboardsPage(): void {
    this.audio.play_buttonPress();
    this.router.navigate(['/leaderboards']);
  }

  loadAboutPage(): void {
    this.audio.play_buttonPress();
    this.router.navigate(['/about']);
  }

  toggleDarkMode(): void {
    this.audio.play_buttonPress();
    this.theme.toggleLightMode();
  }

  toggleAudioControl(event: MouseEvent): void {
    this.audio.play_buttonPress();  
    
    // toggle functionality - detaches overlay if it exists and exits
    if (this.#detachOverlay()) return;

    const portal = new ComponentPortal(AudioControlComponent);
    if (this.#overlayRef === null) this.#initOverlay();
    this.#overlayRef!.attach(portal);
  }

  #initOverlay(): void {
    const button = this.host.nativeElement.querySelector('#volume-button');
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(button)
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
          offsetY: 8,
        },
        { // fallback position
          originX: 'center',
          originY: 'center',
          overlayX: 'center',
          overlayY: 'center',
        }
      ]);

    this.#overlayRef ??= this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });

    merge(
      this.#overlayRef.outsidePointerEvents(),
      this.#overlayRef.backdropClick(),
      this.#overlayRef.keydownEvents().pipe(filter(ev => ev.key === 'Escape')),
    ).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() =>
      this.#detachOverlay()
    );
  }

  #detachOverlay(): boolean {
    if (this.#overlayRef?.hasAttached()) {
      this.#overlayRef.detach();
      return true;
    }
    return false;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable, of } from 'rxjs';

import { AudioService } from '../../../services/app/audio/audio.service';
import { ThemeService } from '../../../services/app/theme/theme.service';
import { AudioControlComponent } from '../audio-control/audio-control.component';
import { selectAudioVolumeIcon } from '../../../store/selectors/audio.selectors';
import { selectLoginValid, selectUsername } from '../../../store/selectors/user.selectors';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { logoutActions } from '../../../store/actions/user.actions';

@Component({
  selector: 'app-top-bar',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    OverlayModule,
    AudioControlComponent
],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
  animations: [
      trigger('overlayAnimation', [
        state('void', style({ opacity: 0, transform: 'translateY(-10px)'})),
        state('*', style({ opacity: 1, transform: 'translateY(0)'})),
        transition('void <=> *', animate('200ms ease-in-out')),
      ]),
    ],
  standalone: true,
})
export class TopBarComponent implements OnInit {
  volumeIcon$: Observable<string>;
  loginValid$: Observable<boolean>;
  username$: Observable<string>;

  audioControlIsOpen: boolean;

  constructor(
    private readonly router: Router,
    private readonly store: Store,
    private readonly audio: AudioService,
    private readonly theme: ThemeService,
  ) {
    this.volumeIcon$ = of('volume_up');
    this.loginValid$ = of(false);
    this.username$ = of('');

    this.audioControlIsOpen = false;
  }

  ngOnInit(): void {
    this.volumeIcon$ = this.store.select(selectAudioVolumeIcon);
    this.loginValid$ = this.store.select(selectLoginValid);
    this.username$ = this.store.select(selectUsername);

  }

  loadHomePage(): void {
    this.audio.play_buttonPress();
    this.router.navigate(['']);
  }

  loadMenuPage(): void {
    this.audio.play_buttonPress();
    this.router.navigate(['menu'])
  }

  logout(): void {
    this.audio.play_buttonPress();
    this.store.dispatch(logoutActions.logout());
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

  toggleAudioControl(): void {
    this.audio.play_buttonPress();
    this.audioControlIsOpen = !this.audioControlIsOpen;
  }

  handleEscapeKeyOverlay(ev: KeyboardEvent) {
    if (ev.key === 'Escape') this.audioControlIsOpen = false;
    return;
  }

  handleAudioOverlayClose() {
    this.audioControlIsOpen = false;
  }
}

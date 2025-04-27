import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AudioService } from '../../../services/app/audio/audio.service';
import { ThemeService } from '../../../services/app/theme/theme.service';
import { AudioControlComponent } from '../audio-control/audio-control.component';
import { selectAudioVolumeIcon } from '../../../store/selectors/audio.selectors';
import { selectUserLoginValid } from '../../../store/selectors/user.selectors';

@Component({
  selector: 'app-top-bar',
  imports: [
    CommonModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
  standalone: true
})
export class TopBarComponent implements OnInit {
  volumeIcon$: Observable<string>;
  loginValid$: Observable<boolean>;

  constructor(
    private readonly router: Router,
    private readonly store: Store,
    private readonly audio: AudioService,
    private readonly theme: ThemeService,
    private readonly dialog: MatDialog,
  ) {
    this.volumeIcon$ = of('volume_up');
    this.loginValid$ = of(false);
  }

  ngOnInit(): void {
    this.volumeIcon$ = this.store.select(selectAudioVolumeIcon);
    this.loginValid$ = this.store.select(selectUserLoginValid);

  }

  loadHomePage(): void {
    this.audio.play_buttonPress();
    this.router.navigate(['']);
  }

  logout(): void {
    this.audio.play_buttonPress();

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

    const button = event.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
 
    this.dialog.open(AudioControlComponent, {
      width: `20rem`,
      disableClose: false,
      restoreFocus: true,
      hasBackdrop: true,
      backdropClass: 'transparent-backdrop',
      position: {
        top: `${buttonRect.bottom}px`,
        right: `2vh`,
      },
    });
  }
}

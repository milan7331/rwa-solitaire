import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/app/audio/audio.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  standalone: true
})
export class AboutComponent {
constructor(
    private readonly location: Location,
    private readonly router: Router,
    private readonly audio: AudioService,
  ) { }

  goBack(): void {
    this.audio.play_buttonPress();
    const referrer = document.referrer;
    const currentDomain = window.location.origin;

    if (referrer && new URL(referrer).origin === currentDomain) {
      this.location.back();
    } else {
      this.router.navigate(['']);
    }
  }
  
}

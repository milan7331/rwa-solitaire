import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  constructor(private router: Router) {

  }

  loadAboutPage(): void {
    this.router.navigate(["/about"]);
  }

  loadGamePage(game: string): void {
    switch (game) {
      case "klondike":
        this.router.navigate(["/klondike"]);
        break;

      case "spider":
        this.router.navigate(["/spider"]);  
        break;

      case "freecell":
        this.router.navigate(["/freecell"]);
        break;

      case "pyramid":
        this.router.navigate(["/pyramid"]);
        break;

      case "tripeaks":
        this.router.navigate(["/tripeaks"]);
        break;
    }
  }

  loadLeaderboardsPage(): void {
    this.router.navigate(["/leaderboards"]);
  }
}

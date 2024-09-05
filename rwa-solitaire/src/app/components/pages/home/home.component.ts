import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  aboutVisible: boolean = false;
  
  constructor(private router: Router) {

  }

  loadAboutPage(): void {
    this.aboutVisible = true;
  }

  loadSolitairePage(difficulty: string): void {
    switch (difficulty) {
      case "easy":
        this.router.navigate(["/solitaire"]);
        break;

      case "hard":
        this.router.navigate(["/solitaire"]);  
        break;

      default:
        this.router.navigate(["/*"]);
        break;
    }
  }

  loadLeaderboardsPage(): void {
    this.router.navigate(["/leaderboards"]);
  }
}

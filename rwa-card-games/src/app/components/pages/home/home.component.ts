import { Component, ApplicationRef} from '@angular/core';
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
        this.router.navigate(["/klondike"]);
        break;

      case "hard":
        this.router.navigate(["/klondike"]);  
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

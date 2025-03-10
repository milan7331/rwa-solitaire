import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TopBarComponent } from "./components/standalone/top-bar/top-bar.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TopBarComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  title = 'rwa-solitaire';
}

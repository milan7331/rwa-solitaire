import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { TopBarComponent } from "./components/standalone/top-bar/top-bar.component";
import { BgAnimationComponent } from './components/standalone/bg-animation/bg-animation.component';
import { sessionActions } from './store/actions/auth.actions';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TopBarComponent,
    BgAnimationComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnInit {
  title = 'rwa-solitaire';

  constructor(
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(sessionActions.validateSession());
  }
}

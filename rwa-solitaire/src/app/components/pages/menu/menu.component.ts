import { Component } from '@angular/core';
import { BgAnimationComponent } from '../../standalone/bg-animation/bg-animation.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { UserStatsComponent } from "../../standalone/user-stats/user-stats.component";

@Component({
  selector: 'app-menu',
  imports: [
    BgAnimationComponent,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    UserStatsComponent
],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  standalone: true,
})
export class MenuComponent {

}

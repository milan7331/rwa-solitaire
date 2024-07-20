import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { LeaderboardsComponent } from './pages/leaderboards/leaderboards.component';
import { TripeaksComponent } from './pages/tripeaks/tripeaks.component';
import { PyramidComponent } from './pages/pyramid/pyramid.component';
import { FreecellComponent } from './pages/freecell/freecell.component';
import { SpiderComponent } from './pages/spider/spider.component';
import { KlondikeComponent } from './pages/klondike/klondike.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'leaderboards', component: LeaderboardsComponent },
  { path: 'klondike', component: KlondikeComponent },
  { path: 'spider', component: SpiderComponent },
  { path: 'freecell', component: FreecellComponent },
  { path: 'pyramid', component: PyramidComponent },
  { path: 'tripeaks', component: TripeaksComponent },
  // { path: 'about', component: AboutComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

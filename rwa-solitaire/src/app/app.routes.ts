import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LeaderboardsComponent } from './components/pages/leaderboards/leaderboards.component';
import { SolitaireComponent } from './components/pages/solitaire/solitaire.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { AboutComponent } from './components/pages/about/about.component';
import { MenuComponent } from './components/pages/menu/menu.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'solitaire', component: SolitaireComponent },
    { path: 'leaderboards', component: LeaderboardsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'about', component: AboutComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: '**', component: PageNotFoundComponent },
];

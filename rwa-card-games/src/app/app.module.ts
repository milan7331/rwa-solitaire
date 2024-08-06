import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';

import { DockModule } from 'primeng/dock';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { DragDropModule } from 'primeng/dragdrop';
import { SpeedDialModule } from 'primeng/speeddial';

import { AppComponent } from './app.component';
import { SettingsMenuComponent } from './components/settings-menu/settings-menu.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { LeaderboardsComponent } from './pages/leaderboards/leaderboards.component';
import { AboutComponent } from './components/about/about.component';
import { KlondikeComponent } from './pages/klondike/klondike.component';
import { FreecellComponent } from './pages/freecell/freecell.component';
import { SpiderComponent } from './pages/spider/spider.component';
import { PyramidComponent } from './pages/pyramid/pyramid.component';
import { TripeaksComponent } from './pages/tripeaks/tripeaks.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { LoginComponent } from './pages/login/login.component';
import { UserDataComponent } from './pages/user-data/user-data.component';


@NgModule({
  declarations: [
    AppComponent,
    SettingsMenuComponent,
    TopBarComponent,
    HomeComponent,
    PageNotFoundComponent,
    LeaderboardsComponent,
    AboutComponent,
    KlondikeComponent,
    FreecellComponent,
    SpiderComponent,
    PyramidComponent,
    TripeaksComponent,
    RegistrationComponent,
    LoginComponent,
    UserDataComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    
    //StoreModule.forRoot<AppState>({ solitaireState: solitaireReducer }),
    
    DockModule,
    CardModule,
    ToolbarModule,
    ButtonModule,
    RadioButtonModule,
    SplitButtonModule,
    InputTextModule,
    SidebarModule,
    DragDropModule,
    SpeedDialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

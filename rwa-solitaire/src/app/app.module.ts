import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { DockModule } from 'primeng/dock';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { SpeedDialModule } from 'primeng/speeddial';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SliderModule } from 'primeng/slider';

import { AppComponent } from './app.component';
import { TopBarComponent } from './components/standalone/top-bar/top-bar.component';
import { HomeComponent } from './components/pages/home/home.component';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { LeaderboardsComponent } from './components/pages/leaderboards/leaderboards.component';
import { SolitaireComponent } from './components/pages/solitaire/solitaire.component';
import { RegistrationComponent } from './components/pages/registration/registration.component';
import { LoginComponent } from './components/pages/login/login.component';
import { UserDataComponent } from './components/pages/user-data/user-data.component';
import { AboutComponent } from './components/standalone/about/about.component';
import { AudioControlComponent } from './components/standalone/audio-control/audio-control.component';
import { BottomBarComponent } from './components/standalone/bottom-bar/bottom-bar.component';

import { appReducer } from './store/reducers/app.reducer';


@NgModule({
    declarations: [
        AppComponent,
        TopBarComponent,
        HomeComponent,
        PageNotFoundComponent,
        LeaderboardsComponent,
        SolitaireComponent,
        RegistrationComponent,
        LoginComponent,
        UserDataComponent,
        AboutComponent,
        AudioControlComponent,
        BottomBarComponent,
    ],
    bootstrap: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,


        // import efekte posebno za app i za features kasnije!!
        StoreModule.forRoot(appReducer),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: !isDevMode(),
            autoPause: true,
            trace: false,
            traceLimit: 50
        }),

        DockModule,
        CardModule,
        ToolbarModule,
        ButtonModule,
        RadioButtonModule,
        SplitButtonModule,
        InputTextModule,
        SidebarModule,
        FieldsetModule,
        DialogModule,
        DragDropModule,
        SpeedDialModule,
        OverlayPanelModule,
        SliderModule,
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi())
    ]
}) 
export class AppModule { }

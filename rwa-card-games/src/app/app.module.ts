import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';

import { DockModule } from 'primeng/dock'
import { CardModule } from 'primeng/card'
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { DragDropModule } from 'primeng/dragdrop';

import { AppComponent } from './app.component';
import { TopBarComponent } from './core/components/top-bar/top-bar.component';
import { DockComponent } from './core/components/dock/dock.component';
import { TestComponentComponent } from './core/components/test-component/test-component.component';
import { MainMenuComponent } from './core/components/main-menu/main-menu.component';
import { TestComponent2Component } from './core/components/test-component-2/test-component-2.component';
import { CardTestComponent } from './core/components/card-test/card-test.component';
import { AppState } from './state/app.state';
import { solitaireReducer } from './solitaire/store/solitaire.reducer';


@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    DockComponent,
    TestComponentComponent,
    MainMenuComponent,
    TestComponent2Component,
    CardTestComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    
    StoreModule.forRoot({ solitaireState: solitaireReducer }),
    
    DockModule,
    CardModule,
    ToolbarModule,
    ButtonModule,
    RadioButtonModule,
    SplitButtonModule,
    InputTextModule,
    SidebarModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

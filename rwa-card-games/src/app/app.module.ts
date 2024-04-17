import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

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


@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    DockComponent,
    TestComponentComponent,
    MainMenuComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';

import { ContainerComponent } from './components/container/container.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    ContainerComponent,
    NavigationBarComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports: [
    ContainerComponent,
  ]
})
export class CoreModule { }

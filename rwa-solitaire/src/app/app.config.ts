import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import { definePreset } from '@primeng/themes';

import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import Material from '@primeng/themes/Material';
import Nora from '@primeng/themes/nora';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { rootReducer } from './store/reducers/app.reducer';


export const myPreset = definePreset(
  Aura, {
    

  }
)

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(rootReducer),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: myPreset,
        // options: {
        //   darkModeSelector: '.dark'
        // }
      }
    })
  ]
};

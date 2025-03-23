import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools} from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { rootReducer } from './store/reducers/app.reducer';
import { provideEffects } from '@ngrx/effects';

import { AuthEffects } from './store/effects/auth.effects';
import { UserEffects } from './store/effects/user.effects';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(rootReducer),
    provideEffects([
      AuthEffects,
      UserEffects
    ]),
    provideHttpClient(),
    provideStoreDevtools({
      maxAge: 25,
    }),
    provideAnimationsAsync(),
  ]
};

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools} from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { rootReducer } from './store/reducers/app.reducer';
import { provideEffects } from '@ngrx/effects';
import { UserEffects } from './store/effects/user.effects';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NavigationEffects } from './store/effects/navigation.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideStore(rootReducer),
    provideEffects([
      UserEffects,
      NavigationEffects
    ]),
    provideStoreDevtools({
      maxAge: 25,
    }),
    provideAnimationsAsync(),
  ]
};

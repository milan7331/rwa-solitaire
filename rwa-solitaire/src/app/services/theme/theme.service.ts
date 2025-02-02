import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  #lightModeInternal: WritableSignal<boolean> = signal(false);
  lightMode: Signal<boolean> = computed(() => this.#lightModeInternal());

  constructor() {
  }

  toggleLightMode(): void {
    document.body.classList.toggle('light-mode');
    this.#lightModeInternal.update((currentMode) => !currentMode);
    console.log(this.lightMode());
  }
}

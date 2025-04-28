import { Injectable } from '@angular/core';
import { LocalStorageKeys } from '../../../models/local-storage/local-storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}

  setUsername(username: string): void {
    localStorage.setItem(LocalStorageKeys.USERNAME, username);
  }

  setAudioVolume(volume: number): void {
    localStorage.setItem(LocalStorageKeys.VOLUME, JSON.stringify(volume));
  }

  setAudioMuted(isMuted: boolean): void {
    localStorage.setItem(LocalStorageKeys.MUTED, JSON.stringify(isMuted));
  }

  setThemeLightMode(isLightMode: boolean): void {
    localStorage.setItem(LocalStorageKeys.LIGHTMODE, JSON.stringify(isLightMode));
  }

  getUsername(): string | null {
    try {
      const item = localStorage.getItem(LocalStorageKeys.USERNAME);
      if (item === null) return null;

      const parsed = JSON.parse(item);
      return typeof parsed === 'string' ? parsed : null;
    } catch {
      return null;
    }
  }

  getAudioVolume(): number | null {
    try {
      const item = localStorage.getItem(LocalStorageKeys.VOLUME);
      if (item === null) return null;

      const parsed = JSON.parse(item);
      return typeof parsed === 'number' ? parsed : null;
    } catch {
      return null;
    }
  }

  getAudioMuted(): boolean | null {
    try {
      const item = localStorage.getItem(LocalStorageKeys.MUTED);
      if (item === null) return null;

      const parsed = JSON.parse(item);
      return typeof parsed === 'boolean' ? parsed : null;
    } catch {
      return null;
    }
  }

  getThemeLightMode(): boolean | null {
    try {
      const item = localStorage.getItem(LocalStorageKeys.LIGHTMODE);
      if (item === null) return null;

      const parsed = JSON.parse(item);
      return typeof parsed === 'boolean' ? parsed : null;
    } catch {
      return null;
    }
  }

  removeUsername(): void {
    localStorage.removeItem(LocalStorageKeys.USERNAME);
  }

  removeAudioVolume(): void {
    localStorage.removeItem(LocalStorageKeys.VOLUME);
  }

  removeAudioMuted(): void {
    localStorage.removeItem(LocalStorageKeys.MUTED);
  }

  removeThemeLightMode(): void {
    localStorage.removeItem(LocalStorageKeys.LIGHTMODE);
  }
}

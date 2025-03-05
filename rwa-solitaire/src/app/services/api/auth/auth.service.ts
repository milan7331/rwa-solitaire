import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #apiUrl = environment.apiUrl + '/auth';

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    const url = this.#apiUrl + '/login';
    const loginData = { username, password };

    return this.http.post(url, loginData, { withCredentials: true, observe: 'response' }).pipe(
      map(response => {
        return response.ok;
      })
    );
  }

  logout(): Observable<boolean> {
    const url = this.#apiUrl + '/logout';

    return this.http.post(url, {}, { withCredentials: true, observe: 'response' }).pipe(
      map(response => {
        return response.ok;
      })
    );
  }

  validateSession(): Observable<boolean> {
    const url = this.#apiUrl + '/validate-session';

    return this.http.post(url, {}, { withCredentials: true, observe: 'response' }).pipe(
      map(response => {
        return response.ok
      })
    );
  }
}

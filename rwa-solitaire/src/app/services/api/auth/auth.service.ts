import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #apiUrl = environment.apiUrl + '/auth';

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<void> {
    const url = this.#apiUrl + '/login';
    const data = { username, password };

    return this.http.post<void>(url, data, { withCredentials: true });
  }

  logout(): Observable<void> {
    const url = this.#apiUrl + '/logout';

    return this.http.delete<void>(url, { withCredentials: true });
  }

  validateSession(username: string): Observable<void> {
    const url = this.#apiUrl + '/validate-session';
    const data = { username };

    return this.http.post<void>(url, data, { withCredentials: true });
  }
}

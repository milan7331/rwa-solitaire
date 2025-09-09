import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, throwError, timeout } from 'rxjs';
import { User } from '../../../models/user/user';
import { GameHistory } from '../../../models/user/game-history';
import { UserStats } from '../../../models/user/user-stats';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  #userUrl = environment.apiUrl + '/user';
  #statsUrl = environment.apiUrl + '/stats';
  #historyUrl = environment.apiUrl + '/history';

  constructor(private readonly http: HttpClient) {}

  register(
    email: string,
    username: string,
    password: string,
    firstname?: string,
    lastname?: string,
  ): Observable<void> {
    const url = this.#userUrl + '/register';

    const data: any = { email, username, password };
    if (firstname && firstname.length > 0) data.firstname = firstname;
    if (lastname && lastname.length > 0) data.lastname = lastname;
    
    return this.http.post<void>(url, data, { withCredentials: true }).pipe(
      timeout(30000),
      catchError(error => {
        if (error.name === 'TimeoutError') return throwError(() => new Error('Registration request timed out. The server may be down or unresponsive.'));
        return throwError(() => error);
      }),
    );
  }

  getUser(username: string): Observable<User> {
    if (!username) return throwError(() => new Error('Failed to load user data, input parameters invalid!'));

    const url = this.#userUrl + '/find-one';

    return this.http.get<User>(url, { withCredentials: true, params: { username }});
  }

  getUserStats(username: string): Observable<UserStats> {
    if (!username) return throwError(() => new Error('Failed to load user stats, input parameters invalid!'));

    const url = this.#statsUrl + '/find-one';

    return this.http.get<any>(url, { withCredentials: true, params: { username }});
  }

  getUserGameHistory(username: string): Observable<GameHistory[]> {
    if (!username) return throwError(() => new Error('Failed to load user game history, input parameters invalid!'));

    const url = this.#historyUrl + '/get-all-games-user';

    return this.http.get<GameHistory[]>(url, { withCredentials: true, params: { username }});
  }

  checkUsernameAvailable(username: string): Observable<boolean> {
    if (username === null || username === undefined || username.length < 1) return of(false);

    const url = this.#userUrl + '/check-username';
    return this.http.get<void>(url, { params: { username }}).pipe(
      // http 200 -> true
      map(() => true),
      // http 400/409 -> false
      // and rethrow other errors
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 || error.status === 409) return of(false);
        return throwError(() => error);
      })
    );
  }

  checkEmailAvailable(email: string): Observable<boolean> {
    if (email === null || email === undefined || email.length < 1) return of(false);

    const url = this.#userUrl + '/check-email';
    return this.http.get<void>(url, { params: { email }}).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 || error.status === 409) return of(false);
        return throwError(() => error);
      })
    );
  }
}

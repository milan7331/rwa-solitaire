import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserData } from '../../../models/user/user-data';
import { GameHistory } from '../../../models/user/game-history';
import { UserStats } from '../../../models/user/user-stats';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  #userUrl = environment.apiUrl + '/user';
  #statsUrl = environment.apiUrl + '/stats';
  #historyurl = environment.apiUrl + '/history';


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
    if (firstname) data.firstname = firstname;
    if (lastname) data.lastname = lastname;

    return this.http.post<void>(url, data, {});
  }

  getUserData(username: string): Observable<UserData> {
    if (!username) return throwError(() => new Error('Failed to load user data, input parameters invalid!'));

    const url = this.#userUrl + '/find';
    
    return this.http.get<any>(url, { withCredentials: true, params: { username }});
  }
  
  getUserStats(username: string): Observable<UserStats> {
    if (!username) return throwError(() => new Error('Failed to load user stats, input parameters invalid!'));

    const url = this.#statsUrl + '/find';

    return this.http.get<any>(url, { withCredentials: true, params: { username }});
  }

  getUserGameHistory(username: string): Observable<GameHistory> {
    if (!username) return throwError(() => new Error('Failed to load user game history, input parameters invalid!'));

    const url = this.#historyurl + '/get-all-games-user';

    return this.http.get<any>(url, { withCredentials: true, params: { username }});
  }
}
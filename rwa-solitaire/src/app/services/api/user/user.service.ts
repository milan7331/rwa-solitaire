import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { UserState } from '../../../models/state/user.state';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  #apiUrl = environment.apiUrl + '/user';

  constructor(private readonly http: HttpClient) {}

  register(
    email: string,
    username: string,
    password: string
  ): Observable<boolean> {
    const url = this.#apiUrl + '/register';
    const data = { email, username, password };

    return this.http.post(url, data, { observe: 'response'}).pipe(
      map(response => {
        return response.ok;
      })
    )
  }

  getCompleteUserData(
    email?: string,
    username?: string,
    password?: string,
    withRelations: boolean = false,
  ): Observable<UserState | undefined> {
    if (!email && !username && !password) return of(undefined);

    const url = this.#apiUrl + '/find-one';
    const data: any = {};
    data.withRelations = withRelations;
    if (email) data.email = email;
    if (username) data.username = username;
    if (password) data.password = password;

    this.http.get(url, { withCredentials: true}, )



    return of(undefined);
  }

  getUserData() {
    
  }
  
  getUserStats() {
    
  }

  getUserGameHistory() {

  }
    
  getSavedGame() {

  }
}
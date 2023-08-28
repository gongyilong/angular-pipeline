import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as serverAddress from '../../config/serve.address';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) { }

  private serveUrl = `/back/api/v1/login`;

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<any>(this.serveUrl, {username: username, password: password})
      .pipe(
        map(result => {
          if(result.status){
            localStorage.setItem('access_token', result.token);
            localStorage.setItem('user_role', result.data[0].Role);
            localStorage.setItem('user_name', username);
            return true;
          }else{
            return false;
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_name');
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }

  public get userName(): string {
    return (localStorage.getItem('user_name'));
  }

  public get userRole(): string {
    return (localStorage.getItem('user_role'));
  }
}

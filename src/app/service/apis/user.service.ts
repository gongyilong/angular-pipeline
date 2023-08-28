import { Injectable } from '@angular/core';
import * as serverAddress from '../../config/serve.address';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../../model/user'
import { ErroHandle } from '../../helper/erro/error';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private servesUrl = serverAddress.back_url;

  constructor(private http: HttpClient, private erroHandle: ErroHandle) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /******* GET方法 *******/
  /**
   * 获取服务列表
   */
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`/back/api/v1/getAllUsers`)
      .pipe(
        tap(_ => this.erroHandle.log('fetched users')),
        catchError(this.erroHandle.handleError<any>('getAllUsers', []))
      );
  }

  /******* POST方法 *******/
  /**
   * 增加一条服务记录
   */
  addUser(user: User): Observable<User> {
    return this.http.post<User>(`/back/api/v1/addUser`, user, this.httpOptions).pipe(
      tap((newUser: User) => this.erroHandle.log(`added user w/ id=${newUser.Id}`)),
      catchError(this.erroHandle.handleError<User>('addUser'))
    );
  }

  /******* POST方法 *******/
  /**
   * 根据Id删除记录 
   */
  deleteUser(id: number): Observable<User> {
    return this.http.post<User>(`/back/api/v1/deleteUser`, { id: id }, this.httpOptions).pipe(
      tap(_ => this.erroHandle.log(`deleted user id=${id}`)),
      catchError(this.erroHandle.handleError<User>('deleteUser'))
    );
  }

  /******* POST方法 *******/
  /**
   * 更新服务信息
   */
  updateUser(user: User): Observable<any> {
    return this.http.post(`/back/api/v1/updateUser`, user, this.httpOptions).pipe(
      tap(_ => this.erroHandle.log(`updated user id=${user.Id}`)),
      catchError(this.erroHandle.handleError<any>('updateUser'))
    );
  }

  /******* POST方法 *******/
  /**
   * 获取用户信息（根据名称）
   */
  getUserByName(username: string): Observable<any> {
    return this.http.post<any>(`/back/api/v1/getUserByName`, {username: username}, this.httpOptions).pipe(
      tap(_ => this.erroHandle.log(`getUserByName name=${username}`)),
      catchError(this.erroHandle.handleError<any>('getUserByName'))
    );
  }

}

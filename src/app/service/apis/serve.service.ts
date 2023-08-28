import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ErroHandle } from '../../helper/erro/error';
import { Serve } from '../../model/serve';
import { CServe } from '../../model/cserve';
import * as serverAddress from '../../config/serve.address';

@Injectable({
  providedIn: 'root'
})
export class ServeService {

  private servesUrl = serverAddress.back_url;

  constructor(private http: HttpClient, private erroHandle: ErroHandle) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /******* GET方法 *******/
  /**
   * 获取服务列表
   */
  getAllServes(): Observable<any> {
    return this.http.get<any>(`/back/api/v1/getAllServes`)
      .pipe(
        tap(_ => this.erroHandle.log('fetched serves')),
        catchError(this.erroHandle.handleError<any>('getAllServes', []))
      );
  }

  getMapServeParam(url): Observable<any> {
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.erroHandle.log('fetched serves')),
        catchError(this.erroHandle.handleError<any>('getMapServeParam', []))
      );
  }

  /**
 * 获取服务列表
 */
  getAllCServes(): Observable<any> {
    return this.http.get<any>(`/back/api/v1/getAllCServes`)
      .pipe(
        tap(_ => this.erroHandle.log('fetched serves')),
        catchError(this.erroHandle.handleError<any>('getAllCServes', []))
      );
  }

  /******* POST方法 *******/
  /**
   * 增加一条服务记录
   */
  addServe(serve: Serve): Observable<Serve> {
    return this.http.post<Serve>(`/back/api/v1/addServe`, serve, this.httpOptions).pipe(
      tap((newServe: Serve) => this.erroHandle.log(`added serve w/ id=${newServe.Id}`)),
      catchError(this.erroHandle.handleError<Serve>('addServe'))
    );
  }

  addCServe(cserve: CServe): Observable<CServe> {
    return this.http.post<CServe>(`/back/api/v1/addCServe`, cserve, this.httpOptions).pipe(
      tap((newCServe: CServe) => this.erroHandle.log(`added cserve w/ id=${newCServe.Id}`)),
      catchError(this.erroHandle.handleError<CServe>('addCServe'))
    );
  }

  /******* POST方法 *******/
  /**
   * 根据Id删除记录
   * @param serve
   */
  deleteServe(id: number): Observable<Serve> {
    return this.http.post<Serve>(`/back/api/v1/deleteServe`, { id: id }, this.httpOptions).pipe(
      tap(_ => this.erroHandle.log(`deleted serve id=${id}`)),
      catchError(this.erroHandle.handleError<Serve>('deleteServe'))
    );
  }

  deleteCServe(id: number): Observable<CServe> {
    return this.http.post<CServe>(`/back/api/v1/deleteCServe`, { id: id }, this.httpOptions).pipe(
      tap(_ => this.erroHandle.log(`deleted cserve id=${id}`)),
      catchError(this.erroHandle.handleError<CServe>('deleteCServe'))
    );
  }

  /******* POST方法 *******/
  /**
   * 更新服务信息
   * @param serve
   */
  updateServe(serve: Serve): Observable<any> {
    return this.http.post(`/back/api/v1/updateServe`, serve, this.httpOptions).pipe(
      tap(_ => this.erroHandle.log(`updated serve id=${serve.Id}`)),
      catchError(this.erroHandle.handleError<any>('updateServe'))
    );
  }

  updateCServe(cserve: CServe): Observable<any> {
    return this.http.post(`/back/api/v1/updateCServe`, cserve, this.httpOptions).pipe(
      tap(_ => this.erroHandle.log(`updated cserve id=${cserve.Id}`)),
      catchError(this.erroHandle.handleError<any>('updateCServe'))
    );
  }

  /******* POST方法 *******/
  /**
   * 根据type获取记录
   * @param serve
   */
  getServeByType(type: string): Observable<any> {
    return this.http.post<any>(`/back/api/v1/getServeByType`, { type: type }, this.httpOptions).pipe(
      tap(_ => this.erroHandle.log(`getServeByType type=${type}`)),
      catchError(this.erroHandle.handleError<any>('getServeByType'))
    );
  }


}

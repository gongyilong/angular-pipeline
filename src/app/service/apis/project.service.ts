import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ErroHandle } from '../../helper/erro/error';
import { Project } from '../../model/project';
import * as serverAddress from '../../config/serve.address';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private servesUrl = serverAddress.back_url;

  constructor(private http: HttpClient, private erroHandle: ErroHandle) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /******* GET方法 *******/
  /**
   * 获取工程项目信息列表
   */
  getAllProjects(): Observable<any> {
    return this.http.get<any>(`/back/api/v1/getAllProjects`)
      .pipe(
        tap(_ => this.erroHandle.log('fetched serves')),
        catchError(this.erroHandle.handleError<any>('getAllProjects', []))
      );
  }

  /******* POST方法 *******/
  /**
   * 增加一条记录
   */
  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`/back/api/v1/addProject`, project, this.httpOptions).pipe(
      tap((newProject: Project) => this.erroHandle.log(`added project w/ id=${newProject.Id}`)),
      catchError(this.erroHandle.handleError<Project>('addProject'))
    );
  }

  /******* POST方法 *******/
  /**
   * 根据Id删除记录
   * @param id 
   */
  deleteProject(id: number): Observable<Project> {
    return this.http.post<Project>(`/back/api/v1/deleteProject`, { id: id }, this.httpOptions).pipe(
      tap(_ => this.erroHandle.log(`deleted project id=${id}`)),
      catchError(this.erroHandle.handleError<Project>('deleteProject'))
    );
  }

  /******* POST方法 *******/
  /**
   * 更新服务信息
   * @param project 
   */
  updateProject(project: Project): Observable<any> {
    return this.http.post(`/back/api/v1/updateProject`, project, this.httpOptions).pipe(
      tap(_ => this.erroHandle.log(`updated project id=${project.Id}`)),
      catchError(this.erroHandle.handleError<any>('updateProject'))
    );
  }

  /******* POST方法 *******/
  /**
   * 更新服务信息
   * @param serve 
   */
   getProjectByName(name: any): Observable<any> {
    return this.http.post<any>(`/back/api/v1/getProjectByName`, {prjName: name}, this.httpOptions).pipe(
      tap(_ => this.erroHandle.log(`getProjectByName prjName=${name}`)),
      catchError(this.erroHandle.handleError<any>('getProjectByName'))
    );
  }
}

import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  private subject1 = new BehaviorSubject(null);
  ob1 = this.subject1.asObservable();

  private subject2 = new BehaviorSubject(null);
  ob2 = this.subject2.asObservable();

  private subject3 = new BehaviorSubject(null);
  ob3 = this.subject3.asObservable();
  constructor() { }

  emitView(view){
    this.subject1.next(view);
  }

  emitMap(map){
    this.subject2.next(map);
  }

  emitGraphic(graphic){
    this.subject3.next(graphic);
  }
}

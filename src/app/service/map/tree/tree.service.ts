import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  
  private subject = new BehaviorSubject([]);

  ob = this.subject.asObservable();
  
  constructor() { }

  emitTree(tree){
    // console.log(tree);
    this.subject.next(tree);
  }
}

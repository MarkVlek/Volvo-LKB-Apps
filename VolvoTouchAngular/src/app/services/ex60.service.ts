import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class Ex60Category {
  name: string;
  id: string;
  src: string;  // Image source path
  copy: string; // Description text
  filterName?: string;
  filterInfo?: string;
  filterType?: string;
  items?: any[];
  categories?: any[];

  constructor(name: string, id: string, src: string, copy: string) {
    this.name = name;
    this.id = id;
    this.src = src;
    this.copy = copy;
    this.items = [];
    this.categories = [];
  }
}

@Injectable({
  providedIn: 'root'
})
export class Ex60Service {
  public currentSelected$ = new BehaviorSubject<Ex60Category | null>(null);
  
  private categories: Ex60Category[] = [
    new Ex60Category(
      'ex60.funktioner.title', 
      'funktioner', 
      'assets/images/AppSpecific/EX60/Funktioner-3-frame.png', 
      'ex60.funktioner.description'
    ),
    new Ex60Category(
      'ex60.elektrifiering.title', 
      'elektrifiering', 
      'assets/images/AppSpecific/EX60/Elektrifiering.png', 
      'ex60.elektrifiering.description'
    ),
    new Ex60Category(
      'ex60.leasing.title', 
      'leasing', 
      'assets/images/AppSpecific/EX60/Leasing-3-frame.png', 
      'ex60.leasing.description'
    ),
    new Ex60Category(
      'ex60.app.title', 
      'app',
      'assets/images/AppSpecific/EX60/AR-3-frame.png',
      'ex60.app.description'
    )
  ];

  getCategoryTypes(): Ex60Category[] {
    return this.categories;
  }

  setStartCategory(category: Ex60Category) {
    this.currentSelected$.next(category);
  }
}
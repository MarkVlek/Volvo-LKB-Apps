// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// export class Ex60Category {
//   name: string;
//   id: string;
//   src: string;  // Image source path
//   copy: string; // Description text
//   filterName?: string;
//   filterInfo?: string;
//   filterType?: string;
//   items?: any[];
//   categories?: any[];

//   constructor(name: string, id: string, src: string, copy: string) {
//     this.name = name;
//     this.id = id;
//     this.src = src;
//     this.copy = copy;
//     this.items = [];
//     this.categories = [];
//   }
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class Ex60Service {
//   public currentSelected$ = new BehaviorSubject<Ex60Category | null>(null);
  
//   private categories: Ex60Category[] = [
//     new Ex60Category(
//       'Funktioner', 
//       'funktioner', 
//       'assets/images/ex60/funktioner.jpg', 
//       'Upptäck avancerade funktioner och teknologi'
//     ),
//     new Ex60Category(
//       'Elektrifiering', 
//       'elektrifiering', 
//       'assets/images/ex60/elektrifiering.jpg', 
//       'Hållbar mobilitet för framtiden'
//     ),
//     new Ex60Category(
//       'Leasing', 
//       'leasing', 
//       'assets/images/ex60/leasing.jpg', 
//       'Flexibla leasingalternativ för din EX60'
//     ),
//     new Ex60Category(
//       'App', 
//       'app',
//       'assets/images/ex60/app.jpg', 
//       'Ta med EX60 hem'
//     )
//   ];

//   getCategoryTypes(): Ex60Category[] {
//     return this.categories;
//   }

//   setStartCategory(category: Ex60Category) {
//     this.currentSelected$.next(category);
//   }
// }
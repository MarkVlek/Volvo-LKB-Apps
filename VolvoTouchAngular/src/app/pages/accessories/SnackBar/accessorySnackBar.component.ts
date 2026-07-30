// custom-snackbar.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  template: `
  <div class="snackbar-overlay">
    <div class="custom-snackbar-container">
      <h2 class="snackbar-title">{{ data.title }}</h2>
      <p class="snackbar-text">{{ data.message }}</p>
      <button class="snackbar-close" (click)="closeSnackbar()">&#10005;</button>
    </div>
  </div>
  `,
  styles: [`
    .snackbar-overlay {
  position: fixed;
  margin-top: 50px;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.custom-snackbar-container {
  position: fixed;
  margin-top: -627px;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  color: black;
  border-radius: 8px;
  padding: 2rem 3rem;
  width: 550px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  z-index: 1001;
}

.snackbar-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
  font-family: "Volvo Novum-Regular";
}

.snackbar-text {
  font-size: 1rem;
  text-align: center;
  margin-top: 23px;
  font-family: "Volvo Novum-Regular";
}

.snackbar-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
}
  `]
})
export class CustomSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { title: string; message: string },
    public snackBarRef: MatSnackBarRef<CustomSnackbarComponent>
  ) {}

  closeSnackbar() {
    this.snackBarRef.dismiss();
  }
}
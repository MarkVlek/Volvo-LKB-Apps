import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ex60LeasingComponent } from './ex60-leasing.component';

describe('Ex60LeasingComponent', () => {
  let component: Ex60LeasingComponent;
  let fixture: ComponentFixture<Ex60LeasingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Ex60LeasingComponent]
    });
    fixture = TestBed.createComponent(Ex60LeasingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

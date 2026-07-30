import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ex60LandingComponent } from './ex60-landing.component';

describe('Ex60LandingComponent', () => {
  let component: Ex60LandingComponent;
  let fixture: ComponentFixture<Ex60LandingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Ex60LandingComponent]
    });
    fixture = TestBed.createComponent(Ex60LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

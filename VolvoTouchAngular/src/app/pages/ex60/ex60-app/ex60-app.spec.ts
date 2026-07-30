import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ex60App } from './ex60-app';

describe('Ex60App', () => {
  let component: Ex60App;
  let fixture: ComponentFixture<Ex60App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ex60App]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ex60App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

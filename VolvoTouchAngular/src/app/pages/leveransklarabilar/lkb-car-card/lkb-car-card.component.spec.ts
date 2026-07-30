import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LkbCarCardComponent } from './lkb-car-card.component';

describe('LkbCarCardComponent', () => {
  let component: LkbCarCardComponent;
  let fixture: ComponentFixture<LkbCarCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LkbCarCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LkbCarCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryMainItemViewSurfaceComponent } from './delivery-main-item-view-surface.component';

describe('DeliveryMainItemViewSurfaceComponent', () => {
  let component: DeliveryMainItemViewSurfaceComponent;
  let fixture: ComponentFixture<DeliveryMainItemViewSurfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryMainItemViewSurfaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryMainItemViewSurfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

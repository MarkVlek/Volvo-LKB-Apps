import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryMainItemViewVcsComponent } from './delivery-main-item-view-vcs.component';

describe('DeliveryMainItemViewVcsComponent', () => {
  let component: DeliveryMainItemViewVcsComponent;
  let fixture: ComponentFixture<DeliveryMainItemViewVcsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryMainItemViewVcsComponent]
    });
    fixture = TestBed.createComponent(DeliveryMainItemViewVcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

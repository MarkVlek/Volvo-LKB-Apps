import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryModelSelectorComponent } from './delivery-model-selector.component';

describe('DeliveryModelSelectorComponent', () => {
  let component: DeliveryModelSelectorComponent;
  let fixture: ComponentFixture<DeliveryModelSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryModelSelectorComponent]
    });
    fixture = TestBed.createComponent(DeliveryModelSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ex60CategoryImageComponent } from './ex60-category-image.component';

describe('Ex60CategoryImageComponent', () => {
  let component: Ex60CategoryImageComponent;
  let fixture: ComponentFixture<Ex60CategoryImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Ex60CategoryImageComponent]
    });
    fixture = TestBed.createComponent(Ex60CategoryImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

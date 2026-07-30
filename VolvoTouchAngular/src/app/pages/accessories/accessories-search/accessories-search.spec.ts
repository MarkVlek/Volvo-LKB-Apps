import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessoriesSearchComponent } from './accessories-search';


describe('AccessoriesSearchComponent', () => {
  let component: AccessoriesSearchComponent;
  let fixture: ComponentFixture<AccessoriesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessoriesSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessoriesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

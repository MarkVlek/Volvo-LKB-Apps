import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LkbComponent } from './lkb.component';
import { LkbService } from '../../../services/lkb.service';

/**
 * A screen with no dealership configured shows no vehicles by design, so the visitor has to be
 * told that rather than left staring at an empty list.
 */
describe('LkbComponent — empty inventory', () => {

  let fixture: ComponentFixture<LkbComponent>;
  let lkbService: any;

  beforeEach(() => {
    lkbService = {
      inventoryLoaded$: new BehaviorSubject<boolean>(false),
      unfilteredCars: [],
      sideBar: true,
    };

    TestBed.configureTestingModule({
      declarations: [LkbComponent],
      providers: [
        { provide: LkbService, useValue: lkbService },
        { provide: ActivatedRoute, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(LkbComponent);
  });

  function screenText(): string {
    fixture.detectChanges();
    return fixture.nativeElement.textContent;
  }

  it('stays quiet while the inventory is still loading', () => {
    expect(screenText()).not.toContain('inga bilar');
  });

  it('tells the visitor there are no cars once an empty inventory has loaded', () => {
    lkbService.inventoryLoaded$.next(true);

    expect(screenText()).toContain('inga bilar');
  });

  it('shows the list instead when the inventory has cars', () => {
    lkbService.unfilteredCars = [{}];
    lkbService.inventoryLoaded$.next(true);

    expect(screenText()).not.toContain('inga bilar');
  });
});

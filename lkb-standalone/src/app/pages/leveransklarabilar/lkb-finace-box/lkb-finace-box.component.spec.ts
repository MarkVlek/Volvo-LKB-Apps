import { fakeAsync, tick } from '@angular/core/testing';
import { LkbFinaceBoxComponent } from './lkb-finace-box.component';
import { AnalyticsService } from '../../../services/analytics.service';
import { VolvoLeveransklarabilar } from '../models/LkbCategory';

describe('LkbFinaceBoxComponent', () => {

  const analyticsStub = { track: () => { } } as unknown as AnalyticsService;

  function makeCar(): VolvoLeveransklarabilar {
    return { price: 500000, interestRate: '7.95' } as VolvoLeveransklarabilar;
  }

  it('does not throw when the car input has not arrived yet', fakeAsync(() => {
    const component = new LkbFinaceBoxComponent(analyticsStub);
    component.car = undefined;

    // The detail page renders this box before its vehicle fetch resolves. ngAfterViewInit waits
    // 100ms and then reads the car, so a slower-than-100ms API response used to throw
    // "Cannot read properties of undefined (reading 'interestRate')".
    expect(() => { component.ngAfterViewInit(); tick(100); }).not.toThrow();
  }));

  it('still calculates the monthly cost once a car is present', fakeAsync(() => {
    const component = new LkbFinaceBoxComponent(analyticsStub);
    component.car = makeCar();

    component.ngAfterViewInit();
    tick(100);

    expect(component.startPrice).toBe(100000);   // 20% of 500 000
    expect(component.currentCost).toBeGreaterThan(0);
  }));
});

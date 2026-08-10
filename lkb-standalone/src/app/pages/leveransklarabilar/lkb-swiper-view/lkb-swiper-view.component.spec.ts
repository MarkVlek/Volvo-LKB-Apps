import { LkbSwiperViewComponent } from './lkb-swiper-view.component';
import { AnalyticsService } from '../../../services/analytics.service';
import { VolvoLeveransklarabilar } from '../models/LkbCategory';

describe('LkbSwiperViewComponent', () => {

  let tracked: Array<{ userTriggered: boolean, type: string, details: string }>;
  let component: LkbSwiperViewComponent;

  /** beforeTransitionStart hands Swiper's own object through; only these two fields are read. */
  function transitionTo(activeIndex: number, previousIndex = 0) {
    component.onBeforeTransitionImage([{ activeIndex, previousIndex }] as any);
  }

  beforeEach(() => {
    tracked = [];
    const analyticsStub = {
      track: (userTriggered: boolean, type: string, details: string) =>
        tracked.push({ userTriggered, type, details })
    } as unknown as AnalyticsService;

    component = new LkbSwiperViewComponent(analyticsStub);
    component.car = { title: 'XC60 B4 AWD', modelYear: 2023 } as VolvoLeveransklarabilar;
    component.mediaList = [
      { url: 'a', name: 'a', SortOrder: 0 },
      { url: 'b', name: 'b', SortOrder: 1 },
      { url: 'c', name: 'c', SortOrder: 2 },
    ];
    // Reached only when an index lands on a multiple of 4; stubbed so it can never be the reason
    // a test fails.
    component.listSwiper = { swiperRef: { slideTo: () => { } } } as any;
  });

  it('reports each new photo as it is viewed', () => {
    transitionTo(1);
    transitionTo(2, 1);

    const gallery = tracked.filter(e => e.type === 'Gallery');
    expect(gallery.length).toBe(2);
    expect(gallery[0].userTriggered).toBeTrue();
    expect(gallery[0].details).toContain('photo 2 of 3');
    expect(gallery[1].details).toContain('photo 3 of 3');
    expect(gallery[0].details).toContain('XC60 B4 AWD');
  });

  it('does not report the same photo twice', () => {
    transitionTo(1);
    transitionTo(2, 1);
    transitionTo(1, 2);   // back to a photo already seen

    expect(tracked.filter(e => e.type === 'Gallery').length).toBe(2);
  });

  it('does not report the opening photo, which nobody chose to view', () => {
    transitionTo(0, 1);

    expect(tracked.filter(e => e.details.includes('photo 1 of'))).toEqual([]);
  });

  it('summarises how much of the gallery was browsed on the way out', () => {
    transitionTo(1);
    transitionTo(2, 1);
    component.ngOnDestroy();

    const summary = tracked.filter(e => e.details.startsWith('Browsed'));
    expect(summary.length).toBe(1);
    expect(summary[0].details).toContain('Browsed 3 of 3 images');
    expect(summary[0].userTriggered).toBeFalse();
  });

  it('says nothing when the visitor never left the first photo', () => {
    component.ngOnDestroy();

    expect(tracked).toEqual([]);
  });
});

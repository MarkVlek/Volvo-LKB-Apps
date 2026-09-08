import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { HarmonyConfigService } from './harmony-config.service';

/**
 * Covers the session state machine — the only part of the analytics system with logic that can be
 * wrong in a way the compiler will not catch. Event call sites are verified by the console stream
 * described in docs/superpowers/specs/2026-08-05-lkb-analytics-design.md.
 */
describe('AnalyticsService', () => {

  const IDLE_SECONDS = 10;

  let sentEvents: Array<{ userTriggered: boolean, sessionId: string, params: any }>;
  let originalLoader: any;

  /** Installs a fake player. `settle` resolves the pending session-id promise on demand. */
  function installLoader(options: { resolvesWith?: string, rejects?: boolean, hangs?: boolean }) {
    let resolveId: (id: string) => void = () => { };
    let rejectId: () => void = () => { };

    const promise = new Promise<string>((resolve, reject) => {
      resolveId = resolve;
      rejectId = reject;
    });

    (window as any).Loader = {
      getNewAnalyticsSessionIdPromise: () => promise,
      createAnalyticsEvent: (userTriggered: boolean, sessionId: string, params: any) =>
        sentEvents.push({ userTriggered, sessionId, params })
    };

    if (options.resolvesWith !== undefined) resolveId(options.resolvesWith);
    if (options.rejects) rejectId();

    return { resolveId, rejectId };
  }

  function makeService(): AnalyticsService {
    TestBed.configureTestingModule({
      providers: [
        AnalyticsService,
        { provide: HarmonyConfigService, useValue: { sessionIdleTimeoutSeconds: IDLE_SECONDS } }
      ]
    });
    return TestBed.inject(AnalyticsService);
  }

  function touch() {
    document.dispatchEvent(new Event('pointerdown'));
  }

  beforeEach(() => {
    sentEvents = [];
    originalLoader = (window as any).Loader;
  });

  afterEach(() => {
    (window as any).Loader = originalLoader;
  });

  it('queues events until the session id arrives, then flushes them in order', fakeAsync(() => {
    const loader = installLoader({ hangs: true });
    const service = makeService();

    service.track(true, 'Category', 'first');
    service.track(true, 'Vehicle', 'second');
    expect(sentEvents.length).toBe(0);

    loader.resolveId('real-session-id');
    tick();

    expect(sentEvents.map(e => e.params.details)).toEqual(['first', 'second']);
    expect(sentEvents.every(e => e.sessionId === 'real-session-id')).toBeTrue();

    flush();
  }));

  it('falls back to a generated id when the player never answers', fakeAsync(() => {
    installLoader({ hangs: true });
    const service = makeService();

    service.track(true, 'Category', 'queued while hanging');
    expect(sentEvents.length).toBe(0);

    // getNewAnalyticsSessionIdPromise neither resolves nor rejects without a player; the 3s
    // timeout is what releases the queue in ng serve and MVision preview.
    tick(3000);

    expect(sentEvents.length).toBe(1);
    expect(sentEvents[0].sessionId).toBeTruthy();

    flush();
  }));

  it('does not throw when the player is missing entirely', fakeAsync(() => {
    delete (window as any).Loader;
    const service = makeService();

    expect(() => service.track(true, 'Category', 'no player present')).not.toThrow();
    expect(service.getLogs().length).toBe(1);

    flush();
  }));

  it('closes the session when idle and does not mint a new id until someone touches it',
    fakeAsync(() => {
      installLoader({ resolvesWith: 'session-one' });
      const service = makeService();
      tick();

      service.track(true, 'Category', 'a real visit');
      tick(IDLE_SECONDS * 1000);

      const details = sentEvents.map(e => e.params.details);
      expect(details).toContain('Session ended (idle)');

      // Lazy rotation: while nobody is there, no new session exists.
      expect(service.getId()).toBe('session-one');

      flush();
    }));

  it('starts a new session on the first touch after an idle close', fakeAsync(() => {
    const loader = installLoader({ hangs: true });
    const service = makeService();
    loader.resolveId('session-one');
    tick();

    tick(IDLE_SECONDS * 1000);
    expect(sentEvents.map(e => e.params.details)).toContain('Session ended (idle)');

    // The next visitor arrives. A fresh id is minted and 'Session started' opens the new session.
    (window as any).Loader.getNewAnalyticsSessionIdPromise = () => Promise.resolve('session-two');
    touch();
    tick(1);

    const started = sentEvents.filter(e => e.params.details === 'Session started');
    expect(started.length).toBe(1);
    expect(started[0].sessionId).toBe('session-two');
    expect(service.getId()).toBe('session-two');

    flush();
  }));

  it('announces the idle close once so the UI can return to the start screen', fakeAsync(() => {
    installLoader({ resolvesWith: 'session-one' });
    const service = makeService();
    tick();

    let ended = 0;
    service.sessionEnded$.subscribe(() => ended++);

    tick(IDLE_SECONDS * 1000);
    expect(ended).toBe(1);

    // A second visitor's session must be able to announce its own close.
    (window as any).Loader.getNewAnalyticsSessionIdPromise = () => Promise.resolve('session-two');
    touch();
    tick(1);
    tick(IDLE_SECONDS * 1000);
    expect(ended).toBe(2);

    flush();
  }));

  it('does not announce an idle close while the visitor keeps touching the screen', fakeAsync(() => {
    installLoader({ resolvesWith: 'session-one' });
    const service = makeService();
    tick();

    let ended = 0;
    service.sessionEnded$.subscribe(() => ended++);

    // Each touch pushes the deadline out, so the session never goes idle.
    for (let i = 0; i < 3; i++) {
      tick((IDLE_SECONDS - 1) * 1000);
      touch();
    }
    expect(ended).toBe(0);

    flush();
  }));

  it('keeps events on one line', fakeAsync(() => {
    installLoader({ resolvesWith: 'session-one' });
    const service = makeService();
    tick();

    service.track(true, 'Vehicle', 'line one\nline two');
    expect(sentEvents[0].params.details).toBe('line one line two');

    flush();
  }));
});

import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { HarmonyConfigService } from './harmony-config.service';

/** Grouping axis for every event. Kept short and colon-free. */
export type AnalyticsType =
  | 'Session'
  | 'Category'
  | 'Filter'
  | 'Vehicle'
  | 'Gallery'
  | 'Finance'
  | 'Insurance'
  | 'Navigation'
  | 'Health';

interface AnalyticsEvent {
  userTriggered: boolean;
  params: { type: AnalyticsType; details: string };
}

/**
 * AnalyticsService
 *
 * Owns the analytics session for the LKB template and is the only caller of the player's
 * Loader.createAnalyticsEvent. Mirrors the window.Analytics singleton used by the Volvo
 * navigation-menu family (custom/volvo/explorer-navigation-menu-v2) so the data aggregates the
 * same way, adapted to Angular DI.
 *
 * See docs/superpowers/specs/2026-08-05-lkb-analytics-design.md.
 *
 * Analytics must never break the template, so every call into the player is wrapped.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService implements OnDestroy {

  /** With no player answering, getNewAnalyticsSessionIdPromise() neither resolves nor rejects —
   *  a timeout is what actually releases the queue in ng serve and in MVision preview. */
  private static readonly SESSION_ID_TIMEOUT_MS = 3000;

  private sessionId: string | null = null; // null while an id is being minted -> events queue
  private generation = 0;                  // bumped per session, so a stale answer can't clobber a newer one
  private pending: AnalyticsEvent[] = [];
  private logs: AnalyticsEvent[] = [];

  /** Set when the idle timer has closed the session. The next interaction mints the new id. */
  private sessionClosed = false;
  private idleTimer: any = null;

  private readonly onInteraction = () => this.noteInteraction();
  private readonly interactionEvents = ['pointerdown', 'touchstart', 'keydown'];

  constructor(
    private zone: NgZone,
    private harmonyConfig: HarmonyConfigService,
  ) {
    this.openSession();
    this.listenForInteraction();
    this.restartIdleTimer();
  }

  ngOnDestroy(): void {
    this.clearIdleTimer();
    this.interactionEvents.forEach(name =>
      document.removeEventListener(name, this.onInteraction, true));
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /**
   * @param userTriggered true for direct user actions, false for system/automatic events
   */
  track(userTriggered: boolean, type: AnalyticsType, details: string): void {
    // Keep every event on one line so the console stream stays readable.
    const flat = String(details).replace(/[\r\n]+/g, ' ');
    const event: AnalyticsEvent = { userTriggered, params: { type, details: flat } };

    this.logs.push(event);
    // Visible on-device via Debug Options > Show Console — the practical way to watch the stream.
    console.log('[analytics] ' + (userTriggered ? 'user' : 'system') + ' | ' + type + ' | ' + flat);

    if (this.sessionId === null) this.pending.push(event);
    else this.send(event);
  }

  getId(): string | null {
    return this.sessionId;
  }

  getLogs(): AnalyticsEvent[] {
    return this.logs;
  }

  // ── Session lifecycle ─────────────────────────────────────────────────────

  /** Mint a fresh session id. Events created before it lands are queued and flushed onto it. */
  private openSession(): void {
    const mine = ++this.generation;
    this.sessionId = null;
    this.sessionClosed = false;

    try {
      const loader = (window as any).Loader;
      loader.getNewAnalyticsSessionIdPromise()
        .then((id: string) => this.useId(mine, id))
        .catch(() => this.useId(mine, AnalyticsService.fallbackId()));
    } catch (e) {
      console.error('Could not open an analytics session', e);
      this.useId(mine, AnalyticsService.fallbackId());
      return;
    }

    setTimeout(() => this.useId(mine, AnalyticsService.fallbackId()),
      AnalyticsService.SESSION_ID_TIMEOUT_MS);
  }

  private useId(gen: number, id: string): void {
    if (gen !== this.generation) return;  // an answer for a session we've already moved past
    if (this.sessionId !== null) return;  // first answer wins (promise vs timeout)

    this.sessionId = id;
    const queued = this.pending;
    this.pending = [];
    queued.forEach(event => this.send(event));
  }

  private send(event: AnalyticsEvent): void {
    try {
      (window as any).Loader.createAnalyticsEvent(
        event.userTriggered, this.sessionId, event.params);
    } catch (e) {
      console.error('Could not send an analytics event', e);
    }
  }

  private static fallbackId(): string {
    return new Date().getTime().toString(16);
  }

  // ── Idle detection ────────────────────────────────────────────────────────

  /**
   * Listeners run outside Angular: without this every touch on a list that can hold 700 cars would
   * trigger a change-detection pass purely for analytics bookkeeping. Capture phase, so a handler
   * that stops propagation cannot hide the interaction from us.
   */
  private listenForInteraction(): void {
    this.zone.runOutsideAngular(() => {
      this.interactionEvents.forEach(name =>
        document.addEventListener(name, this.onInteraction, true));
    });
  }

  private noteInteraction(): void {
    // The session is rotated lazily — here, on the first touch after an idle close — so a kiosk
    // nobody is standing at never mints sessions that would contain only 'Session started'.
    if (this.sessionClosed) {
      this.openSession();
      this.track(false, 'Session', 'Session started');
    }
    this.restartIdleTimer();
  }

  private restartIdleTimer(): void {
    this.clearIdleTimer();

    // Read the timeout per restart, not once in the constructor: HarmonyConfigService fills its
    // params asynchronously from loader.getComponents(), so at construction time the configured
    // value is usually not there yet.
    const timeoutMs = this.harmonyConfig.sessionIdleTimeoutSeconds * 1000;
    if (timeoutMs <= 0) return; // idle sessions disabled -> one session per boot

    this.zone.runOutsideAngular(() => {
      this.idleTimer = setTimeout(() => this.closeIdleSession(), timeoutMs);
    });
  }

  private closeIdleSession(): void {
    if (this.sessionClosed) return;
    this.sessionClosed = true;
    this.track(false, 'Session', 'Session ended (idle)');
  }

  private clearIdleTimer(): void {
    if (this.idleTimer !== null) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }
}

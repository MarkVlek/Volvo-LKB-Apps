import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, Observable } from "rxjs";
import { PageCard } from "../enums/page-card-enum";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class IframeService {
    currentIFrame: IFrameHandler = new IFrameHandler(PageCard.Blank, false);
    currentIFrame$: Subject<IFrameHandler> = new Subject<IFrameHandler>();
    private event$: BehaviorSubject<
        keyof typeof EVENT | null
    > = new BehaviorSubject(null as keyof typeof EVENT | null);
    private backBtn$: BehaviorSubject<
    keyof typeof EVENT | null
    > = new BehaviorSubject(null as keyof typeof EVENT | null);
    private refreshBtn$: BehaviorSubject<
    keyof typeof EVENT | null
    > = new BehaviorSubject(null as keyof typeof EVENT | null);
    private iframeStyles = '';
    private styleObservers: Map<HTMLIFrameElement, MutationObserver> = new Map();
    private loadListeners: Map<HTMLIFrameElement, () => void> = new Map();

    constructor(private http: HttpClient) { }

    setEvent(event$){
        this.event$.next(event$)
    }

    reloadIframe(iframeId: string) {
        var iframe = document.getElementById(iframeId) as HTMLIFrameElement;

        // iframe.contentWindow.location.reload();
    }

    getEvent(){
        return this.event$.asObservable();
    }

    setBackBtn(backBtn$){
        this.backBtn$.next(backBtn$)
    }

    getBackBtn(){
        return this.backBtn$.asObservable();
    }

    setRefresh(refreshBtn$) {
        this.refreshBtn$.next(refreshBtn$)
    }

    getRefresh() {
        return this.refreshBtn$.asObservable();
    }

    checkIfShopOrBuild(country: string): any {
        return this.http.get(`https://www.volvocars.com/api/build/graphql?operationName=GlobalData&variables=%7B%22clientType%22%3A%22dotcom%22%2C%22langMarketSlug%22%3A%22${country}%22%2C%22isCbv%22%3Afalse%2C%22marketSlug%22%3A%22${country}%22%2C%22modelSlug%22%3Anull%2C%22pageName%22%3A%22model%20selector%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22b48e2f931c7fc59d85a7dca43069acbb048a54b77b1d7c4ae3d8fce66babac99%22%7D%7D`)
    }

    getDealers(country: string): any {
        return this.http.get(`https://www.volvocars.com/api/test-drive-booking/v3/${country}/dealers`)
    }

    getTestDriveFormUrl(country: string) {
        return `https://www.volvocars.com/${country}/test-drive-booking/dealer/form/`
    }

    getTestDriveRequestFormUrl(country: string) {
        return `https://www.volvocars.com/${country}/test-drive-booking/requests/form/`
    }
    
    getTestDriveLeadsCalendarUrl(country: string) {
        return `https://www.volvocars.com/${country}/test-drive-booking/dealer/leadscalendar/`
    }

    getTestDriveCalendarUrl(country: string) {
        return `https://www.volvocars.com/${country}/test-drive-booking/dealer/calendar/`
    }

    async loadStyles(cssPath: string = 'assets/css/iframeCSS.css'): Promise<void> {
    try {
      const response = await fetch(cssPath);
      this.iframeStyles = await response.text();
      console.log('Loaded iframe styles:', this.iframeStyles.length, 'characters');
    } catch (e) {
      console.error('Could not load iframe styles:', e);
    }
  }

  setupStyleInjection(iframeEl: HTMLIFrameElement): void {
    if (!iframeEl) return;

    // Remove previous listener if exists
    const existingListener = this.loadListeners.get(iframeEl);
    if (existingListener) {
      iframeEl.removeEventListener('load', existingListener);
    }

    // Inject immediately if document exists
    this.tryEarlyInjection(iframeEl);

    // Create new load listener
    const loadListener = () => {
      this.tryEarlyInjection(iframeEl);
      this.observeIframeChanges(iframeEl);
    };

    this.loadListeners.set(iframeEl, loadListener);
    iframeEl.addEventListener('load', loadListener);
  }

  private tryEarlyInjection(iframeEl: HTMLIFrameElement): void {
    try {
      const iframeDoc = iframeEl.contentDocument || iframeEl.contentWindow?.document;
      if (!iframeDoc) return;

      // Inject into head as soon as it exists - even before body
      if (iframeDoc.head) {
        this.injectStyles(iframeDoc);
        this.injectCookieDialogBlocker(iframeDoc);
        this.closeCookieDialog(iframeDoc);
      }

      // Watch for head creation if it doesn't exist yet
      if (!iframeDoc.head && iframeDoc.documentElement) {
        const headObserver = new MutationObserver((mutations, obs) => {
          if (iframeDoc.head) {
            this.injectStyles(iframeDoc);
            this.injectCookieDialogBlocker(iframeDoc);
            this.closeCookieDialog(iframeDoc);
            obs.disconnect();
          }
        });
        headObserver.observe(iframeDoc.documentElement, { childList: true });
      }
    } catch (e) {
      // Cross-origin or not ready yet - will retry on load
    }
  }

  private observeIframeChanges(iframeEl: HTMLIFrameElement): void {
    try {
      const iframeDoc = iframeEl.contentDocument || iframeEl.contentWindow?.document;
      if (!iframeDoc) return;

      const existingObserver = this.styleObservers.get(iframeEl);
      if (existingObserver) {
        existingObserver.disconnect();
      }

      this.injectStyles(iframeDoc);
      this.closeCookieDialog(iframeDoc);

      // Only observe if body exists (for SPA navigation)
      if (iframeDoc.body) {
        const observer = new MutationObserver(() => {
          this.injectStyles(iframeDoc);
        });

        observer.observe(iframeDoc.body, {
          childList: true,
          subtree: true
        });

        this.styleObservers.set(iframeEl, observer);
      }
    } catch (e) {
      console.error('Could not observe iframe:', e);
    }
  }

  private injectCookieDialogBlocker(doc: Document): void {
    if (!doc.head || doc.getElementById('volvo-dialog-blocker')) return;
    const script = doc.createElement('script');
    script.id = 'volvo-dialog-blocker';
    script.textContent = `(function() {
      var _showModal = HTMLDialogElement.prototype.showModal;
      var _show = HTMLDialogElement.prototype.show;
      HTMLDialogElement.prototype.showModal = function() {
        if (this.id === 'dialog_cookie_consent') return;
        return _showModal.apply(this, arguments);
      };
      HTMLDialogElement.prototype.show = function() {
        if (this.id === 'dialog_cookie_consent') return;
        return _show.apply(this, arguments);
      };
    })();`;
    doc.head.insertBefore(script, doc.head.firstChild);
  }

  private closeCookieDialog(doc: Document): void {
    const host = doc.querySelector('#cookie-banner-host');
    if (!host?.shadowRoot) return;

    const closeIfOpen = () => {
      const dialog = host.shadowRoot!.querySelector('#dialog_cookie_consent') as HTMLDialogElement;
      if (dialog?.open) dialog.close();
    };

    closeIfOpen();

    // Track observer on the host element itself so SPA navigation (new host element) always gets a fresh observer
    if (!(host as any).__volvo_cookieObserver) {
      const shadowObserver = new MutationObserver(closeIfOpen);
      shadowObserver.observe(host.shadowRoot, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['open']
      });
      (host as any).__volvo_cookieObserver = shadowObserver;
    }
  }

  private injectStyles(doc: Document): void {
    if (!doc.head || !this.iframeStyles) return;

    const existing = doc.getElementById('custom-injected-styles');
    if (existing) return; // Already injected

    const style = doc.createElement('style');
    style.id = 'custom-injected-styles';
    style.textContent = this.iframeStyles;
    
    // Insert at beginning of head for higher priority
    if (doc.head.firstChild) {
      doc.head.insertBefore(style, doc.head.firstChild);
    } else {
      doc.head.appendChild(style);
    }
  }

  disconnect(iframeEl: HTMLIFrameElement): void {
    const observer = this.styleObservers.get(iframeEl);
    if (observer) {
      observer.disconnect();
      this.styleObservers.delete(iframeEl);
    }

    const listener = this.loadListeners.get(iframeEl);
    if (listener) {
      iframeEl.removeEventListener('load', listener);
      this.loadListeners.delete(iframeEl);
    }
  }

  disconnectAll(): void {
    this.styleObservers.forEach(observer => observer.disconnect());
    this.styleObservers.clear();
    this.loadListeners.clear();
  }
}

export class IFrameHandler {
    public name: PageCard;
    public active: boolean;

    constructor(name: PageCard, active:boolean) {
        this.name = name;
        this.active = active;
    }
}

export enum EVENT {
    reload,
    back,
    true,
    false,
    language,
    country,
    locale
}
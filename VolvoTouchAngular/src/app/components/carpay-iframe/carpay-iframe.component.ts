import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-carpay-iframe',
  templateUrl: './carpay-iframe.component.html',
  styleUrls: ['./carpay-iframe.component.scss']
})
export class CarpayIframeComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {

  }

  onIframeLoaded(carpayIframe) {
    if (carpayIframe.src == '')
      return;

    const iframeDoc = carpayIframe.contentDocument ||
      (carpayIframe.contentWindow && carpayIframe.contentWindow.document)

    if (iframeDoc) {
      this.cleanIframe(iframeDoc);
    }
  }

  cleanIframe(doc) {
    const styling = '#onetrust-consent-sdk, #ot-cookie-button  { display:none;}'
    let style = doc.createElement('style');
    style.innerHTML = styling;
    doc.head.appendChild(style);
  }
}

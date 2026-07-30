import { Injectable } from '@angular/core';
import { URL_TO_NODE } from '../constants';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScreenBrightnessService {

  constructor(private http: HttpClient) { }

  setBrightness(brightnessLevel: string) {
    const url = URL_TO_NODE + 'api/screen-brightness/setBrightness?level=' + brightnessLevel;
    console.log('Setting brightness to ', brightnessLevel)
    return this.http.post(url, null).subscribe();
  }
}

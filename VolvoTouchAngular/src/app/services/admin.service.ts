import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_TO_NODE } from '../constants';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private show: boolean = false;
  public authorized: boolean = false;
  get visible() { return this.show };
  private closeTimeOut;
  constructor(private http: HttpClient) { }
  public toggleAdminModal() {
    this.show = !this.show;
    clearTimeout(this.closeTimeOut);
    this.closeTimeOut = setTimeout(() => {
      this.show = false;
      this.authorized = false;
    }, 300000)
  }
  public getPlayerConfig(): Observable<any> {
    return this.http.get<any>(URL_TO_NODE + 'api/config');
  }
  public updateChrome(): Observable<any>{
    return this.http.get<any>(URL_TO_NODE + 'api/volvochrome/forcechrome')
  }
  public updatePlugins(): Observable<any>{
    return this.http.get<any>(URL_TO_NODE + 'api/volvochrome/forceplugins')
  }
  public updateVolvoReasons(): Observable<any>{
    return this.http.get<any>(URL_TO_NODE + 'api/volvoreason/force')
  }
  public updateLKB(): Observable<any>{
    return this.http.get<any>(URL_TO_NODE + 'api/volvoleveransklarabilar/force/download')
  }
  public updateFeatures(): Observable<any>{
    return this.http.get<any>(URL_TO_NODE + 'api/volvofeature/force')
  }
  public updateAccessories(): Observable<any>{
    return this.http.get<any>(URL_TO_NODE + 'api/volvoAccessory/force')
  }
}
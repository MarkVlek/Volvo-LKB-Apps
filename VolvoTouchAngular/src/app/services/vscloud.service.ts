import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateTokenGraphQLQuery, signInGraphQLQuery } from './queries/auth.queries';
import { getModelCodeGraphQLQuery, getSpecificationByTokenGraphQLQuery } from './queries/car-specification.queries';

@Injectable({
  providedIn: 'root'
})
export class VscloudService {

  constructor(private http: HttpClient) { }

  signInGraphQL() {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    var url = 'https://ap.vcscloud.se/consumers/signin';

    return this.http.post(url, signInGraphQLQuery(), { observe: 'response' });
  }

  generateTokenGraphQL(keyId: any, xSession: any) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("x-session", xSession);
    var url = 'https://ap.vcscloud.se/consumers/token';

    return this.http.post(url, generateTokenGraphQLQuery(keyId), { headers: headers });
  }

  getSpecificationByTokenGraphQL(token: any, regNr: any) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + token);
    headers = headers.append("Content-Type", "application/json");
    var url = 'https://ap.vcscloud.se/graphql';

    return this.http.post(url, JSON.stringify(getSpecificationByTokenGraphQLQuery(regNr)), { headers: headers, withCredentials: true });
  }

  getModelCodeGraphQL(token: any, regNr: any) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + token);
    headers = headers.append("Content-Type", "application/json");
    var url = 'https://ap.vcscloud.se/graphql';

    return this.http.post(url, JSON.stringify(getModelCodeGraphQLQuery(regNr)), { headers: headers, withCredentials: true });
  }
}

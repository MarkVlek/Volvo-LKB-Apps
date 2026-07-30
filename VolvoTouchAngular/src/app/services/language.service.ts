import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private activeLanguageSubject = new BehaviorSubject<string>('se');
  private activeCountrySubject = new BehaviorSubject<string>('se');
  private activeCountryNameSubject = new BehaviorSubject<string>('Sverige');
  
  activeLanguage$ = this.activeLanguageSubject.asObservable();
  activeCountry$ = this.activeCountrySubject.asObservable();
  activeCountryName$ = this.activeCountryNameSubject.asObservable();

  activeLanguage: string = 'se';
  activeCountry: string = 'se';
  activeCountryName: string = 'Sverige';
  activeLocale: string = 'sv-SE';

  setActiveLanguage(language){
    this.activeLanguage = language;
    this.activeLanguageSubject.next(language);
  }

  getActiveLocale(){
    if (this.activeLanguage == 'se') {
      this.activeLocale = "sv-SE"
    }
    else if (this.activeLanguage == 'en') {
      this.activeLocale = "en-US"
    }
    return this.activeLocale;
  }

  getActiveLanguage(): string{
    return this.activeLanguage;
  }

  setActiveCountry(country) {
    this.activeCountry = country;
    this.activeCountrySubject.next(country);
  }

  getActiveCountry(): string {
    return this.activeCountry;
  }

  setActiveCountryName(countryName) {
    this.activeCountryName = countryName;
    this.activeCountryNameSubject.next(countryName);
  }

  getActiveCountryName(): string {
    return this.activeCountryName;
  }
}
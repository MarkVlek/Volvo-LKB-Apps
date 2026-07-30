import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { IframeService } from 'src/app/services/iframe.service';
import { LanguageService } from 'src/app/services/language.service';
import { HttpClient } from '@angular/common/http';
import { Continent } from './continent.model';
import { Country } from './country.model';
import { Router } from '@angular/router';
import { RTCService } from 'src/app/services/rtc.service';


@Component({
  selector: 'app-language-dialog',
  templateUrl: './language-dialog.component.html',
  styleUrls: ['./language-dialog.component.scss']
})
export class LanguageDialogComponent {

  constructor(private translate: TranslateService,
    private languageService: LanguageService,
    private iFrameService: IframeService,
    public dialogRef: MatDialogRef<LanguageDialogComponent>,
    private http: HttpClient,
    private router: Router,
    private rtcService: RTCService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      translate.setDefaultLang('se');
    }

    baseUrl = "assets/i18n/continents.json"

    continents: Continent[];
    countries: Country[] = [];

    ngOnInit(): void {
      this.getAllCountries()
    }

    onNoClick(): void{
      this.dialogRef.close();
    }

    changeLocale(localeCode: string): void {
      let countries = this.getCountriesPerContinent()
      const selectedCountry = countries
      .find((country) => country.code === localeCode)
      ?.code.toString();

      if (selectedCountry != this.languageService.activeCountry) {
        this.languageService.setActiveCountry(selectedCountry)
        
        this.iFrameService.setEvent('country')
      }

    }

    changeLanguage(lang: string): void {
      let countries = this.getCountriesPerContinent()
      const selectedLanguage = countries
      .find(country => country.lang == lang)?.lang.toString();

      if(selectedLanguage) {
        this.translate.use(lang)
        this.languageService.setActiveLanguage(selectedLanguage)
        
        this.iFrameService.setEvent('language')
        this.rtcService.setFeatureLanguage('locale')
        
        const regex = new RegExp('^/RTCCategoryList/Innovationer');
        const regex2 = new RegExp('^/RTCCategoryList/');
        const regex3 = new RegExp('^/RTCItemList/');

        if (regex.test(this.router.url)){
          setTimeout(() => {
            this.router.navigate([this.router.url])
          }, 200)
        }
        else if(regex2.test(this.router.url)){
          setTimeout(() => {
            this.router.navigate(['RTCCategoryList/Innovationer'])
          }, 200)
        }
        else if(regex3.test(this.router.url)){
          setTimeout(() => {
            this.router.navigate(['RTCCategoryList/Innovationer'])
          }, 200)
        }
      }
      this.dialogRef.close();
    }

    changeCountryName(countryName: string): void {
      let countries = this.getCountriesPerContinent()
      const selectedCountry = countries
      .find(country => country.countryName == countryName)?.countryName.toString();

      if(selectedCountry) {
        this.languageService.setActiveCountryName(selectedCountry)
      }
    }
  
    getAllCountries(): any {
      this.http.get<Continent[]>(this.baseUrl).subscribe(response => {
        this.continents = response;
      })
    }

    getCountriesPerContinent() {
      let countries: Country[] = [];

      this.continents.forEach(continent => {

        if (continent.countries) {

          continent.countries.forEach(country => {

            if (country) {
              countries.push(country)
            }
          })
        }
      })
      this.countries = countries;
      return countries;
    }
}

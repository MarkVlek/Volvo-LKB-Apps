import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import { LkbService } from 'src/app/services/lkb.service';
import { VolvoLeveransklarabilar } from '../models/LkbCategory';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-lkb-resultview',
  templateUrl: './lkb-resultview.component.html',
  styleUrls: ['./lkb-resultview.component.scss']
})
export class LkbResultviewComponent implements OnInit {
  cars: VolvoLeveransklarabilar[] = []
  displayedCars: VolvoLeveransklarabilar[] = []
  allLoaded: boolean = false;
  currentPage = 0;
  carsPerPage = 20;
  lkbContainer: any;
  subscription: any;
  shouldListenToScroll = true;
  selectedCarDiv: any;

  constructor(
    private lkbService: LkbService,
    private router: Router) { }

  ngOnInit(): void {
    this.lkbContainer = document.getElementById('lkb-container')

    this.currentPage = this.lkbService.currentPaginationPage;
    this.displayedCars = [...this.lkbService.displayedCars];
    this.allLoaded = this.lkbService.paginationAllLoaded;

    this.subscription = this.lkbService.filteredCars.subscribe(filterResult => {
      this.cars = [];
      this.cars = filterResult.sort((a, b) => {
        if(a.modelYear !== b.modelYear) return b.modelYear - a.modelYear;
        if (a.price !== b.price) return a.price - b.price;
        return a.milage - b.milage;
      })
      
      this.applyFilter();
    })

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.scrollToPreviousCar()
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();

    this.lkbService.currentPaginationPage = this.currentPage;
    this.lkbService.displayedCars = [...this.displayedCars];
    this.lkbService.paginationAllLoaded = this.allLoaded;
  }

  onCarClick(car: VolvoLeveransklarabilar) {
    this.lkbService.setSelectedCar(car);
    this.router.navigate([PageCard.Leveransklara_bilar_detail]);
  }

  loadCars() {
    const startIndex = this.currentPage * this.carsPerPage;
    const endIndex = startIndex + this.carsPerPage;

    const nextPageItems = this.cars.slice(startIndex, endIndex);
    this.displayedCars = [...this.displayedCars, ...nextPageItems];
    
    if (this.displayedCars.length >= this.cars.length) {
      this.allLoaded = true;
    }
  }

  applyFilter() {
    this.shouldListenToScroll = false;
    this.displayedCars = [];
    this.allLoaded = false;
    this.currentPage = 0;
    this.loadCars();

    setTimeout(() => {
      this.lkbContainer.scrollTo({top: 0, behavior: 'smooth'})
      
      void this.lkbContainer.offsetHeight;

      this.shouldListenToScroll = true;

    }, 100)
  }

  onScroll() {
    if (this.allLoaded) return;

    this.currentPage++;
    this.loadCars()
  }

  scrollToPreviousCar() {
    setTimeout(() => {
      if(this.lkbService.selectedCar) {
        const el = document.getElementById(this.lkbService.selectedCar.id)

        if(el && this.lkbContainer) {

          const scrollOffset = 
          el.offsetTop - this.lkbContainer.offsetTop - (this.lkbContainer.clientHeight / 2) + (el.clientHeight / 2);

          this.lkbContainer.scrollTo({
            top: scrollOffset
          })
        }
      }
    }, 100)
  }
}

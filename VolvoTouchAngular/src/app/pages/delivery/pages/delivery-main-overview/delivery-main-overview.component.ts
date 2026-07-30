import { Component, OnInit } from '@angular/core';
import { DeliveryAgendaService } from '../../services/delivery-agenda.service';
import { NavigationExtras, Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import { ScreensaverService } from 'src/app/services/screen-saver.service';
import { DELIVERYIMAGESSCREENSAVERVDRE } from '../../models/deliveryconst';

@Component({
  selector: 'app-delivery-main-overview',
  templateUrl: './delivery-main-overview.component.html',
  styleUrls: ['./delivery-main-overview.component.scss'],
})
export class DeliveryMainOverviewComponent implements OnInit {
  show: boolean = true;
  isDarkMode: boolean = false;
  videoUrl: string = ''
  agendaContainer: HTMLElement;
  footerContainer: HTMLElement;
  checkBox: HTMLInputElement;

  exitTimeout: any;

  agendaContainerHeight: number = 0;

  constructor(
    public deliveryAgendaService: DeliveryAgendaService,
    private router: Router,
    private screenSaverService: ScreensaverService
  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.agendaContainer = document.getElementById('agenda-list');
      this.footerContainer = document.getElementById('footer');
      this.checkBox = document.getElementById('checkbox') as HTMLInputElement;
    }, 300)

    this.deliveryAgendaService.getAgendaByRegNumber(this.deliveryAgendaService.selectedRegnum).subscribe({
      next: (res) => {
        this.deliveryAgendaService.agenda = res
        this.videoUrl = `${DELIVERYIMAGESSCREENSAVERVDRE}/${this.deliveryAgendaService.agenda.screenSaverName}`;
        this.startAnimation();
      }
    });

  }

  startAnimation() {
    setTimeout(() => {
      this.agendaContainer.classList.add('slide-in')
      this.agendaContainer.style.bottom = '0px';
      this.agendaContainerHeight = this.agendaContainer.clientHeight;
      this.agendaContainer.style.backgroundPosition = `0px ${this.agendaContainerHeight}px`;

       if (this.deliveryAgendaService.isDarkMode) {
          this.agendaContainer.style.transition = 'all 1s';
          this.agendaContainer.style.backgroundImage = "url('./assets/images/Delivery/background.png')";
          this.agendaContainer.style.backgroundPosition = `0px 0px`;
          this.agendaContainer.classList.add('light-mode');
          this.footerContainer.classList.add('light-mode');
          this.checkBox.checked = true;
        }

    }, 1000);
  }

  openBar() {
    this.show = !this.show;
  }

  moveBack() {
    this.router.navigate([PageCard.DeliveryChooseAgenda])
  }

  closeDelivery() {
    this.router.navigate([PageCard.Delivery])
  }

  cancelExit() {
    clearTimeout(this.exitTimeout);
    this.exitTimeout = null;

    this.agendaContainer.style.opacity = '1';
    this.footerContainer.style.opacity = '1';
    this.footerContainer.style.pointerEvents = 'all';
    this.agendaContainer.style.pointerEvents = 'all';
  }

  moveForward(parent, child) {

    if(!child.accessories.some(x => x.medias.length > 0)) {
      return
    }

    if (child) {
      const navigationExtras: NavigationExtras = {
        state: {
          parent: parent,
          child: child
        }
      }
      this.router.navigate([PageCard.DeliveryMainItemView], navigationExtras);
    } else {
      this.router.navigate([PageCard.DeliveryMainItemView])
    }
  }

  goToQr() {
    const isQr = { qr: true };
    const navigationExtras: NavigationExtras = {
      state: {
        data: isQr
      }
    };

    this.router.navigate([PageCard.DeliveryChooseAgenda], navigationExtras);
  }

  toggleDarkMode(fromSlide: boolean = false) {
    this.deliveryAgendaService.isDarkMode = !this.deliveryAgendaService.isDarkMode;

    console.log('FROM SLIDE IS: ' + fromSlide + ' AND IS DARK MODE IS: ' + this.deliveryAgendaService.isDarkMode)

    if (this.deliveryAgendaService.isDarkMode && !fromSlide) {
      console.log('DARK MODE')
      this.agendaContainer.style.transition = 'all 1s';
      this.agendaContainer.style.backgroundImage = "url('./assets/images/Delivery/background.png')";
      this.agendaContainer.style.backgroundPosition = `0px 0px`;
      this.agendaContainer.classList.add('light-mode');
      this.footerContainer.classList.add('light-mode');
      this.checkBox.checked = true;

    } else if (!this.deliveryAgendaService.isDarkMode || fromSlide) {
      console.log('LIGHT MODE')
      this.agendaContainer.style.transition = 'all 1s';
      this.agendaContainer.style.backgroundPosition = `0px ${this.agendaContainerHeight}px`;
      this.agendaContainer.classList.remove('light-mode');
      this.footerContainer.classList.remove('light-mode')
      this.checkBox.checked = false;
    }
  }

  slide() {
    let rotate = document.getElementById('rotate');

    console.log('SLIDING...')

    if (this.agendaContainer.classList.contains('slide-in')) {
      rotate.style.rotate = '180deg'
      this.agendaContainer.classList.remove('slide-in');
      this.agendaContainer.classList.add('slide-out')

      this.toggleDarkMode(true);

      setTimeout(() => {
        this.agendaContainer.style.bottom = '-100%';
      }, 900);
    } else if (this.agendaContainer.classList.contains('slide-out')) {
      rotate.style.rotate = '0deg'
      this.agendaContainer.classList.remove('slide-out');
      this.agendaContainer.classList.add('slide-in')
      this.agendaContainer.style.bottom = '0px';
    }
  }
}

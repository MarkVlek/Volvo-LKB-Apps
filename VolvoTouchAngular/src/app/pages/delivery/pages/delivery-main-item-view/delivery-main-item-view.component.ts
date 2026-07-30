import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import { DeliveryAgendaService } from '../../services/delivery-agenda.service';
import * as _ from 'lodash';
import { Accessories, Agenda, Category, CategoryGroup, Media } from '../../models/agenda.model';
import { DELIVERYIMAGESGLOBAL, DELIVERYIMAGESVDRE } from '../../models/deliveryconst';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-delivery-main-item-view',
  templateUrl: './delivery-main-item-view.component.html',
  styleUrls: ['./delivery-main-item-view.component.scss']
})
export class DeliveryMainItemViewComponent implements OnInit {
  panelOpenState = false;
  videoUrl: string;
  filteredAgendas: CategoryGroup[] = [];
  selectedChild: Category;
  sortedAgenda: any[] = [];
  allDone: boolean = false;
  imgContainer: HTMLElement;
  parentStep = 0;
  childStep = 0;
  isMediaVideo: boolean = false;
  loadingDone: boolean = true;
  isKista: boolean = false;
  selectedMedia: string = null;
  activeAccessory: string = null;

  selectedThumbnail: HTMLElement;

  constructor(
    private router: Router,
    public deliveryAgendaService: DeliveryAgendaService,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    if (this.configService.config['VolvoEndlessAisle_Kista']?.toString().toLowerCase() == 'true') {
      this.isKista = true;
      this.fitToWindow();
    }

    this.deliveryAgendaService.getAgendaByRegNumber(this.deliveryAgendaService.selectedRegnum).subscribe({
      next: (res) => {
        this.deliveryAgendaService.agenda = res
        this.filterAgenda();
        this.imgContainer = document.getElementById('img-container');
        this.openAccordion();
      }
    });
  }

  filterAgenda() {
    const carSpec = this.deliveryAgendaService.agenda;

    let x: CategoryGroup[] = [];

    carSpec.categoryGroups.forEach(categoryGroup => {

      let tempCategoryGroup: CategoryGroup;

      if (categoryGroup.show) {

        let tempCategories: Category[] = [];

        categoryGroup.categories.forEach(category => {

          if (category.show) {

            let tempAccessory: Accessories[] = [];

            category.accessories.forEach(accessory => {

              let tempMedia: Media[] = [];

              accessory.medias.forEach(media => {

                if (media) {
                  tempMedia.push(media);
                }

              });


              if (tempMedia.length > 0) {
                tempAccessory.push(accessory);
              }

            });

            if (tempAccessory.length > 0) {
              let temp = category;
              category.accessories = tempAccessory;
              tempCategories.push(temp);
            }
          }
        });

        if (tempCategories.length > 0) {
          let temp = categoryGroup;
          temp.categories = tempCategories;
          tempCategoryGroup = temp;
          x.push(tempCategoryGroup);
        }
      }
    });

    this.filteredAgendas = x;
  }

  openAccordion() {
    const currentState = this.router.lastSuccessfulNavigation;
    if (currentState?.extras['state']) {

      let parent = currentState?.extras['state']['parent']
      let child = currentState?.extras['state']['child'];

      let parentIndex = this.filteredAgendas.findIndex(x => x.title == parent.title);
      let childIndex = this.filteredAgendas[parentIndex].categories.findIndex(x => x.name == child.name);

      this.setParentStep(parentIndex);
      this.selectChild(this.filteredAgendas[parentIndex].categories[childIndex], childIndex);
    } else {
      console.log('No nav')
      this.selectChild(this.filteredAgendas[0].categories[0], 0);
    }
  }

  setParentStep(parentStep) {
    this.parentStep = parentStep;
    this.selectChild(this.filteredAgendas[parentStep].categories[0], 0)
    this.childStep = 0;


  }

  selectChild(child: Category, childStep) {
    if (child === this.selectedChild) {
      return;
    }

    this.loadingDone = false;
    this.childStep = childStep;
    this.selectedChild = child;
    this.setMedia(this.selectedChild.accessories[0].medias[0].name);
  }

  setMedia(media: string, event = null) {
    if (event) {
      this.setHighLight(event);
    } else {
      this.test();
    }

    let isVideo = this.checkIfVideoOrImage(media);

    if (isVideo) {
      this.isMediaVideo = true;
      this.videoUrl = `${DELIVERYIMAGESGLOBAL}/${media}`;
      this.playVideo();
    } else {
      this.stopVideo();
      this.isMediaVideo = false;
      this.imgContainer.style.backgroundImage = `url(${DELIVERYIMAGESGLOBAL}/${media})`
    }
    setTimeout(() => {
      this.loadingDone = true;
    }, 200)

  }

  test() {
    setTimeout(() => {
      // let x = document.getElementById('thumbnail-0');
      // this.selectedThumbnail = x;
      this.selectedThumbnail.classList.add('highLight')
    }, 250);
  }

  setHighLight(event, thumb = null) {
    let x;
    if(!thumb) {
      x = event.target.parentElement as HTMLElement;
    }
    else {
      x = thumb;
    }

    if (this.selectedThumbnail && this.selectedThumbnail.classList.contains('highLight')) {
      this.selectedThumbnail.classList.remove('highLight');
    }

    this.selectedThumbnail = x;
    this.selectedThumbnail.classList.add('highLight');
  }

  checkIfVideoOrImage(media: string) {
    media = media.toLocaleLowerCase();

    if (media.includes('jpg') || media.includes('jpeg') || media.includes('png')) {
      return false;
    } else if (media.includes('mp4')) {
      return true;
    }
    return null;
  }

  playVideo() {
    setTimeout(() => {
      let video = document.getElementById('video') as HTMLVideoElement;
      video.src = this.videoUrl;
      video.currentTime = 0;
      video.play();
    }, 150)
  }

  stopVideo() {
    let video = document.getElementById('video') as HTMLVideoElement;
    video.src = null;
  }

  closeDelivery() {
    this.router.navigate([PageCard.Delivery])
  }

  back() {
    this.router.navigate([PageCard.DeliveryMainOverView])
  }

  fitToWindow() {
    var details = document.getElementById('details') as HTMLDivElement;
    var media = document.getElementById('media') as HTMLDivElement;
    var video = document.getElementById('video-container') as HTMLDivElement;
    var thumb = document.getElementById('thumbnail-container') as HTMLDivElement;
    var footer = document.getElementById('footer-container') as HTMLDivElement;
    
    if(media && thumb && details && video) {
      media.style.height = '87%'
      thumb.style.height = '220px'
      details.style.height = '82.5%'
      video.style.height = '692px'
      footer.style.position = 'absolute'
      footer.style.top = '95%'
    }
  }

  getMediaPath(name: string) {
    return `${DELIVERYIMAGESGLOBAL}/${name}`
  }

  scrollTo(accessory: Accessories) {
    var mediaElement = document.getElementById('thumbnail-'+ accessory.medias[0].name);
    mediaElement.scrollIntoView({inline: 'start', behavior: 'smooth', block: "end"});
    if (accessory.medias.length > 0 && this.selectedMedia != accessory.medias[0].name) {

      this.setHighLight(null, mediaElement)
      this.setMedia(accessory.medias[0].name)
    }
    this.activeAccessory = accessory.name;
  }
}

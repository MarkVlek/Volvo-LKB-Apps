import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeliveryAgendaService } from '../../services/delivery-agenda.service';
import { Accessories, Category, CategoryGroup, Media } from '../../models/agenda.model';
import { DELIVERYIMAGESGLOBAL } from '../../models/deliveryconst';
import { PageCard } from 'src/app/enums/page-card-enum';
import { ScreenSaverTimerService } from 'src/app/services/screen-saver-timer.service';
import { ConfigService } from 'src/app/services/config.service';
import { CastingService } from 'src/app/services/casting.service';
import { ScreenBrightnessService } from 'src/app/services/screen-brightness.service';

@Component({
  selector: 'app-delivery-main-item-view-surface',
  templateUrl: './delivery-main-item-view-surface.component.html',
  styleUrls: ['./delivery-main-item-view-surface.component.scss']
})
export class DeliveryMainItemViewSurfaceComponent implements OnInit {

  parentStep: number = 0;
  childStep: number = 0;
  filteredAgendas: CategoryGroup[] = [];
  selectedChild: Category;
  loadingDone: boolean = false;
  hasMedia: boolean = false;
  isImage: boolean = true;
  selectedMedia: string = null;
  mediaStartIndex: number = 0;
  selectedThumbnail: HTMLElement;
  lastCastedMedia: string = '';
  isGlobal: boolean;
  activeVideo: HTMLVideoElement;
  activeAccessory: string = null;
  powerOff: boolean = false;
  count: number = 0;

  constructor(
    private router: Router,
    public deliveryAgendaService: DeliveryAgendaService,
    private screenSaverTimerService: ScreenSaverTimerService,
    private configService: ConfigService,
    public castingService: CastingService,
    public cdr: ChangeDetectorRef,
    public brightnessService: ScreenBrightnessService
  ) { }

  ngOnInit(): void {

    this.deliveryAgendaService.getAgendaByRegNumber(this.deliveryAgendaService.selectedRegnum).subscribe({
      next: (res) => {
        this.deliveryAgendaService.agenda = res;
        this.filterAgenda();
        this.setParentStep(0, true) 
        this.cdr.detectChanges();
      }
    })
  }

  filterAgenda() {
    let categoryGroup = this.deliveryAgendaService.agenda.categoryGroups;
    let tempCategoryGroup: CategoryGroup[] = [];
    categoryGroup.forEach(x => {
      let tempCategories: Category[] = [];
      if (x.show && x.categories.length > 0) {
        x.categories.forEach(c => {
          if (c.show && c.accessories.length > 0) {
            tempCategories.push(c);
          }
          x.categories = tempCategories;
        })
        if (x.categories.length > 0) {
          tempCategoryGroup.push(x);
        }
      }
    })
    this.filteredAgendas = tempCategoryGroup;
  }

  setParentStep(parentStep, isOnInit = true) {
    this.parentStep = parentStep;

    this.selectChild(this.filteredAgendas[parentStep].categories[0], 0, isOnInit)
    this.childStep = 0;

  }

  selectChild(child: Category, childStep, isOnInit = true) {

    if (child === this.selectedChild) {
      return;
    }

    this.childStep = childStep;
    this.selectedChild = child;

    console.log('CHECKING IF ' + this.selectedChild.name +  ' HAS MEDIA')
    if (this.checkIfChildHasMedia(this.selectedChild)) {

      console.log(this.selectedChild.name +  ' HAS MEDIA. SETTING FIRST IMAGES AS CASTED')
      this.hasMedia = true;
      this.setMedia(this.selectedChild.accessories[this.mediaStartIndex].medias[0].name, isOnInit, this.selectedChild.accessories[this.mediaStartIndex].name)

      if(!isOnInit)
        setTimeout(() => {
          let thumb = document.getElementById('thumbnail-0') as HTMLElement;
          this.setHighLight(thumb, false);
        }, 20)


    } else {
      this.hasMedia = false;
    }

    let text = document.getElementsByClassName('text-container')[0] as HTMLElement;

    if (text && text.scrollTop) {
      text.scrollTop = 0;
    }

  }

  checkIfChildHasMedia(child: Category): boolean {
    let hasMedia = false;

    for (let i = 0; i < child.accessories?.length; i++) {
      if (child.accessories[i].medias?.length > 0) {
        this.mediaStartIndex = i;
        return true;
      }
    }

    return hasMedia;
  }

  setHighLight(event: any = null, checkParent: boolean = true, selectedThumb: HTMLElement = null) {
    let clickedElem;
    
    if (event != null) {
      if (checkParent)
        clickedElem = event.target.parentElement as HTMLElement;
      else
        clickedElem = event;
    }
    else if (selectedThumb != null) { 
      clickedElem = selectedThumb;
    }

    // if (clickedElem.id != 'thumbnail-0')
    //   return;

    if (this.selectedThumbnail != clickedElem) {

      if (this.selectedThumbnail && this.selectedThumbnail.classList.contains('highlight')) {
        this.selectedThumbnail.classList?.remove('highlight');
      }

      this.selectedThumbnail = clickedElem;
      this.selectedThumbnail.classList.add('highlight');
    }
    this.selectedThumbnail = clickedElem;
  }

  setMedia(mediaName, isOnInit = false, featureName) {
    var castingPlayer = this.configService.playerName + ',' + this.deliveryAgendaService.agenda.fdsData.orderDetails.vistaOrderId
    if(!isOnInit && mediaName.includes('.mp4') || mediaName.includes('_cast')) {
      this.castingService.cast(this.castingService.currentlyCastedPlayer, `${mediaName},${featureName}`, false, castingPlayer).subscribe();
      this.lastCastedMedia = mediaName;
    }
    else {
      if (this.lastCastedMedia.includes('.mp4')) {
        this.castingService.cast(this.castingService.currentlyCastedPlayer, this.deliveryAgendaService.agenda.screenSaverName, true, castingPlayer).subscribe();
        this.lastCastedMedia = mediaName;
      }
    }

    this.selectedMedia = `${DELIVERYIMAGESGLOBAL}/${mediaName}`;

    this.isImage = this.checkIfVideoOrImage(this.selectedMedia);

    if (!isOnInit) {
      var textElement = document.getElementById('text-' + featureName);
      textElement.scrollIntoView();
      this.activeAccessory = featureName;
    }

    setTimeout(() => {
      try {
        this.activeVideo = document.getElementById('video') as HTMLVideoElement;
      }
      catch {
        console.log("No active video source to fetch")
      }
  
      if (this.isImage == false) {
        this.activeVideo.src = this.selectedMedia;
        this.activeVideo.play();

        setTimeout(() => {
          this.activeVideo.setAttribute("controls", "true");
        }, 600)
      }
    }, 150)
  }

  scrollTo(accessory: Accessories) {
    var textElement = document.getElementById('text-' + accessory.name);
    var mediaElement = document.getElementById('thumb-' + accessory.name);
    textElement.scrollIntoView();
    mediaElement?.scrollIntoView({inline: 'center'});

    if (accessory.medias?.length > 0 && this.selectedMedia != accessory.medias[0].name) {

      this.setHighLight(null, false, mediaElement)
      this.setMedia(accessory.medias[0].name, false, accessory.name)
    }
    if (!accessory.medias) {
      if (this.lastCastedMedia.includes('.mp4')) {
        this.castingService.cast(this.castingService.currentlyCastedPlayer, this.deliveryAgendaService.agenda.screenSaverName, true).subscribe();
        this.lastCastedMedia = '';
      }
    }
    this.activeAccessory = accessory.name;
  }

  getThumbUrl(thumbName){
    return `${DELIVERYIMAGESGLOBAL}/${thumbName}`
  }

  checkIfVideoOrImage(media: string) {
    media = media.toLocaleLowerCase();

    if (media.includes('jpg') || media.includes('jpeg') || media.includes('png')) {
      return true;
    } else if (media.includes('mp4')) {
      return false;
    }
    return null;
  }

  goBack() {
    this.router.navigate([PageCard.DeliveryChooseAgenda])
  }

  closeDelivery() {
    this.castingService.cast(this.castingService.currentlyCastedPlayer, '').subscribe()
    if(this.configService.config['VolvoEndlessAisle_ScreenSaverOn'].toString().toLowerCase() == 'true') {
      this.screenSaverTimerService.startTimer()
    }
    this.router.navigate([PageCard.Delivery]);
  }

  turnOff() {
    this.powerOff = true;
    this.brightnessService.setBrightness('0.001');
    localStorage.setItem('powerSaver', 'false')
  }

  turnOn() {
    this.count += 1;
    if (this.count >= 3) {
      this.powerOff = false
      this.brightnessService.setBrightness('0.6');
      localStorage.setItem('powerSaver', 'true')
    }

    setTimeout(() => {
      this.count = 0;
    }, 2000);
  }

}

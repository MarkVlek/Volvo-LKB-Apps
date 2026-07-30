import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deliveryFeaturePipe'
})
export class DeliveryFeaturePipe implements PipeTransform {

  transform(value: string): string {

    switch (value.toLocaleLowerCase()) {
      // case 'collision avoidance and mitigation':
      //   return "Undvika kollisioner"
      case 'luftrenare och fjärrstyrning av luftrening i kupén':
        return "Fjärrstyrning av luftrening"
      // case 'front cross traffic alert':
      //   return "Främre kollisionsvarning"
      // case 'blis™ och cross traffic alert':
      //   return "BLIS-system"
      // case 'oncoming lane mitigation':
      //   return "Främre kollisionsvarning"
      // case '360°-kamera med 3d-vy':
      //   return "360°-kamera"
      // case 'pixellampor med hög upplösning':
      //   return "Pixellampor"
      // case 'lane keeping aid och lane departure warning':
      //   return "Säkerhetsystem för förare"
      // case 'backspeglar med automatisk avbländning':
      //   return "Avbländande backspeglar"
      default:
        return value;
    }



  }

}

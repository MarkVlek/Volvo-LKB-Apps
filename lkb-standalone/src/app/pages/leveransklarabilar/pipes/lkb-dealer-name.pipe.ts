import { Pipe, PipeTransform } from '@angular/core';
import { HarmonyConfigService } from './../../../services/harmony-config.service';

@Pipe({
  name: 'lkbDealerName'
})
export class LkbDealerNamePipe implements PipeTransform {
  constructor(
    public harmonyConfig: HarmonyConfigService
  ) { }

  transform(value: any) {
    // const replacements = [
    //   { keyword: 'AHLBERG BIL', pattern: 'Ahlberg Bil ', replaceWith: ' ' },
    //   { keyword: 'BILBOLAGET', pattern: 'Bilbolaget ', replaceWith: ' ' },
    //   { keyword: 'BILDEVE', pattern: 'Bildeve AB - ', replaceWith: ' ' },
    //   { keyword: 'BILIA', pattern: 'Bilia', replaceWith: ' ' },
    //   { keyword: 'BILKOMPANIET', pattern: 'Bilkompaniet i ', replaceWith: ' ' },
    //   { keyword: 'BILMÅNSSON', pattern: 'Bilmånsson ', replaceWith: ' ' },
    //   { keyword: 'BOGESUNDS', pattern: 'Bogesunds Bil ', replaceWith: ' ' },
    //   { keyword: 'BRANDT BIL', pattern: 'Brandt Bil - ', replaceWith: ' ' },
    //   { keyword: 'FINNVEDENS', pattern: 'Finnvedens Bil ', replaceWith: ' ' },
    //   { keyword: 'HELMIA', pattern: 'Helmia Bil AB ', replaceWith: ' ' },
    //   { keyword: 'LILJAS', pattern: 'Liljas Personbilar ', replaceWith: ' ' },
    //   { keyword: 'NYBERGS', pattern: 'Nybergs Bil ', replaceWith: ' ' },
    //   { keyword: 'REJMES', pattern: 'Rejmes Halland - ', replaceWith: ' ' },
    //   { keyword: 'ROLF', pattern: 'Rolf Ericson Bil ', replaceWith: ' ' },
    //   { keyword: 'SKOBES', pattern: 'Skobes Bil ', replaceWith: ' ' },
    //   { keyword: 'STENDAHLS', pattern: 'Stendahls Bil ', replaceWith: ' ' },
    //   { keyword: 'VOLVO CAR', pattern: 'Volvo Car ', replaceWith: ' ' },
    // ];

    let locationFilters = this.harmonyConfig.locationFilters;
    let replacements = [];

    for (let id in locationFilters) {
      let splitValues = locationFilters[id].split('|');
      if (splitValues.length === 3) {
        let filter = {
          keyword: splitValues[0].toUpperCase(),
          pattern: splitValues[1],
          replaceWith: splitValues[2]
        };
        replacements.push(filter);
      }
    };

    for (const rule of replacements) {
      if (value) {
        if (value.toUpperCase().includes(rule.keyword)) {

          value = value.replace(rule.pattern, rule.replaceWith);

          if (value.includes('Volvo'))
            value = value.replace('Volvo', ' ')

          if (value.includes('('))
            value = value.split('(')[0]
        }
      }
    }

    return value;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lkbDealerName'
})
export class LkbDealerNamePipe implements PipeTransform {

  transform(value: any) {
    const replacements = [
      { keyword: 'AHLBERG BIL', pattern: 'Ahlberg Bil ', replaceWith: ' ' },
      { keyword: 'BILBOLAGET', pattern: 'Bilbolaget ', replaceWith: ' ' },
      { keyword: 'BILDEVE', pattern: 'Bildeve AB - ', replaceWith: ' ' },
      { keyword: 'BILIA', pattern: 'Bilia', replaceWith: ' ' },
      { keyword: 'BILKOMPANIET', pattern: 'Bilkompaniet i ', replaceWith: ' ' },
      { keyword: 'BILMÅNSSON', pattern: 'Bilmånsson ', replaceWith: ' ' },
      { keyword: 'BOGESUNDS', pattern: 'Bogesunds Bil ', replaceWith: ' ' },
      { keyword: 'BRANDT BIL', pattern: 'Brandt Bil - ', replaceWith: ' ' },
      { keyword: 'FINNVEDENS', pattern: 'Finnvedens Bil ', replaceWith: ' ' },
      { keyword: 'HELMIA', pattern: 'Helmia Bil AB ', replaceWith: ' ' },
      { keyword: 'LILJAS', pattern: 'Liljas Personbilar ', replaceWith: ' ' },
      { keyword: 'NYBERGS', pattern: 'Nybergs Bil ', replaceWith: ' ' },
      { keyword: 'REJMES', pattern: 'Rejmes Halland - ', replaceWith: ' ' },
      { keyword: 'ROLF', pattern: 'Rolf Ericson Bil ', replaceWith: ' ' },
      { keyword: 'SKOBES', pattern: 'Skobes Bil ', replaceWith: ' ' },
      { keyword: 'STENDAHLS', pattern: 'Stendahls Bil ', replaceWith: ' ' },
      { keyword: 'VOLVO CAR', pattern: 'Volvo Car ', replaceWith: ' ' },
    ];

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

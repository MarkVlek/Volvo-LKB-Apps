import { Pipe,PipeTransform } from '@angular/core';

@Pipe({
  name: 'launchPageAlias'
})
export class launchPageAliasPipe implements PipeTransform{
    transform(value: string) {
        
        if(value.toLowerCase().includes("launchevent")) {
          // Get this from config in future
          return "EX30"
        }

        return value;
    }
}
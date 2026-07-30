import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { fadeAnimation } from 'src/app/animations/simple-fade.animation';
import { CastingService } from 'src/app/services/casting.service';
import { ConfigService } from 'src/app/services/config.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-cast',
  templateUrl: './cast.component.html',
  styleUrls: ['./cast.component.scss'],
  animations: [fadeAnimation]
})
export class CastComponent implements OnInit {
  canCast: boolean = false;
  castingPlayer: string = "";
  configPlayer: string = "";
  token: string;
  isCasting: boolean = false;
  sub: any;
  explorer: string;
  constructor(
    public tokenService: TokenService, 
    private configService: ConfigService, 
    public castingService: CastingService,
    private navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    this.token = this.tokenService.token;
    this.configPlayer = this.configService.config["VolvoEndlessAisle_CastingPlayers"]
    if (this.configService.config['VolvoEndlessAisle_Casting'].toString().toLowerCase() == "true") {
      this.getCastingPlayer()
      this.sub = this.tokenService.onChange$.subscribe(t => {
        if(t && this.castingService.currentlyCastedPlayer) {
          this.canCast = true;
        }
        if (this.castingService.isCasting == true) {
          if (t && this.token != t) {
            this.token = t;
            
            this.ChangeCastedCar();
          }
        }
      })
    }
  }

  ngOnDestroy() {
    if (this.explorer == 'false') {
      this.sub.unsubscribe();
      this.stopCasting();
    }
  }

  async GetCastingScreens() {
    of(this.tokenService.getCastingScreens().subscribe({
      next: async (data) => {
        let hostName = await this.configService.GetCastingScreenHostName()
        data.forEach(screen => {
          if (screen.hostname == hostName && this.tokenService.checkIfDateIsOk(screen.lastOnline)) {
            this.canCast = true;
          }
          else {
            this.canCast = false;
          }
        })
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => {

      }
    }))

  }

  async getCastingPlayer() {
    await this.castingService.GetCastingPlayer(this.configPlayer).subscribe(player => {
      this.castingService.currentlyCastedPlayer = player["key"]
    });
    
  }

  Cast() {
    if(this.castingService.isCasting != true) {
      this.castingService.isCasting = true;
      this.token = this.tokenService.token;
    }
    else{
      this.castingService.castBdv(this.castingService.currentlyCastedPlayer, "", "").subscribe();
      this.token = null;
      this.castingService.isCasting = false
    }
  }

  stopCasting() {
    this.castingService.castBdv(this.castingService.currentlyCastedPlayer, "", "").subscribe();
    this.token = null;
    this.castingService.isCasting = false
  }

  ChangeCastedCar() {
    this.castingService.castBdv(this.castingService.currentlyCastedPlayer, "TriggerBDV", this.token).subscribe();
  }
}
  
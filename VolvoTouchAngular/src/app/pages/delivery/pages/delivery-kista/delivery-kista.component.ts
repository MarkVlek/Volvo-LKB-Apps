import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PageCard } from 'src/app/enums/page-card-enum';
import { CastingService } from 'src/app/services/casting.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-delivery-kista',
  templateUrl: './delivery-kista.component.html',
  styleUrls: ['./delivery-kista.component.scss']
})
export class DeliveryKistaComponent {
  public loadingQr: boolean = true;
  public qrCodeLink: string = null;
  private linkToMobileSite: string = "https://grassfeeder.grassfish.com/volvo/app/delivery/";
  public castingPlayers: string[] = [];
  public HasCasted: boolean = false;
  public showQr: boolean = false;

  constructor(
    private configService: ConfigService,
    private router: Router,
    public castingService: CastingService
  ) { }

  ngOnInit(): void {
    if(this.configService.config['VolvoEndlessAisle_CastingPlayers'] != null) {
      this.castingPlayers = this.configService.config['VolvoEndlessAisle_CastingPlayers'].split(',')
    }
  }

  setQrCodeLink() {
    this.loadingQr = true;

    if (this.configService.config['VolvoEndlessAisle_Kista']?.toString().toLowerCase() == 'true') {
      console.log('Starting Standard scenario');
      this.qrCodeLink = `${this.linkToMobileSite}?retailer=Kista&player=${this.castingService.currentlyCastedPlayer}`;
    }
    console.log(this.qrCodeLink)
    setTimeout(() => {
      this.loadingQr = false;
    }, 500)
  }

  SetCastingPlayer(castingPlayerName: string) {
    this.castingService.currentlyCastedPlayer = castingPlayerName;
  }

  onExit() {
    this.router.navigate([PageCard.Delivery])
  }

  onContinue() {
    this.setQrCodeLink();

    this.showQr = true;
  }
}

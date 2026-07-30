import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { DeliveryAgendaService } from '../pages/delivery/services/delivery-agenda.service';
import { MatDialog } from '@angular/material/dialog';
import { DeliveryChooseAgendaDialogComponent } from '../pages/delivery/pages/delivery-choose-agenda/delivery-choose-agenda-dialog/delivery-choose-agenda-dialog/delivery-choose-agenda-dialog.component';
import { CastingPlayer } from '../pages/delivery/models/castingplayer.model';

@Injectable({
  providedIn: 'root'
})
export class CastingService {

  grassFeederVolvoCastingUrl: string = "https://grassfeeder.grassfish.com/volvo/casting"
  //grassFeederVolvoCastingUrl: string = "http://grassfeedervolvo.localhost.test/casting"
  grassFeederVolvoCastUri: string = '/castPlayer';
  currentlyCastedPlayer$: BehaviorSubject<string>;
  currentlyCastedPlayer: string = '';
  token$: Subject<string>
  occupationStatus: Map<any, any> = new Map();
  castingStatus: any;
  readonly dialog = inject(MatDialog);
  isCasting: boolean = false;

  constructor(
    private httpClient: HttpClient,
    public deliveryAgendaService: DeliveryAgendaService) { }

  cast(playerName: string, contentName: string, isScreenSaver: boolean = false, castingPlayer: string = null) {

    let body = {
      contentName: contentName,
      isScreenSaver: isScreenSaver,
      customerName: contentName ? this.deliveryAgendaService.agenda.customerName : "",
      modelName: contentName ? this.deliveryAgendaService.agenda.carModel : "",
      castingPlayer: castingPlayer
    }

    const options = { headers: { "x-api-key": "<key>", "Content-Type":"application/json" }};

    return this.httpClient.post(this.grassFeederVolvoCastingUrl + this.grassFeederVolvoCastUri + '?playerId=' + playerName, JSON.stringify(body), options)    
    .pipe(
      tap(data => {
        console.log('casted succesfully');
      }),
      catchError(this.handleError)
    );
  }

  async getPlayers() {
    const options = { headers: { "x-api-key": "<key>", "Content-Type":"application/json" }};
    await this.httpClient.get(this.grassFeederVolvoCastingUrl, options).subscribe(data => {
      const players: CastingPlayer[] = [];
      for (const key in data) {
        const player: CastingPlayer = data[key];
        player.name = key;
        players.push(player);
      }
      this.setOccupationStatus(players);
    });
  }

  setOccupationStatus(connectedPlayers: CastingPlayer[]) {
    this.occupationStatus.clear();
    for (const player of connectedPlayers) {
      if(player.state.castingPlayer) {
        this.occupationStatus.set(player.name, player.state.castingPlayer);
      }
    }
  }

  async GetPlayer(playerName: string) {
    const options = { headers: { "x-api-key": "<key>", "Content-Type":"application/json" }};

    await this.httpClient.get(this.grassFeederVolvoCastingUrl + '/player?Id=' + playerName, options).subscribe(data => {
      var state = data['value']['state']['contentName'];
      
      if (state) {
        this.openDialog();
      }
    });
  }

  GetCastingPlayer(player: string) {
    const options = { headers: { "x-api-key": "<key>", "Content-Type":"application/json" }};

    return this.httpClient.get(this.grassFeederVolvoCastingUrl + '/player?Id=' + player, options);
  }

  openDialog() {
    const dialogRef = this.dialog.open(DeliveryChooseAgendaDialogComponent, {
      height: '450px',
      width: '1200px',
    });
  }

  handleError(error: HttpErrorResponse) {

    console.log('SOMETHING WENT WRONG: ' + error.status);

    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }

    return throwError(() => new Error('Could not cast to player.'));
  }

  castBdv(playerName: string, trigger: string, token: string) {
    let body = {
      contentName: trigger,
      isScreenSaver: false,
      customerName: "",
      modelName: token
    }

    const options = { headers: { "x-api-key": "<key>", "Content-Type":"application/json" }};


    return this.httpClient.post(this.grassFeederVolvoCastingUrl + this.grassFeederVolvoCastUri + '?playerId=' + playerName, JSON.stringify(body), options)    
    .pipe(
      tap(data => {
        console.log('casted succesfully');
      }),
      catchError(this.handleError)
    );
  }

}

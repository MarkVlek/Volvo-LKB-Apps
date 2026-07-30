import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Agenda } from "../models/agenda.model";
import { URL_TO_NODE } from "src/app/constants";



@Injectable()
export class DeliveryAgendaService {
    agenda: Agenda;
    currentAgendaIndex: number = 0;
    selectedRegnum: string = '';
    isDarkMode: boolean = false;

    constructor(private http: HttpClient) {
        
    }

    getAgendaByRegNumber(regNumber, market = ''): Observable<Agenda> {
        const body = { regNum: regNumber, market: market}
        return this.http.post<any>(URL_TO_NODE + 'api/volvodelivery/regnumber', body)
    }

    postAgendaToGrassFeeder(agenda): Observable<any> {
        return this.http.post<any>(URL_TO_NODE + 'api/volvodelivery/agenda', { agenda: agenda });
    }

    setCustomerName(agenda): Observable<any>{
        return this.http.post<any>(URL_TO_NODE + 'api/volvodelivery/setcustomername', { agenda: agenda })
    }

    fetchOrdersByDate(date): Observable<any>{
        return this.http.post<string>(`${URL_TO_NODE}api/volvodelivery/ordersByDate?date=${date}`, {})
    }

    getOrders(date): Observable<any>{
        return this.http.post<string>(`${URL_TO_NODE}api/volvodelivery/orders?date=${date}`, {})
    }
}
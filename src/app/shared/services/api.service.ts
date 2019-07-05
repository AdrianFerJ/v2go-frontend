import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ChargingStation } from '../models/charging-station';
import { UserAccountData } from '../models/user-account-data';
import { User } from '../models/user';
import { Reservation } from '../models/reservation';
import { EventCS } from '../models/event-cs';

@Injectable({ providedIn: 'root' })
export class SearchStationsService {
  private API_URL = environment.API_URL + 'volt_finder/near-poi';
  constructor(private http: HttpClient) {}

  /**
   * Search CS by calling the 'API/near-poi' endpoint.
   *
   * @param poiLat - Point of interest latitude, either from user's location or default lat (MTL)
   * @param poiLng - Point of interest longitude or default lng (MTL)
   */
  findStations(poiLat: number, poiLng: number): Observable<ChargingStation[]> {
    if (typeof poiLat === 'undefined' || typeof poiLng === 'undefined') {
      console.log('Error at findStations(). Invalid coordinates.');
    } else {
      const params = new HttpParams()
        .set('poi_lat', String(poiLat))
        .set('poi_lng', String(poiLng));
      return this.http.get<ChargingStation[]>(this.API_URL, { params: params });
    }
  }
}

@Injectable({ providedIn: 'root' })
export class UserAccountInfoService {
  private API_URL = environment.API_URL + 'my-account';
  constructor(private http: HttpClient) {}

  /**
   * Get user personal info, EV, reservations, history, etc
   * @param user_pk
   */
  getAccountInfo(user_pk: number): Observable<UserAccountData> {
    // TODO: Update API endpoint to take user_pk as param, meaning:
    // 'my-account?user_pk=3', instead of 'my-account/3"
    // const params = new HttpParams().set('user_pk', String(user_pk));
    // return this.http.get<any>(
    //   this.API_URL, { params: params }).pipe(
    //     map(userData => userData)
    //     // map(resp => resp.map(
    //     //   userInfo => ChargingStation.create(station)))
    //   );

    const modifAPI = this.API_URL + '/' + String(user_pk);
    return this.http.get<any>(modifAPI).pipe(
      map(userData => userData)
      // map(resp => resp.map(
      //   userInfo => ChargingStation.create(station)))
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class MainService {
  API_URL = environment.API_URL + 'stations/';

  constructor(private http: HttpClient) {}

  public getChargingStation(csNk: string) {
    return this.http.get<ChargingStation>(this.API_URL + csNk + '/');
  }
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  API_URL = environment.API_URL + 'volt_reservation/';

  constructor(private http: HttpClient) {}

  public getAvailabilities(startDateTime, endDateTime, csNk) {
    const params = new HttpParams()
      .set('cs_nk', csNk)
      .set('start_datetime', startDateTime)
      .append('end_datetime', endDateTime);

    return this.http.get<EventCS[]>(this.API_URL + 'station-availabilities/', {params: params});
  }

  public makeReservation(
    event_cs_nk: string,
    ev_nk: string,
    custom_start_datetime: Date,
    custom_end_datetime: Date
  ): Observable<Reservation> {
    const optionA = {
      event_cs_nk,
      ev_nk,
      custom_start_datetime,
      custom_end_datetime
    };

    const optionB = {
      event_cs_nk,
      ev_nk
    };

    const payLoad = (custom_start_datetime && custom_end_datetime) ? optionA : optionB;

    const endPoint = (custom_start_datetime && custom_end_datetime) ?
                      this.API_URL + 'reservations/custom/' :
                      this.API_URL + 'reservations/';

    return this.http.post<Reservation>(endPoint, payLoad);
  }

  public cancelReservation(eventEvNk: string): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.API_URL}reservations/${eventEvNk}/`, {});
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SearchStationsService } from '../../shared/services/api.service';
import { ChargingStation } from '../../shared/models/charging-station';
import { ToastrService } from 'ngx-toastr';

class Marker {
  constructor(
    public lat: number,
    public lng: number,
    public label?: string,
    public icon?: any
  ) {}
}
// Observable gets current user geolocation from navigator.
const getCurrentPosition = new Observable<Position>(observer => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        observer.next(position);
      },
      navigatorError => { observer.error(navigatorError); },
      {maximumAge: 600000, timeout: 5000, enableHighAccuracy: true}
    );
  } else {
    observer.error('Geolocation not available');
  }
});

/**
 * HomeMapComponent
 */
@Component({
  selector: 'app-home-map',
  templateUrl: './home-map.component.html',
  styleUrls: ['./home-map.component.scss']
})
export class HomeMapComponent implements OnInit {
  loading: boolean;
  selectedStation: ChargingStation; // for station detail
  stationsList: ChargingStation[];

  // Map params
  driver: Marker;
  locationChosen = false;
  poiLat = 45.508048; // Default coordinates is MTL
  poiLng = -73.568025;
  zoom = 13;
  // Map marker's icons
  driverIconImage = 'assets/images/map/CarIcon_top_sm.png';
  driverIcon = {
      url: this.driverIconImage,
      scaledSize: {
          width: 60,
          height: 30
      }
  };
  poiIconImage = 'assets/images/map/iconPoi.png';
  poiIcon = {
      url: this.poiIconImage,
      scaledSize: {
          width: 30,
          height: 40
      }
  };

  constructor(
    private searchService: SearchStationsService,
    // private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.searchStationsNearMe();
  }

  onSubmit() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.findStations(this.poiLat, this.poiLng);
      // this.toastr.success('Profile updated.', 'Success!', {progressBar: true});
    }, 100);
  }

  /**
   * Method uses searchService (observer) to call api/find-station. Returns an array of CSs
   *
   * @param lat, lng
   */
  findStations(lat: number, lng: number): void {
    this.searchService.findStations(lat, lng)
      .subscribe(stationsList => {
        this.stationsList = stationsList;
        console.log('#'.repeat(100), ' #stationsList !!!: ', stationsList);
      });
  }
  /**
   * Event handler displays a marker on the map where click-ed
   *
   * @param event generated by a click-on-the-map
   */
  onChoseLocation(event) {
    this.poiLat = event.coords.lat;
    this.poiLng = event.coords.lng;
    this.locationChosen = true;
  }
  /**
   * Method get stations near User's location (navigator, if not avail, use MTL coords)
   * then, displays user ans CS on map.
   */
  searchStationsNearMe(): void {
    getCurrentPosition.subscribe( position => {
        this.poiLat = position.coords.latitude;
        this.poiLng = position.coords.longitude;
        // Get stations near User's location
        this.findStations(this.poiLat, this.poiLng);
      }, error => {
        console.log('# ERROR at searchStationsNearMe(). Message: ', error);
        // Get stations near default MTL coords
        this.findStations(this.poiLat, this.poiLng);
    });
  }
}

// /**
//  * Observable streams user geolocation from navigator.
//  * Check: https://angular.io/guide/observables#basic-usage-and-terms
//  */
// const streamUserPosition = new Observable((observer) => {
//   // Get the next and error callbacks when the consumer subscribes.
//   const {next, error} = observer;
//   let watchId;
//   // Simple geolocation API check provides values to publish
//   if ('geolocation' in navigator) {
//     watchId = navigator.geolocation.watchPosition(next, error);
//   } else {
//     error('Geolocation not available');
//   }
//   // When the consumer unsubscribes, clean up data ready for next subscription.
//   return {unsubscribe() { navigator.geolocation.clearWatch(watchId); }};
// });


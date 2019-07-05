import { Component, OnInit } from '@angular/core';
import { UserAccountInfoService, ReservationService } from '../../../shared/services/api.service';
import { ElectricVehicle } from '../../../shared/models/electric-vehicle';
import { UserInfo } from '../../../shared/models/user-account-data';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isLoading = true;
  myInfo: UserInfo;
  myEvs: ElectricVehicle[];
  myReservations: any[];

  userPk = JSON.parse(localStorage.getItem('userData'))['id'];

  constructor(
    private accountService: UserAccountInfoService,
    private reservationService: ReservationService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo(): void {
    this.accountService.getAccountInfo(this.userPk)
      .subscribe(userData => {
        this.myInfo = userData.user;
        this.myEvs = userData.evs;
        this.myReservations = userData.reservations;
        this.isLoading = !this.isLoading;
      });
  }

  cancelReservation(eventEvNk: string): void {
    this.reservationService.cancelReservation(eventEvNk)
      .subscribe(() => {
        this.toastr.success('Reservation canceled', 'Success!', {progressBar: true});
      }, () => {
        this.toastr.error('Error occured during cancelation', 'Error', {progressBar: true});
      }
    );
  }
}

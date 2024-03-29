import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import {
  Router,
  RouteConfigLoadStart,
  ResolveStart,
  RouteConfigLoadEnd,
  ResolveEnd
} from '@angular/router';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-driver-layout',
  templateUrl: './driver-layout.component.html',
  styleUrls: ['./driver-layout.component.scss']
})
export class DriverLayoutComponent implements OnInit {
  moduleLoading: boolean;
  @ViewChild(PerfectScrollbarDirective) perfectScrollbar: PerfectScrollbarDirective;

  constructor(
    public navService: NavigationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
        this.moduleLoading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.moduleLoading = false;
      }
    });
  }

}

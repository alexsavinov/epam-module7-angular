import {Component} from '@angular/core';
import {Location} from "@angular/common";


@Component({
  selector: 'app-access-denied-page',
  templateUrl: './access-denied-page.component.html',
  styleUrls: ['./access-denied-page.component.scss']
})
export class AccessDeniedPageComponent {

  constructor(private location: Location) {
  }

  back() {
    this.location.back();
    this.location.back();
  }
}

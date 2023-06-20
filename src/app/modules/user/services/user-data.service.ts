import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  creating = new BehaviorSubject<boolean>(false);

  constructor() {
  }
}

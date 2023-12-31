import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AuthDataService {

  isAuthenticated = new BehaviorSubject<boolean>(false);
  username = new BehaviorSubject<string>('');
  shoppingCardSize = new BehaviorSubject<number>(0);

  constructor() {
  }
}

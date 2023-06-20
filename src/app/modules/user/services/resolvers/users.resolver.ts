import {ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {Observable} from "rxjs";

import {IUser} from "../../interfaces";
import {UserService} from "../user.service";
import {UsersComponent} from "../../components";
import {AuthDataService} from "../../../auth/services";


export const usersResolver: ResolveFn<Observable<IUser[]>> = (route, state) => {

  // console.log(route)

  // let c = route.component as UsersComponent;

  // console.log(route.component)


  // let f = inject(DataService);
  // f.page.subscribe((data) => {
  //   console.log(data)
  // });

  // console.log(f.username);
  // let component: UsersComponent = route.component;
  // console.log(component)
  // let {data} =  route;
  // console.log(route.data)
  // console.log(state)
  return inject(UserService).getAll({});
};

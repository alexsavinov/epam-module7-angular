import {ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {Observable} from "rxjs";

import {IUser} from "../../interfaces";
import {UserService} from "../user.service";
import {AuthService} from "../../../auth/services";


export const userResolver: ResolveFn<Observable<IUser>> = (route, state) => {
  let id = route.paramMap.get('id');
  if (id == null) {
    id = inject(AuthService).getUserId()
  }

  return inject(UserService).getById(id);
};

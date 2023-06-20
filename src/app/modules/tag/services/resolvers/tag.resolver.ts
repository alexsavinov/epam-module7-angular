import {ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {EMPTY, Observable} from "rxjs";

import {ITag} from "../../interfaces";
import {TagService} from "../tag.service";


export const tagResolver: ResolveFn<Observable<ITag>> = (route, state) => {
  let id = route.paramMap.get('id');
  if (!id) {
    return EMPTY;
  }

  return inject(TagService).getById(id);
};

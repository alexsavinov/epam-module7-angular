import {CanDeactivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {map, Observable} from 'rxjs';

import {RegisterComponent} from '../../modules/auth/components';
import {ModalConfirmComponent} from '..';


export const formGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  if (checkUrl(currentState.url)) {
    const {form} = component as RegisterComponent;
    if (form.dirty) {
      return openConfirmDialog();
    }
  }

  return true;
};

function checkUrl(url: string) {
  const checkedUrls = [
    '/auth/register',
    '/users/',
    '/tags/',
    '/certificates/',
    '/orders/'
  ]

  const checkedResult = checkedUrls.filter(a => url.startsWith(a));

  return checkedResult.length > 0;
}

function openConfirmDialog(): Observable<boolean> {
  const dialog = inject(MatDialog);

  const dialogRef = dialog.open(ModalConfirmComponent);

  return dialogRef.afterClosed().pipe(map(result => result != undefined));
}

import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-modal-confirm-delete',
  templateUrl: './modal-confirm-delete.component.html',
  styleUrls: ['./modal-confirm-delete.component.scss']
})
export class ModalConfirmDeleteComponent {

  constructor(public dialogRef: MatDialogRef<ModalConfirmDeleteComponent>) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

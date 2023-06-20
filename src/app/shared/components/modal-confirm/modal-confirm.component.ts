import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent {

  constructor(public dialogRef: MatDialogRef<ModalConfirmComponent>,
              // @Inject(MAT_DIALOG_DATA) public data: DialogData) {
              ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// export interface DialogData {
//   animal: string;
//   name: string;
// }

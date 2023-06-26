import {Component, Inject, OnInit} from '@angular/core';
import {emptyOrder, ICreateOrderRequest, IOrder} from "../../interfaces";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IUser} from "../../../user/interfaces";
import {ICertificate} from "../../../certificate/interfaces";
import {CustomErrorStateMatcher, ModalConfirmComponent} from "../../../../shared";
import {OrderService} from "../../services";
import {UserService} from "../../../user/services";
import {CertificateService} from "../../../certificate/services";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UsersSelectComponent} from "../../../user/components";
import {CertificatesSelectComponent} from "../../../certificate/components";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  order: IOrder;

  constructor(private orderService: OrderService,
              public dialogRef: MatDialogRef<InvoiceComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { id: number, userId: string }) {
  }

  ngOnInit() {
    if (this.data) {
      const id: string = this.data['id'].toString();
      const userId: string = this.data['userId'];
      this.orderService.getByIdByUserId(id, userId).subscribe(data => {
        this.order = data as IOrder;
      });
    }
  }

  back(event: MouseEvent) {
    event.preventDefault();

    this.dialogRef.close(false)
  }

}

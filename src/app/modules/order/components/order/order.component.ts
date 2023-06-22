import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

import {CustomErrorStateMatcher, ModalConfirmComponent} from "../../../../shared";
import {emptyOrder, ICreateOrderRequest, IOrder} from "../../interfaces";
import {OrderService} from "../../services";
import {IUser} from "../../../user/interfaces";
import {ICertificate} from "../../../certificate/interfaces";
import {UsersSelectComponent} from "../../../user/components";
import {UserService} from "../../../user/services";
import {CertificatesSelectComponent} from "../../../certificate/components";
import {CertificateService} from "../../../certificate/services";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  order: IOrder;
  form: FormGroup;

  user: IUser | undefined;
  certificate: ICertificate | undefined;

  matcher = new CustomErrorStateMatcher();
  creating: boolean;

  infoMessage: string;
  errorMessage: string;

  constructor(private orderService: OrderService,
              private userService: UserService,
              private certificateService: CertificateService,
              private matDialog: MatDialog,
              public dialogRef: MatDialogRef<OrderComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { id: number, creating: boolean }) {
  }

  ngOnInit() {
    if (this.data) {
      if (this.data['creating']) {
        this.creating = true;
        this.order = emptyOrder();
        this.user = this.order.user;
        this.certificate = this.order.certificate;
        this._createForm();
      } else {
        const id: string = this.data['id'].toString();
        this.orderService.getById(id).subscribe(data => {
          this.order = data as IOrder;
          this.user = this.order.user;
          this.certificate = this.order.certificate;
          this._createForm();
        });
      }
    }
  }

  _createForm(): void {
    this.form = new FormGroup({
      certificate: new FormControl(
        this.order.certificate?.name,
        [
          Validators.required,
          Validators.minLength(4)
        ]),
      user: new FormControl(
        this.order.user?.name,
        [
          Validators.required,
          Validators.minLength(4)
        ]),
      price: new FormControl(
        this.order.price,
        [
          Validators.required,
          Validators.min(0)
        ]),
      createDate: new FormControl(
        this.order.createDate,
        [
          // Validators.required,
          // Validators.minLength(4)
        ]),
      lastUpdateDate: new FormControl(
        this.order.lastUpdateDate,
        [
          // Validators.required,
          // Validators.minLength(4)
        ])
    })
  }

  back(event: MouseEvent) {
    event.preventDefault();

    if (this.form.dirty) {
      const dialogRef = this.matDialog.open(ModalConfirmComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialogRef.close(false);
        }
      });
    } else {
      this.dialogRef.close(false)
    }
  }

  onSubmit(form: FormGroup) {
    this.errorMessage = '';
    this.infoMessage = '';

    if (this.creating) {
      this.createOrder(form);
    } else {
      this.updateOrder(form);
    }
  }

  private createOrder(form: FormGroup<any>) {
    const orderRequest: ICreateOrderRequest = {
      certificateId: this.certificate?.id || 0,
      userId: this.user?.id || 0,
      // price: form.value.price
    }
    if (form.value.price) {
      orderRequest.price = form.value.price;
    }

    this.orderService.create(orderRequest).subscribe({
        next: (value) => {
          this.infoMessage = `Order '${value.certificate?.name}' created..`;
          this.order = value;
          setTimeout(() => {
            this.form.reset();
            this.dialogRef.close(value.certificate?.name);
          }, 2000);
        },
        error: e => {
          this.errorMessage = e.message;
        }
      }
    )
  }

  private updateOrder(form: FormGroup<any>) {
    const order: IOrder = {
      id: this.order.id as number,
      certificate: this.certificate,
      user: this.user,
      price: form.value.price
    }

    this.orderService.update(order).subscribe({
        next: (value) => {
          this.infoMessage = `Order (id=${value.id}) updated..`;
          this.order = value;
          setTimeout(() => {
            this.form.reset();
            this.dialogRef.close(value.certificate?.name);
          }, 2000);
        },
        error: e => {
          this.errorMessage = e.message;
        }
      }
    )
  }

  selectUser(event: Event) {
    event.preventDefault();

    const dialogRef = this.matDialog.open(UsersSelectComponent);

    dialogRef.afterClosed().subscribe(userId => {
      if (userId) {
        this.userService.getById(userId).subscribe(data => {
          this.user = data as IUser;
          this.form.controls['user'].setValue(this.user.name);
        });
      }
    });

  }

  selectCertificate(event: Event) {
    event.preventDefault();

    const dialogRef = this.matDialog.open(CertificatesSelectComponent);

    dialogRef.afterClosed().subscribe(certificateId => {
      if (certificateId) {
        this.certificateService.getById(certificateId).subscribe(data => {
          this.certificate = data as ICertificate;
          this.form.controls['certificate'].setValue(this.certificate.name);
        });
      }
    });
  }
}

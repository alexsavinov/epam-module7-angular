import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {IOrder} from '../../interfaces';
import {OrderService} from '../../services';


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

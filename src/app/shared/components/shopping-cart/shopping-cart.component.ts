import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatListOption} from '@angular/material/list';

import {ICertificate} from '../../../modules/certificate/interfaces';
import {ICreateOrderRequest} from '../../../modules/order/interfaces';
import {AuthDataService, AuthService} from '../../../modules/auth/services';
import {CertificateService} from '../../../modules/certificate/services';
import {OrderService} from '../../../modules/order/services';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  certificates: ICertificate[] = [];
  userId: string;
  totalSum: number = 0;
  totalSumSelected: number = 0;

  infoMessage: string[];
  errorMessage: string;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private dataService: AuthDataService,
              private authService: AuthService,
              private certificateService: CertificateService,
              private orderService: OrderService) {
  }

  ngOnInit(): void {
    if (this.authService.checkAccess()) {
      return;
    }

    this.userId = this.authService.getUserId();

    const shoppingCard: number[] = this.authService.getShoppingCard();

    for (const id of shoppingCard) {
      this.certificateService.getById(id.toString()).subscribe(data => {
        this.certificates.push(data);
        this.totalSum += data.price;
      });
    }
  }

  delete(selected: MatListOption[]) {
    selected.forEach(item => {
      const {id} = item._hostElement;
      this.certificates = this.certificates.filter(item => item.id !== parseInt(id));
      const shoppingCardSize: number = this.authService.removeFromShoppingCard(parseInt(id));
      this.dataService.shoppingCardSize.next(shoppingCardSize);
    })

    this.setTotalSum();
    this.totalSumSelected = 0;
  }

  checkout(selected: MatListOption[]) {
    this.infoMessage = [];
    this.errorMessage = '';

    let arrayId: number[];

    if (selected.length) {
      arrayId = selected.map(item => parseInt(item._hostElement.id));
    } else {
      arrayId = this.certificates.map(item => item.id!);
    }

    for (let index = arrayId.length - 1; index >= 0; index--) {
      const id: number = arrayId[index];
      const orderRequest: ICreateOrderRequest = {
        certificateId: id,
        userId: parseInt(this.userId),
        // price: form.value.price
      }
      this.createOrder(index, orderRequest, id);
    }

    this.totalSumSelected = 0;
  }

  createOrder(index: number, orderRequest: ICreateOrderRequest, id: number) {
    return (function (context, ind) {
      setTimeout(function () {
        context.orderService.create(orderRequest).subscribe({
            next: (value) => {
              context.infoMessage.push(`Order '${value.certificate?.name}' created (id=${value.id}).`);
              context.certificates = context.certificates.filter(cert => cert.id !== id);
              context.authService.removeFromShoppingCard(id);
              context.dataService.shoppingCardSize.next(context.certificates.length);
              context.setTotalSum();
            },
            error: e => {
              context.errorMessage += e.message;
            }
          }
        )
      }, 1000 + (1000 * ind));
    })(this, index);
  }

  setTotalSum() {
    this.totalSum = this.certificates
      .reduce<number>((sum: number, person) => sum + person.price, 0);
  }

  expiredInDays(certificate: ICertificate): number {
    if (certificate.createDate) {
      const diffTime = Math.abs(new Date().getTime() - new Date(certificate.createDate).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  }

  select(selected: MatListOption[]) {
    const selectedId = selected.map(item => item._hostElement.id);
    this.totalSumSelected = this.certificates
      .filter(x => selectedId.includes(String(x.id)))
      .reduce<number>((sum: number, person) => sum + person.price, 0);
  }
}

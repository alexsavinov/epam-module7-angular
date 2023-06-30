import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

import {IOrder} from '../../interfaces';
import {IPageable} from '../../../../shared/interfaces';
import {OrderComponent} from '../order/order.component';
import {ModalConfirmDeleteComponent} from '../../../../shared';
import {AuthDataService, AuthService} from '../../../auth/services';
import {OrderService} from '../../services';
import {EnumRole} from '../../../auth/interfaces';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'certificate', 'user', 'price', 'createDate', 'lastUpdateDate', 'action'];
  dataSource: MatTableDataSource<IOrder>;
  pageEvent: PageEvent;
  @Output()
  page: EventEmitter<PageEvent>

  totalElements: number;
  totalPages: number;
  size: number = 10;
  number: number = 0;
  numberOfElements: number;

  sortString: string = 'id';
  direction: string = 'asc';

  infoMessage: string;
  errorMessage: string;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private dataService: AuthDataService,
              private orderService: OrderService,
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    if (this.authService.checkAccess(EnumRole.ROLE_ADMIN)) {
      return;
    }

    this.fetchData();
  }

  private fetchData() {
    const pageable: IPageable = {
      page: this.number,
      size: this.size,
      sort: this.sortString,
      direction: this.direction
    }

    this.orderService.getAll(pageable).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data.content);
      this.totalElements = data.totalElements;
      this.number = data.number;
      this.totalPages = data.totalPages;
      this.numberOfElements = data.numberOfElements;
    });
  }

  delete(id: number) {
    this.errorMessage = '';
    this.infoMessage = '';

    const dialogRef = this.matDialog.open(ModalConfirmDeleteComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderService.deleteById(id.toString()).subscribe(
          value => {
            this.dataSource.data = this.dataSource.data.filter(i => i.id != id);
            this.dataSource._updateChangeSubscription();
            this.infoMessage = `Order (id=${id}) has been deleted!`;
          },
          error => {
            this.errorMessage = error.message;
          });
      }
    });
  }

  getServerData(event: PageEvent) {
    this.number = event.pageIndex;
    this.size = event.pageSize;
    this.fetchData();
    return event;
  }

  sortData(event: Sort) {
    this.sortString = event.active;
    this.direction = event.direction
    this.fetchData();
  }

  create() {
    const dialogRef = this.matDialog.open(
      OrderComponent,
      {data: {id: undefined, creating: true}}
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchData();
        this.infoMessage = `Order '${result}' was created!`;
      }
    });
  }

  edit(id: number) {
    const dialogRef = this.matDialog.open(
      OrderComponent,
      {data: {id: id, creating: false}}
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchData();
        this.infoMessage = `Order '${result}' was updated!`;
      }
    });
  }
}

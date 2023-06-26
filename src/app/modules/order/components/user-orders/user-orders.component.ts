import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";

import {IPageable} from "../../../../shared/interfaces";
import {IOrder} from "../../interfaces";
import {ITag} from "../../../tag/interfaces";
import {AuthService} from "../../../auth/services";
import {OrderService} from "../../services";
import {TagService} from "../../../tag/services";
import {InvoiceComponent} from "..";


@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss']
})
export class UserOrdersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'certificate', 'price', 'createDate', 'action'];
  dataSource: MatTableDataSource<IOrder>;
  pageEvent: PageEvent;
  @Output()
  page: EventEmitter<PageEvent>

  userId: string;
  topUsedTag: ITag;
  highestCost: number;

  totalElements: number;
  totalPages: number;
  size: number = 10;
  number: number = 0;
  numberOfElements: number;

  sortString: string = 'createDate';
  direction: string = 'desc';

  infoMessage: string;
  errorMessage: string;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private tagService: TagService,
              private orderService: OrderService,
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    this.tagService.getTopUsedTag(this.userId).subscribe((data) => {
      this.topUsedTag = data;
    });

    this.orderService.getHighestCostByUserId(this.userId).subscribe((data) => {
      this.highestCost = data.highestCost;
    });

    this.fetchData();
  }

  private fetchData() {
    const pageable: IPageable = {
      page: this.number,
      size: this.size,
      sort: this.sortString,
      direction: this.direction
    }

    this.orderService.getAllByUserId(this.userId, pageable).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data.content);
      this.totalElements = data.totalElements;
      this.number = data.number;
      this.totalPages = data.totalPages;
      this.numberOfElements = data.numberOfElements;
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

  edit(id: number) {
    const dialogRef = this.matDialog.open(
      InvoiceComponent,
      {data: {id: id, userId: this.userId}}
    );

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.fetchData();
    //     this.infoMessage = `Order '${result}' was updated!`;
    //   }
    // });
  }
}

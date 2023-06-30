import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';

import {IPageable} from '../../../../shared/interfaces';
import {ICertificate} from '../../interfaces';
import {AuthDataService, AuthService} from '../../../auth/services';
import {CertificateService} from '../../services';
import {ModalConfirmDeleteComponent} from '../../../../shared';
import {EnumRole} from '../../../auth/interfaces';
import {CertificateComponent} from '..';


@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent implements OnInit {
  hasRoleAdmin: boolean;

  displayedColumns: string[] = ['id', 'name', 'description', 'price', 'duration', 'tags', 'action'];
  dataSource: MatTableDataSource<ICertificate>;
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

  constructor(private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private router: Router,
              private dataService: AuthDataService,
              private certificateService: CertificateService,
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.hasRoleAdmin = this.authService.hasRole(EnumRole.ROLE_ADMIN);
    this.fetchData();
  }

  private fetchData() {
    const pageable: IPageable = {
      page: this.number,
      size: this.size,
      sort: this.sortString,
      direction: this.direction
    }

    this.certificateService.getAll(pageable).subscribe((data) => {
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
        this.certificateService.deleteById(id.toString()).subscribe(
          value => {
            this.dataSource.data = this.dataSource.data.filter(i => i.id != id);
            this.dataSource._updateChangeSubscription();
            this.infoMessage = `Certificate (id=${id}) has been deleted!`;
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
      CertificateComponent,
      {data: {id: undefined, creating: true}}
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchData();
        this.infoMessage = `Certificate '${result}' was created!`;
      }
    });
  }

  edit(id: number) {
    const dialogRef = this.matDialog.open(
      CertificateComponent,
      {data: {id: id, creating: false}}
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchData();
        this.infoMessage = `Certificate '${result}' was updated!`;
      }
    });
  }
}

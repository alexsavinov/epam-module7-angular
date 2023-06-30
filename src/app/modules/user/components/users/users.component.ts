import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";

import {IPageable} from "../../../../shared/interfaces";
import {IUser} from "../../interfaces";
import {ModalConfirmDeleteComponent} from "../../../../shared";
import {UserService} from "../../services";
import {AuthDataService, AuthService} from "../../../auth/services";
import {UserComponent} from "..";
import {EnumRole} from "../../../auth/interfaces";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'roles', 'action'];
  dataSource: MatTableDataSource<IUser>;
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
              private userService: UserService,
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

    this.userService.getAll(pageable).subscribe((data) => {
      // console.log(data)
      this.dataSource = new MatTableDataSource(data.content);
      // this.dataSource.paginator.;
      this.totalElements = data.totalElements;
      // this.size = data.size;
      this.number = data.number;
      this.totalPages = data.totalPages;
      this.numberOfElements = data.numberOfElements;
    });
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.setFilter(filterValue.trim().toLowerCase());

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }

  delete(id: number) {
    this.errorMessage = '';
    this.infoMessage = '';

    const dialogRef = this.matDialog.open(ModalConfirmDeleteComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteById(id).subscribe(
          value => {
            this.dataSource.data = this.dataSource.data.filter(i => i.id != id);
            this.dataSource._updateChangeSubscription();
            this.infoMessage = `User (id=${id}) has been deleted!`;
          },
          error => {
            this.errorMessage = error.message;
          });
      }
    });
  }

  getServerData(event: PageEvent) {
    // console.log('getServerData', event)
    this.number = event.pageIndex;
    this.size = event.pageSize;
    this.fetchData();
    return event;
  }

  sortData(event: Sort) {
    this.sortString = event.active;
    this.direction = event.direction
    this.fetchData();
    // console.log('sortData', event)
  }

  create() {
    // this.router.navigate(['users/add']);
    const dialogRef = this.matDialog.open(
      UserComponent,
      {data: {id: undefined, creating: true}}
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchData();
        this.infoMessage = `User '${result}' was created!`;
      }
    });
  }

  edit(id: number) {

    // this.router.navigate(['/users/' + id])

    // return dialogRef.afterClosed().pipe(map(result => result != undefined));

    const dialogRef = this.matDialog.open(
      UserComponent,
      {data: {id: id, creating: false}}
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchData();
        this.infoMessage = `User '${result}' was updated!`;
      }
    });
  }
}

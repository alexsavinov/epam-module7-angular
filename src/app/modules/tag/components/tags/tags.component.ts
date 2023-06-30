import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

import {IPageable} from '../../../../shared/interfaces';
import {ITag} from '../../interfaces';
import {AuthDataService, AuthService} from '../../../auth/services';
import {ModalConfirmDeleteComponent} from '../../../../shared';
import {TagService} from '../../services';
import {TagComponent} from '../tag/tag.component';
import {EnumRole} from '../../../auth/interfaces';


@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  hasRoleAdmin: boolean;

  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: MatTableDataSource<ITag>;
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
              private router: Router,
              private authService: AuthService,
              private dataService: AuthDataService,
              private tagService: TagService,
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

    this.tagService.getAll(pageable).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data.content);
      this.totalElements = data.totalElements;
      this.number = data.number;
      this.totalPages = data.totalPages;
      this.numberOfElements = data.numberOfElements;
    });
  }

  private clearMessages() {
    this.errorMessage = '';
    this.infoMessage = '';
  }

  delete(id: number) {
    this.clearMessages();

    const dialogRef = this.matDialog.open(ModalConfirmDeleteComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tagService.deleteById(id.toString()).subscribe(
          value => {
            this.dataSource.data = this.dataSource.data.filter(i => i.id != id);
            this.dataSource._updateChangeSubscription();
            this.infoMessage = `Tag (id=${id}) has been deleted!`;
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
    this.clearMessages();

    const dialogRef = this.matDialog.open(
      TagComponent,
      {data: {id: undefined, creating: true}}
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchData();
        this.infoMessage = `Tag '${result}' was created!`;
      }
    });
  }

  edit(id: number) {
    this.clearMessages();

    const dialogRef = this.matDialog.open(
      TagComponent,
      {data: {id: id, creating: false}}
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchData();
        this.infoMessage = `Tag '${result}' was updated!`;
      }
    });
  }
}

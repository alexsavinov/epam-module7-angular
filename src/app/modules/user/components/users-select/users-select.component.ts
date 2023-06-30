import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialogRef} from '@angular/material/dialog';

import {IUser} from '../../interfaces';
import {IPageable} from '../../../../shared/interfaces';
import {UserService} from '../../services';

@Component({
  selector: 'app-users-select',
  templateUrl: './users-select.component.html',
  styleUrls: ['./users-select.component.scss']
})
export class UsersSelectComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name'];
  dataSource: MatTableDataSource<IUser>;
  pageEvent: PageEvent;
  @Output()
  page: EventEmitter<PageEvent>

  totalElements: number;
  size: number;
  number: number;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private userService: UserService, public dialogRef: MatDialogRef<UsersSelectComponent>) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  private fetchData() {
    const pageable: IPageable = {
      page: this.number,
      size: this.size,
      sort: 'id',
      direction: 'asc'
    }

    this.userService.getAll(pageable).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data.content);
      this.totalElements = data.totalElements;
      this.number = data.number;
    });
  }

  getServerData(event: PageEvent) {
    this.number = event.pageIndex;
    this.size = event.pageSize;
    this.fetchData();
    return event;
  }

  selectUser(id: string) {
    this.dialogRef.close(id);
  }
}

import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";

import {IPageable} from "../../../../shared/interfaces";
import {ITag} from "../../interfaces";
import {AuthDataService} from "../../../auth/services";
import {ModalConfirmDeleteComponent} from "../../../../shared";
import {TagService} from "../../services";


@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
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
              private dataService: AuthDataService,
              private tagService: TagService,
              private matDialog: MatDialog) {
  }

   ngOnInit(): void {
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

  delete(id: number) {
    this.errorMessage = '';
    this.infoMessage = '';

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
    this.router.navigate(['tags/add']);
  }
}

import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {MatSort, Sort} from "@angular/material/sort";

import {CertificateService} from "../../services";
import {IPageable} from "../../../../shared/interfaces";
import {ICertificate, ISearchRequest} from "../../interfaces";
import {AuthDataService, AuthService} from "../../../auth/services";


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  displayedColumns: string[] = ['createDate', 'name', 'description', 'price', 'duration', 'tags', 'action'];
  dataSource: MatTableDataSource<ICertificate>;
  pageEvent: PageEvent;
  @Output()
  page: EventEmitter<PageEvent>

  totalElements: number;
  totalPages: number;
  size: number = 10;
  number: number = 0;
  numberOfElements: number;

  sortString: string = 'createDate';
  direction: string = 'asc';
  searchRequest: ISearchRequest = {};
  filterString: string = '';

  infoMessage: string;
  errorMessage: string;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private dataService: AuthDataService,
              private certificateService: CertificateService,
              private authService: AuthService,
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.setFilter(filterValue.trim());

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setFilter(filterValue: string) {
    this.searchRequest = {};

    const regexName = /^([^#]+)/;
    const resultName = filterValue.match(regexName);
    if (resultName) {
      this.searchRequest.name = resultName[1].trim();
    }

    const regexTag = /(#\(([^)]+)\))?/gi;
    const resultTags = [...filterValue.matchAll(regexTag)]
      .filter(i => i[2])
      .map(i => i[2])
      .join(', ')

    if (resultTags) {
      this.searchRequest.tags = resultTags;
    }

    this.fetchData();
    this.updateQueryParams();
  }


  private fetchData() {
    const pageable: IPageable = {
      page: this.number,
      size: this.size,
      sort: this.sortString,
      direction: this.direction
    }

    this.certificateService.search(pageable, this.searchRequest).subscribe((data) => {
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

  order(id: number) {
    const shoppingCardSize = this.authService.addToShoppingCard(id);
    this.dataService.shoppingCardSize.next(shoppingCardSize);
  }

  filterTag(tag: string) {
    if (this.searchRequest.tags?.includes(tag)) {
      return;
    }
    this.number = 0;
    this.searchRequest.tags = ((this.searchRequest.tags) ? this.searchRequest.tags + ', ' : '') + tag;
    this.filterString = ((this.filterString) ? this.filterString + ' ' : '') + `#(${tag})`;
    this.fetchData();
    this.updateQueryParams();
  }

  private updateQueryParams() {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: this.searchRequest
      });
  }
}

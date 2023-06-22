import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {IPageable} from "../../../../shared/interfaces";
import {MatTableDataSource} from "@angular/material/table";
import {CertificateService} from "../../services";
import {ICertificate, ISearchRequest} from "../../interfaces";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  dataSource = new MyDataSource(this.certificateService, {});

  constructor(private certificateService: CertificateService) {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const filterValue1 = filterValue.trim().toLowerCase();
    // this.setFilter(filterValue1);

    // this.dataSource = new MyDataSource(this.certificateService, {name: filterValue1});
    // this.dataSource.disconnect()
    let dataSource = new MyDataSource(this.certificateService, {});

    console.log(filterValue1)
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  setFilter(filterValue: string) {
    // this.dataSource.filter = filterValue;
  }
}

class MyDataSource extends DataSource<ICertificate | undefined> {
  private _length = 1000;
  private _pageSize = 10;
  private _cachedData = Array.from<ICertificate>({length: this._length});
  private _fetchedPages = new Set<number>();
  private readonly _dataStream = new BehaviorSubject<(ICertificate | undefined)[]>(this._cachedData);
  private readonly _subscription = new Subscription();
  private _totalElements: number;

  constructor(private certificateService: CertificateService, private searchRequest: ISearchRequest) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<(ICertificate | undefined)[]> {
    this._subscription.add(
      collectionViewer.viewChange.subscribe(range => {
        const startPage = this._getPageForIndex(range.start);
        const endPage = this._getPageForIndex(range.end - 1);
        for (let i = startPage; i <= endPage; i++) {
          this._fetchPage(i);
        }
      }),
    );
    return this._dataStream;
  }

  disconnect(): void {
    this._subscription.unsubscribe();
  }

  private _getPageForIndex(index: number): number {
    return Math.floor(index / this._pageSize);
  }

  private _fetchPage(page: number) {
    if (this._fetchedPages.has(page)) {
      return;
    }
    this._fetchedPages.add(page);

    // Use `setTimeout` to simulate fetching data from server.
    setTimeout(() => {
      const pageable: IPageable = {page: page, size: this._pageSize, sort: 'id', direction: 'asc'};
      const searchRequest: ISearchRequest = {name: '', tags: 'tag6'};

      this.certificateService.search(pageable, searchRequest).subscribe((data) => {
        if (!this._totalElements) {
          this._totalElements = data.totalElements;
          this._length = this._totalElements;
          this._cachedData = Array.from<ICertificate>({length: this._totalElements})
        }

        this._cachedData.splice(
          page * this._pageSize,
          this._pageSize,
          ...Array.from(data.content as ICertificate[])
        );
        this._dataStream.next(this._cachedData);
      });
    }, Math.random() * 1000 + 500);
  }
}

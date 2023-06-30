import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatDialogRef} from '@angular/material/dialog';

import {IPageable} from '../../../../shared/interfaces';
import {ICertificate} from '../../interfaces';
import {CertificateService} from '../../services';


@Component({
  selector: 'app-certificates-select',
  templateUrl: './certificates-select.component.html',
  styleUrls: ['./certificates-select.component.scss']
})
export class CertificatesSelectComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name'];
  dataSource: MatTableDataSource<ICertificate>;
  pageEvent: PageEvent;
  @Output()
  page: EventEmitter<PageEvent>

  totalElements: number;
  size: number;
  number: number;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private certificateService: CertificateService,
              public dialogRef: MatDialogRef<CertificatesSelectComponent>) {
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

    this.certificateService.getAll(pageable).subscribe((data) => {
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

  selectCertificate(id: string) {
    this.dialogRef.close(id);
  }
}

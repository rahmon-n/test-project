import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'doc-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
  ],
})
export class DocumentTableComponent implements AfterViewInit, OnChanges {
  @Input() documents: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'id',
    'correspondent',
    'access',
    'control',
    'deliveryMethod',
    'executionDate',
    'file',
    'regDate',
    'subject',
  ];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['documents'] && changes['documents'].currentValue) {
      this.dataSource.data = this.documents;

      if (this.sort) {
        this.dataSource.sort = this.sort;
      }

      this.cdr.detectChanges();
    }
  }
}

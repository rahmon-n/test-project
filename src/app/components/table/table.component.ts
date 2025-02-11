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
import { MatDialog } from '@angular/material/dialog';
import { DocumentModalComponent } from '../document-modal/document-modal.component';
import { PrintDialogComponent } from '../print-dialog/print-dialog.component';
import { DatePipe } from '@angular/common';

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
    DatePipe,
  ],
})
export class DocumentTableComponent implements AfterViewInit, OnChanges {
  @Input() documents: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'regNumber',
    'regDate',
    'outgoingNumber',
    'outgoingDate',
    'file',
    'correspondent',
    'subject',
    'actions',
  ];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private cdr: ChangeDetectorRef, private dialog: MatDialog) {}

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

  openEditDialog(document: any): void {
    this.dialog.open(DocumentModalComponent, {
      width: '600px',
      data: document,
    });
  }

  openPrintDialog(document: any): void {
    this.dialog.open(PrintDialogComponent, {
      width: '600px',
      data: { document },
    });
  }
}

import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'print-dialog',
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    DatePipe,
  ],
  template: `
    <h2 mat-dialog-title>Реквизиты документа</h2>
    <mat-dialog-content>
      <p>
        <strong>Регистрационный номер:</strong> {{ data.document.regNumber }}
      </p>
      <p>
        <strong>Дата регистрации:</strong>
        {{ data.document.regDate | date : 'dd.MM.yyyy' }}
      </p>
      <p>
        <strong>Исходящий номер документа:</strong>
        {{ data.document.outgoingNumber }}
      </p>
      <p>
        <strong>Дата исходящего документа:</strong>
        {{ data.document.outgoingDate | date : 'dd.MM.yyyy' }}
      </p>
      <p><strong>Форма доставки:</strong> {{ data.document.deliveryMethod }}</p>
      <p><strong>Корреспондент:</strong> {{ data.document.correspondent }}</p>
      <p><strong>Тема:</strong> {{ data.document.subject }}</p>
      <p><strong>Описание:</strong> {{ data.document.description }}</p>
      <p>
        <strong>Срок исполнения:</strong>
        {{ data.document.executionDate | date : 'dd.MM.yyyy' }}
      </p>
      <p><strong>Доступ:</strong> {{ data.document.access ? 'Да' : 'Нет' }}</p>
      <p>
        <strong>Контроль:</strong> {{ data.document.control ? 'Да' : 'Нет' }}
      </p>
      <p>
        <strong>Файл:</strong>
        @if (data.document.file) {
        <a [href]="baseUrl + '/' + data.document.file" target="_blank">
          Посмотреть файл</a
        >
        } @else { Нет файла }
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" (click)="print()">
        Печать
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      @media print {
        button {
          display: none;
        }
      }
    `,
  ],
})
export class PrintDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('Data:', data);
  }

  baseUrl = environment.baseUrl;

  print() {
    window.print();
  }
}

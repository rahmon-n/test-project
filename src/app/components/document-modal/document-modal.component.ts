import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  provideNativeDateAdapter,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { PrintDialogComponent } from '../print-dialog/print-dialog.component';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-document-modal',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    provideNativeDateAdapter(),
  ],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.scss'],
})
export class DocumentModalComponent {
  @Output() documentSaved = new EventEmitter<void>();
  documentForm: FormGroup;
  serverResponse: any = null;
  isLoaded = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public documentData: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DocumentModalComponent>,
    private snackbar: MatSnackBar,
    private http: HttpClient,
    private printDialog: MatDialog
  ) {
    this.documentForm = this.fb.group(
      {
        regNumber: [
          documentData?.regNumber || '',
          [Validators.required, Validators.pattern(/^(?=.*\d)[\w\W]+$/)],
        ],
        regDate: [
          documentData?.regDate ? new Date(documentData.regDate) : new Date(),
          [Validators.required, this.validateTodayDate],
        ],
        outgoingNumber: [
          documentData?.outgoingNumber || '',
          [Validators.pattern(/^(?=.*\d)[\w\W]+$/)],
        ],
        outgoingDate: [
          documentData?.outgoingDate
            ? new Date(documentData.outgoingDate)
            : null,
          this.validateOutgoingDate,
        ],
        deliveryMethod: [documentData?.deliveryMethod || ''],
        correspondent: [documentData?.correspondent || '', Validators.required],
        subject: [
          documentData?.subject || '',
          [Validators.required, Validators.maxLength(100)],
        ],
        description: [
          documentData?.description || '',
          [Validators.maxLength(1000)],
        ],
        executionDate: [
          documentData?.executionDate
            ? new Date(documentData.executionDate)
            : null,
        ],
        access: [documentData?.access || false],
        control: [documentData?.control || false],
        file: [documentData?.file || null], // Если файл есть, подставляем его путь
      },
      { validators: this.validateExecutionDate }
    );

    this.documentForm.get('executionDate')?.valueChanges.subscribe(() => {
      this.documentForm.updateValueAndValidity();
    });
  }

  validateTodayDate(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate.toDateString() !== today.toDateString()) {
      return { notToday: true };
    }
    return null;
  }

  validateOutgoingDate(control: AbstractControl) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      return { futureDate: true };
    }

    return null;
  }

  validateExecutionDate(formGroup: FormGroup): ValidationErrors | null {
    const regDate = formGroup.get('regDate')?.value;
    const executionDate = formGroup.get('executionDate')?.value;

    if (
      executionDate &&
      regDate &&
      new Date(executionDate) < new Date(regDate)
    ) {
      formGroup.get('executionDate')?.setErrors({ invalidExecutionDate: true });

      return null;
    } else {
      formGroup.get('executionDate')?.setErrors(null);
    }

    return null;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    console.log(file);
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const maxSize = 1 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      this.documentForm.get('file')?.setErrors({ invalidFormat: true });
      return;
    }

    if (file.size > maxSize) {
      this.documentForm.get('file')?.setErrors({ maxSizeExceeded: true });
      return;
    }

    this.uploadFile(file);
  }

  uploadFile(file: File): void {
    const formData = new FormData();
    formData.append('file', file);

    this.http
      .post(`${environment.baseUrl}/documents/upload`, formData)
      .subscribe({
        next: (response: any) => {
          this.documentForm.patchValue({ file: response?.file.path });
        },
        error: (error) => {
          console.error('Upload error', error);
        },
      });
  }

  removeFile(): void {
    this.documentForm.patchValue({ file: null });
  }

  print(): void {
    this.printDialog.open(PrintDialogComponent, {
      data: { document: this.serverResponse },
    });
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.documentForm.valid) {
      this.http
        .post(`${environment.baseUrl}/documents`, this.documentForm.value)
        .subscribe({
          next: (response: any) => {
            this.snackbar.open('Документ сохранен', 'Закрыть', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.documentSaved.emit();
            this.serverResponse = response;
            this.isLoaded = true;
          },
          error: (error) => {
            console.error('Upload error', error);
          },
        });
    } else {
      this.documentForm.markAllAsTouched();
    }
  }
}

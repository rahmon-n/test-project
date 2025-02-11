import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { DocumentModalComponent } from './components/document-modal/document-modal.component';
import { HttpClient } from '@angular/common/http';
import { DocumentTableComponent } from './components/table/table.component';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, MatButtonModule, DocumentTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  documents: any[] = [];
  constructor(private dialog: MatDialog, private http: HttpClient) {}

  ngOnInit() {
    this.fetchDocuments();
  }

  fetchDocuments() {
    this.http.get('http://localhost:3000/documents').subscribe({
      next: (data: any) => {
        this.documents = data;
      },
      error: (error) => console.error('Error fetching documents:', error),
    });
  }

  openModal(): void {
    this.dialog.open(DocumentModalComponent, {
      width: '600px',
    });
  }
}

import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { DocumentModalComponent } from './components/document-modal/document-modal.component';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  constructor(private dialog: MatDialog) {}

  openModal(): void {
    this.dialog.open(DocumentModalComponent, {
      width: '500px'
    });
  }
}

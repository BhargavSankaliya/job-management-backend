import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [NgIf],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent {

  constructor(public dialogRef: MatDialogRef<DeleteModalComponent>, @Inject(MAT_DIALOG_DATA) public data: DeleteData) { }

  confirm() {
    this.dialogRef.close({ success: true })
  }

}

export interface DeleteData {
  title: string
  description: string
  buttonName: string
}

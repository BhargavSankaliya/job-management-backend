import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../task.service';
import { notification } from 'assets/notifications.library';

@Component({
  selector: 'app-completed-task',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor],
  templateUrl: './completed-task.component.html',
  styleUrl: './completed-task.component.scss'
})
export class CompletedTaskComponent implements OnInit {

  completeForm: FormGroup;

  constructor(public formBuilder: FormBuilder, public taskService: TaskService, public dialogRef: MatDialogRef<CompletedTaskComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.defaultForm();
  }

  defaultForm() {
    this.completeForm = this.formBuilder.group({
      remark: ['']
    })
  }

  selectedFile: any; // Holds the selected file
  imagePreview: string | null = null; // Holds the image preview URL
  pdfPreview: string | null = null;
  pdfFileName: string | null = null;

  // Handles single file selection and generates an image preview
  // selectFile(event: Event): void {
  //   const input = event.target as HTMLInputElement;

  //   if (input.files && input.files.length > 0) {
  //     this.selectedFile = input.files[0]; // Store the selected file
  //     const reader = new FileReader();
  //     reader.onload = (e: ProgressEvent<FileReader>) => {
  //       if (e.target && e.target.result) {
  //         this.imagePreview = e.target.result as string; // Set the image preview URL
  //       }
  //     };
  //     reader.readAsDataURL(this.selectedFile); // Read the file as a Data URL
  //   }

  //   // Clear the input value to allow re-upload of the same file
  //   input.value = '';
  // }

  selectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const fileType = this.selectedFile.type;

      if (fileType.startsWith('image/')) {
        // Show image preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreview = e.target.result;
          this.pdfPreview = null;
          this.pdfFileName = null;
        };
        reader.readAsDataURL(this.selectedFile);
      } else if (fileType === 'application/pdf') {
        // Show PDF file name and enable download
        this.imagePreview = null;
        this.pdfFileName = this.selectedFile.name;
        this.pdfPreview = URL.createObjectURL(this.selectedFile);
      }
    }

    input.value = '';
  }

  async completeTask() {

    let uploadObject: FormData = new FormData();
    uploadObject.append("remark", this.completeForm.value.remark);
    uploadObject.append("billingPicture", this.selectedFile)

    let task: any = await this.taskService.updateTaskStatusCompleted(this.data.taskId, this.data.status, uploadObject);
    notification("success", "Update task status to billing", 1000);
    this.dialogRef.close({ success: true });
  }

  clearFile(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.pdfPreview = null;
    this.pdfFileName = null;
  }


}

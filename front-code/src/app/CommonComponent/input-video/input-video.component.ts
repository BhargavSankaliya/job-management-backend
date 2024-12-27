import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { CategoryService } from 'app/backend/product/category/category.service';

@Component({
  selector: 'app-input-video',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './input-video.component.html',
  styleUrl: './input-video.component.scss'
})
export class InputVideoComponent {

  @Output() selectFile = new EventEmitter<any>();
  @Input() oldSelectFile: any[] = [];
  @Input() isMultiple: boolean = false;
  @Input() uploadImagePath: string = '';
  @ViewChild("file") fileRef: ElementRef;
  sanitizeImagePreview;

  constructor(public menuService: CategoryService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngAfterViewInit(): void {

  }

  async selectFiles(event: any) {

    if (!this.isMultiple) {
      this.oldSelectFile = []
    }
    let checkFile = event.target.files;
    for (let i = 0; i < checkFile.length; i++) {
      const file: any = checkFile[i];
      let uploadObject: FormData = new FormData();
      uploadObject.append(this.uploadImagePath, file)
      let uploadFiles = await this.menuService.uploadImage(uploadObject, this.uploadImagePath);
      this.oldSelectFile.push(uploadFiles)
    }

    this.selectFile.emit(this.oldSelectFile);
    this.fileRef.nativeElement.value = ''
  }


  removeFile(event: any) {
    this.oldSelectFile.splice(event, 1);
    this.selectFile.emit(this.oldSelectFile)
  }


}

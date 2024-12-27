import { Component, ElementRef, EventEmitter, Input, AfterViewInit, Output, ViewChild, Inject, Renderer2, ChangeDetectorRef, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageCropComponent } from '../image-crop/image-crop.component';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { InputCropComponent } from '../input-crop/input-crop.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-image',
  templateUrl: './input-image.component.html',
  styleUrl: './input-image.component.scss',
  standalone: true,
  imports: [InputCropComponent, NgFor, NgIf, NgClass, FormsModule, ReactiveFormsModule]
})
export class InputImageComponent implements AfterViewInit {

  @Output() selectFile = new EventEmitter<any>();
  @Input() oldSelectFile: any[] = [];
  @Input() isMultiple: boolean = false;
  @Input() uploadImagePath: string = '';
  @Input() aspectRatio: number = 1;
  @ViewChild("file") fileRef: ElementRef;
  sanitizeImagePreview;

  constructor(private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngAfterViewInit(): void {

  }



  async selectFiles(event: any) {
    if (!this.isMultiple) {
      this.oldSelectFile = []
    }

    let checkFile = event.target.files;
    for (let i = 0; i < checkFile.length; i++) {

      const file: any = checkFile[i];
      console.log(this.aspectRatio);

      const dialogRef = this.dialog.open(ImageCropComponent, { data: { file, aspectRatio: this.aspectRatio }, disableClose: true })

      dialogRef.afterClosed().subscribe(async (result: ImageCroppedEvent) => {
        const resultFile = this.dataURItoBlob(result, file.name)
        let uploadObject: FormData = new FormData();
        uploadObject.append(this.uploadImagePath, resultFile)
      });

    }

    this.selectFile.emit(this.oldSelectFile);
    this.fileRef.nativeElement.value = ''
  }

  dataURItoBlob(dataURI: any, fileName: any) {
    const binary = atob(dataURI.split(',')[1]);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }

    const blobImage = new Blob([array], {
      type: 'image/png',
    });
    const file = new File([blobImage], fileName, { type: 'image/png' });
    return file;
  }


  removeFile(event: any) {
    this.oldSelectFile.splice(event, 1);
    this.selectFile.emit(this.oldSelectFile)
  }
}

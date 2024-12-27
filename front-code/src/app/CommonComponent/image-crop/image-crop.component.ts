import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { DomSanitizer } from '@angular/platform-browser';

import { ImageCroppedEvent, ImageCropperComponent, ImageCropperModule, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.component.html',
  styleUrl: './image-crop.component.scss',
  standalone:true,
  imports:[MatSliderModule,ImageCropperModule]
})
export class ImageCropComponent {
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
  max: number = 2;
  zoom: number = 0.92;
  transform: ImageTransform = {};

  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ImageCropComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { file: File, aspectRatio: number }
  ) { }


  ngOnInit() {
    this.zoom = 0.92;
  }

  onSliderChange(event) {

    let value = parseInt(event?.target.value) / 25;
    this.zoom = value;
    const scale = value >= 0 ? value + 0.1 : 1 - (value / this.max) * -1;
    this.transform = { scale };
  }

  onClose() {
    this.dialogRef.close();
  }

  onAccept() {
    const event = this.imageCropper.crop();

    this.dialogRef.close(event?.base64);
  }

}

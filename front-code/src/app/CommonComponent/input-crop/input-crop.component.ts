import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCropperComponent, ImageCropperModule, ImageTransform } from 'ngx-image-cropper';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-input-crop',
  standalone: true,
  imports: [ImageCropperModule, MatSliderModule, MatDialogModule],
  templateUrl: './input-crop.component.html',
  styleUrl: './input-crop.component.scss'
})
export class InputCropComponent {
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
  max: number = 2;
  zoom: number = 0.92;
  transform: ImageTransform = {};

  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<InputCropComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { file: File, aspectRatio: number }
  ) {
    console.log(this.data.aspectRatio);

  }


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
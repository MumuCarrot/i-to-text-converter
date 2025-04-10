import { Component, Input } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent, OutputFormat } from 'ngx-image-cropper';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImgCropperService } from './img-cropper.service';
import { StyleService } from './style.service';
import { HttpService } from './http.service';

@Component({
  selector: 'app-image-editor',
  standalone: true,
  imports: [CommonModule, ImageCropperComponent],
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
})
export class ImageEditorComponent {
  lastCropEvent: ImageCroppedEvent | null = null;
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  objectUrl: string = '';

  constructor(private sanitizer: DomSanitizer, 
              public imgS: ImgCropperService, 
              public style: StyleService,
              public http: HttpService
            ) {}

  // Converts a SafeUrl to a File object
  async safeUrlToFile(safeUrl: SafeUrl, fileName: string, mimeType: string): Promise<File> {
    const response = await fetch(safeUrl as string);
    const blob = await response.blob();
    console.log('safeUrl:', safeUrl);
    return new File([blob], fileName, { type: mimeType });
  }

  // Handles the image cropping event and updates the cropped image
  imageCropped(event: ImageCroppedEvent) {
    this.lastCropEvent = event;
    if (event.blob) {
      this.objectUrl = URL.createObjectURL(event.blob);
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(this.objectUrl);
    }
  }

  // Sends the cropped or original image to the server for processing
  async sendRequest() {
    let file: File | null = null;
    if (this.lastCropEvent?.blob) {
      file = await this.safeUrlToFile(this.objectUrl, this.imgS.file?.name!, `image/${this.imgS.imageFormat}`);
    }

    if (!file) file = this.imgS.file;

    this.cancelCrop();

    this.http.postImageToText(file!).subscribe({
      next: (response: any) => {
        this.imgS.encodedText = response.map((i: any) => i.text).join(' ');
      },
      error: (error) => {
        this.imgS.encodedText = "Error: " + error.message;
      }
    });
  }

  // Cancels the cropping process and resets the UI
  cancelCrop() {
    this.style.dimmer = false;
    this.imgS.imageChangedEvent = null;
  }
}
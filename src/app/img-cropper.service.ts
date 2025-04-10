import { Injectable } from "@angular/core";
import { OutputFormat } from "ngx-image-cropper";

@Injectable({
  providedIn: 'root'
})
export class ImgCropperService {
    // Event triggered when an image is selected or dropped
    public imageChangedEvent: Event | null = null;

    // Format of the image (e.g., 'png' or 'jpeg')
    public imageFormat: OutputFormat = 'png';

    // The file object representing the selected or dropped image
    public file: File | null = null;

    // Encoded text extracted from the image
    public encodedText: string = '';
}
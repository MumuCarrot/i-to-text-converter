import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from './http.service';
import { StyleService } from './style.service';
import { NgIf } from '@angular/common';
import { ImageEditorComponent } from './image-cropper.component';
import { ImgCropperService } from './img-cropper.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [FormsModule, NgIf, ImageEditorComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [HttpService, StyleService, ImgCropperService]
})
export class AppComponent {
    constructor(public style: StyleService, public imgS: ImgCropperService) {}

    file: File | null = null;
    isDragging = false;

    // Handles file selection from an input element
    onFileSelected(event: Event): void {
        this.processFile(event);
    }

    // Processes the selected file and validates its type
    private processFile(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            let file = input.files[0];

            // Validate file type
            if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
                alert('Only JPEG or PNG images can be uploaded');
                return;
            }

            // Set image format based on file type
            const fileType = file.type;
            if (fileType === 'image/jpeg') {
                this.imgS.imageFormat = 'jpeg';
            } else if (fileType === 'image/png') {
                this.imgS.imageFormat = 'png';
            }

            // Update ImgCropperService with file details
            this.imgS.imageChangedEvent = event;
            this.imgS.file = file;
            this.style.dimmer = true;
        }
    }

    // Handles drag-over event to indicate a file is being dragged
    onDragOver(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = true;
    }
    
    // Handles drag-leave event to reset dragging state
    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = false;
    }
    
    // Handles file drop event and processes the dropped file
    onDrop(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = false;
    
        const file = event.dataTransfer?.files?.[0];
        if (file) {
            this.handleDroppedFile(file);
        }
    }
    
    // Processes the dropped file and validates its type
    private handleDroppedFile(file: File): void {
        if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
            alert('Only JPEG or PNG images can be uploaded');
            return;
        }

        const maxSizeInBytes = 2 * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            alert('The file is too large. Please upload an image smaller than 2 MB.');
            return;
        }
    
        // Set image format and simulate file input event
        this.imgS.imageFormat = file.type === 'image/jpeg' ? 'jpeg' : 'png';
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const fakeInput = document.createElement('input');
        fakeInput.type = 'file';
        fakeInput.files = dataTransfer.files;
    
        const fakeEvent = { target: fakeInput } as unknown as Event;
    
        this.imgS.imageChangedEvent = fakeEvent;
        this.imgS.file = file;
        this.style.dimmer = true;
    }

    // Copies the encoded text to the clipboard
    copytoClipBoard(): void {
        navigator.clipboard.writeText(this.imgS.encodedText).then(() => {
            console.log('Text copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    // Resets the input field when the user clicks on it
    resetInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        input.value = '';
    }
}

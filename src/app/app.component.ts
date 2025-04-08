import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-root',
    imports: [FormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    isDragging = false;
    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this.processFile(input.files[0]);
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = false;
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = false;
        if (event.dataTransfer?.files.length) {
            const file = event.dataTransfer.files[0];
            this.processFile(file);
        }
    }

    private processFile(file: File): void {
        if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
            alert('Only JPEG or PNG images can be uploaded');
            return;
        }
    }

    text = "";
    copytoClipBoard(): void {
        navigator.clipboard.writeText(this.text).then(() => {
            console.log('Text copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
}

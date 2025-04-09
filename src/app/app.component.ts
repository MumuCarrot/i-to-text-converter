import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from './http.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [HttpService]
})
export class AppComponent {
    constructor(private http: HttpService) {}

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

        this.http.postImageToText(file).
            subscribe({
                next: (response: any) => {
                  this.text = response.map((i: any) => i.text).join(' ');
                },
                error: (error) => {
                  this.text = "Error: " + error.message;
                }
            });
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

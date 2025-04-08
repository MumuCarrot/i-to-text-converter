import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NinjaService {
    private _ninjaUrl: string = 'https://api.api-ninjas.com/v1/imagetotext';
    private _apiKey: string = 'https://api.api-ninjas.com/v1/imagetotext';

    constructor(private http: HttpClient) {}

    getTextFromImage(image: File): Observable<string> {
        const formData = new FormData();
        formData.append('image', image);

        const headers = new HttpHeaders({
            'X-Api-Key': this._apiKey
        });

        return this.http.post<string>(this._ninjaUrl, formData, { headers });
    }
}
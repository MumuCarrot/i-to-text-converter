import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { WWW_HOST } from "./server.route";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    constructor(private http: HttpClient) {}

    postImageToText(file: File): Observable<Object> {
        const formData = new FormData();
        formData.append('image', file);
        return this.http.post(`${WWW_HOST}/imgtotext`, formData);
    }
}
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class StyleService {
    // Controls the visibility of the dimmer overlay
    public dimmer: boolean = false;
}
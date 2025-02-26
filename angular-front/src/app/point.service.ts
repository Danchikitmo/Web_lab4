import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PointService {

    private apiUrl = 'http://localhost:8080/api/shots/points';

    constructor(private http: HttpClient) {}

    getPoints(requestBody: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, requestBody);
    }
}

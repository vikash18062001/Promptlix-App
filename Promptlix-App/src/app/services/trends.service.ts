// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DataItem {
    id: string;
    imageUrl: string;
    prompt: string;
    howTo: string;
    createdOn: string; // optional for sorting
    trendingScore: number; // optional for sorting
}

@Injectable({
    providedIn: 'root'
})
export class TrendsService {
    // Replace this API URL with your real endpoint
    private apiUrl = environment.apiUrl;


    constructor(private http: HttpClient) { }


    // Example paginated API call. Replace with your actual API signature.
    getData(page = 0, limit = 10): Observable<DataItem[]> {
        // If you have a real backend, use HttpClient. Example:
        // const params = new HttpParams().set('page', page).set('limit', limit);
        return this.http.get<DataItem[]>(this.apiUrl);
    }
} 
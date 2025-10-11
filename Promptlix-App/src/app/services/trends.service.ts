// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DataItem {
    id: string;
    imageUrl: string;
    prompt: string;
    howto: string;
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
        // return this.http.get<DataItem[]>(this.apiUrl, { params });


        // ---- Mocked paginated response for demo ----
        const items: DataItem[] = [];
        const total = 1000; // pretend there are many items
        const start = page * limit;
        for (let i = start; i < Math.min(start + limit, total); i++) {
            items.push({
                id: '',
                imageUrl: 'https://picsum.photos/800/900?random=1',
                prompt: '',
                howto: 'HOW TO USE PROMPT?\n1) Click Copy Button\n2) Open Google Gemini Application\n3) Upload Your Photo And Paste This Prompt',
                createdOn: new Date().toISOString(),
                trendingScore: 100,
            }, {
                id: '',
                imageUrl: 'https://picsum.photos/800/900?random=2',
                prompt: '',
                howto: 'Short caption for image 2',
                createdOn: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                trendingScore: 80,
            });
        }
        return of(items).pipe(map(x => x));
    }
} 
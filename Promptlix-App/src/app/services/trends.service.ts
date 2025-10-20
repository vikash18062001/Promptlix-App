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

    getData(
        page: number = 0,
        pageSize: number = 10,
        sortBy: string = 'TrendOrder',
        sortOrder: 'asc' | 'desc' = 'asc'
      ): Observable<DataItem[]> {
        const url = `${this.apiUrl}?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        return this.http.get<DataItem[]>(url);
      }
      
} 
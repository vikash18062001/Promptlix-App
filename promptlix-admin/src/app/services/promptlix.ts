import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TrendDto {
  id?: string;
  prompt: string;
  howTo: string;
  trendOrder: number;
  imageUrl?: string;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class PromptlixService {
  private baseUrl = `${environment.apiBase}/promptlix`;
  private tokenKey = 'promptlix_token';

  constructor(private http: HttpClient) {}

  // ✅ LOGIN METHOD
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data);
  }

  // ✅ Save token locally
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // ✅ Get token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // ✅ Common header with token
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  // ✅ CRUD operations
  getAll(): Observable<TrendDto[]> {
    return this.http.get<TrendDto[]>(this.baseUrl);
  }

  getById(id: string): Observable<TrendDto> {
    return this.http.get<TrendDto>(`${this.baseUrl}/${id}`);
  }

  create(data: TrendDto, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('Prompt', data.prompt);
    formData.append('HowTo', data.howTo);
    formData.append('TrendOrder', data.trendOrder.toString());
    if (imageFile) formData.append('ImageFile', imageFile);

    return this.http.post(this.baseUrl, formData, { headers: this.getAuthHeaders() });
  }

  getPaginated(
    page: number,
    pageSize: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Observable<any> {
    const url = `${this.baseUrl}?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    return this.http.get(url);
  }
  

  update(id: string, data: TrendDto, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('Prompt', data.prompt);
    formData.append('HowTo', data.howTo);
    formData.append('TrendOrder', data.trendOrder.toString());
    if (imageFile) formData.append('ImageFile', imageFile);

    return this.http.put(`${this.baseUrl}/${id}`, formData, { headers: this.getAuthHeaders() });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // ✅ Logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}

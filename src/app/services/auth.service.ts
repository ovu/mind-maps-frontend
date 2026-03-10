import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const API_BASE = 'http://localhost:8080';
const TOKEN_KEY = 'auth_token';

export interface AuthResponse {
  token: string;
}

export interface ApiError {
  error: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  register(email: string, password: string, name?: string): Observable<unknown> {
    const body: Record<string, string> = { email, password };
    if (name) body['name'] = name;
    return this.http.post(`${API_BASE}/auth/register`, body);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/auth/login`, { email, password }).pipe(
      tap(response => localStorage.setItem(TOKEN_KEY, response.token))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

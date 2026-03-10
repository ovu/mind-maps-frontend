import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE = 'http://localhost:8080';

export interface UserProfile {
  email: string;
  name?: string;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getMe(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API_BASE}/api/me`);
  }
}

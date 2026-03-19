import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  MindMapListItem,
  MindMapResponse,
  MessageResponse,
} from '../models/mind-map.model';

const API_BASE = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class MindMapService {
  private http = inject(HttpClient);

  list(): Observable<MindMapListItem[]> {
    return this.http.get<MindMapListItem[]>(`${API_BASE}/api/mind-maps`);
  }

  get(id: string): Observable<MindMapResponse> {
    return this.http.get<MindMapResponse>(`${API_BASE}/api/mind-maps/${id}`);
  }

  create(name: string): Observable<MindMapResponse> {
    return this.http.post<MindMapResponse>(`${API_BASE}/api/mind-maps`, { name });
  }

  update(id: string, name: string): Observable<MindMapResponse> {
    return this.http.put<MindMapResponse>(`${API_BASE}/api/mind-maps/${id}`, { name });
  }

  delete(id: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${API_BASE}/api/mind-maps/${id}`);
  }
}

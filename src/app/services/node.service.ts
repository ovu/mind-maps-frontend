import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  NodeResponse,
  CreateNodeRequest,
  UpdateNodeRequest,
  MessageResponse,
} from '../models/mind-map.model';

const API_BASE = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class NodeService {
  private http = inject(HttpClient);

  add(mmId: string, request: CreateNodeRequest): Observable<NodeResponse> {
    return this.http.post<NodeResponse>(
      `${API_BASE}/api/mind-maps/${mmId}/nodes`,
      request,
    );
  }

  update(mmId: string, nodeId: string, request: UpdateNodeRequest): Observable<NodeResponse> {
    return this.http.put<NodeResponse>(
      `${API_BASE}/api/mind-maps/${mmId}/nodes/${nodeId}`,
      request,
    );
  }

  delete(mmId: string, nodeId: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(
      `${API_BASE}/api/mind-maps/${mmId}/nodes/${nodeId}`,
    );
  }

  uploadPicture(mmId: string, nodeId: string, file: File): Observable<NodeResponse> {
    return this.http.post<NodeResponse>(
      `${API_BASE}/api/mind-maps/${mmId}/nodes/${nodeId}/upload`,
      file,
      { headers: { 'Content-Type': file.type } },
    );
  }
}

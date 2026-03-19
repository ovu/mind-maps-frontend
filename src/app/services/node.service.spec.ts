import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NodeService } from './node.service';

describe('NodeService', () => {
  let service: NodeService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NodeService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('add() calls POST /api/mind-maps/:mmId/nodes', () => {
    service.add('mm1', { parentId: 'p1', nodeType: 'text', text: 'Hello' }).subscribe();
    const req = http.expectOne('http://localhost:8080/api/mind-maps/mm1/nodes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ parentId: 'p1', nodeType: 'text', text: 'Hello' });
    req.flush({});
  });

  it('update() calls PUT /api/mind-maps/:mmId/nodes/:nodeId', () => {
    service.update('mm1', 'n1', { text: 'Updated' }).subscribe();
    const req = http.expectOne('http://localhost:8080/api/mind-maps/mm1/nodes/n1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ text: 'Updated' });
    req.flush({});
  });

  it('delete() calls DELETE /api/mind-maps/:mmId/nodes/:nodeId', () => {
    service.delete('mm1', 'n1').subscribe();
    const req = http.expectOne('http://localhost:8080/api/mind-maps/mm1/nodes/n1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Deleted' });
  });

  it('uploadPicture() sends binary POST with correct content type', () => {
    const file = new File(['data'], 'test.png', { type: 'image/png' });
    service.uploadPicture('mm1', 'n1', file).subscribe();
    const req = http.expectOne('http://localhost:8080/api/mind-maps/mm1/nodes/n1/upload');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('image/png');
    req.flush({});
  });
});

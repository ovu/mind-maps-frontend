import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MindMapService } from './mind-map.service';

describe('MindMapService', () => {
  let service: MindMapService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MindMapService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('list() calls GET /api/mind-maps', () => {
    const mockMaps = [{ id: '1', name: 'Test', createdAt: '2026-01-01T00:00:00Z' }];
    service.list().subscribe(maps => expect(maps).toEqual(mockMaps));
    const req = http.expectOne('http://localhost:8080/api/mind-maps');
    expect(req.request.method).toBe('GET');
    req.flush(mockMaps);
  });

  it('get() calls GET /api/mind-maps/:id', () => {
    const mockMap = { id: '1', name: 'Test', createdAt: '2026-01-01T00:00:00Z', rootNode: { id: 'r', nodeType: 'text', text: 'Root', value: null, color: null, parentId: null, createdAt: '2026-01-01T00:00:00Z', children: [] } };
    service.get('1').subscribe(map => expect(map).toEqual(mockMap));
    const req = http.expectOne('http://localhost:8080/api/mind-maps/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockMap);
  });

  it('create() calls POST /api/mind-maps', () => {
    service.create('New Map').subscribe();
    const req = http.expectOne('http://localhost:8080/api/mind-maps');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'New Map' });
    req.flush({});
  });

  it('update() calls PUT /api/mind-maps/:id', () => {
    service.update('1', 'Renamed').subscribe();
    const req = http.expectOne('http://localhost:8080/api/mind-maps/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ name: 'Renamed' });
    req.flush({});
  });

  it('delete() calls DELETE /api/mind-maps/:id', () => {
    service.delete('1').subscribe();
    const req = http.expectOne('http://localhost:8080/api/mind-maps/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Deleted' });
  });
});

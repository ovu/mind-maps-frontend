import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { MindMapList } from './mind-map-list';
import { mockLocalStorage } from '../../testing/mock-storage';

describe('MindMapList', () => {
  let fixture: ComponentFixture<MindMapList>;
  let component: MindMapList;
  let http: HttpTestingController;
  let router: Router;

  const mockMaps = [
    { id: '1', name: 'First Map', createdAt: '2026-03-10T00:00:00Z' },
    { id: '2', name: 'Second Map', createdAt: '2026-03-09T00:00:00Z' },
  ];

  beforeEach(() => {
    mockLocalStorage();
    localStorage.setItem('auth_token', 'test-token');
    TestBed.configureTestingModule({
      imports: [MindMapList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    fixture = TestBed.createComponent(MindMapList);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    http.verify();
    vi.unstubAllGlobals();
  });

  function initComponent(): void {
    fixture.detectChanges();
    // Flush the user profile request
    http.expectOne('http://localhost:8080/api/me').flush({ userId: 'u1', name: 'Alice' });
    // Flush the mind maps list request
    http.expectOne('http://localhost:8080/api/mind-maps').flush(mockMaps);
    fixture.detectChanges();
  }

  it('loads and displays mind maps', () => {
    initComponent();
    expect(component.mindMaps()).toHaveLength(2);
    expect(component.loading()).toBe(false);
  });

  it('filters maps by search query', () => {
    initComponent();
    component.searchQuery.set('first');
    expect(component.filteredMaps()).toHaveLength(1);
    expect(component.filteredMaps()[0].name).toBe('First Map');
  });

  it('creates a new mind map', () => {
    initComponent();
    component.newMapName.set('New Map');
    component.submitCreate();
    const createReq = http.expectOne('http://localhost:8080/api/mind-maps');
    expect(createReq.request.method).toBe('POST');
    expect(createReq.request.body).toEqual({ name: 'New Map' });
    createReq.flush({ id: '3', name: 'New Map', createdAt: '2026-03-11T00:00:00Z', rootNode: {} });
    // Reload list
    http.expectOne('http://localhost:8080/api/mind-maps').flush([...mockMaps, { id: '3', name: 'New Map', createdAt: '2026-03-11T00:00:00Z' }]);
  });

  it('renames a mind map', () => {
    initComponent();
    component.startRename(mockMaps[0]);
    component.editingName.set('Renamed');
    component.submitRename(mockMaps[0]);
    const renameReq = http.expectOne('http://localhost:8080/api/mind-maps/1');
    expect(renameReq.request.method).toBe('PUT');
    expect(renameReq.request.body).toEqual({ name: 'Renamed' });
    renameReq.flush({});
    http.expectOne('http://localhost:8080/api/mind-maps').flush(mockMaps);
  });

  it('deletes a mind map with confirmation', () => {
    initComponent();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.deleteMap(mockMaps[0]);
    const deleteReq = http.expectOne('http://localhost:8080/api/mind-maps/1');
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush({ message: 'Deleted' });
    http.expectOne('http://localhost:8080/api/mind-maps').flush([mockMaps[1]]);
  });

  it('navigates to editor on map click', () => {
    initComponent();
    const navSpy = vi.spyOn(router, 'navigate');
    component.openMap(mockMaps[0]);
    expect(navSpy).toHaveBeenCalledWith(['/mind-maps', '1']);
  });

  it('shows empty state when no maps', () => {
    fixture.detectChanges();
    http.expectOne('http://localhost:8080/api/me').flush({ userId: 'u1' });
    http.expectOne('http://localhost:8080/api/mind-maps').flush([]);
    fixture.detectChanges();
    expect(component.mindMaps()).toHaveLength(0);
    expect(component.loading()).toBe(false);
  });
});

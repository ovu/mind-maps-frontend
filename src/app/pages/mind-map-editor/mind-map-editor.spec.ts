import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MindMapEditor } from './mind-map-editor';
import { NgxGraphModule } from '@swimlane/ngx-graph';

const mockMindMap = {
  id: 'mm1',
  name: 'Test Map',
  createdAt: '2026-03-10T00:00:00Z',
  rootNode: {
    id: 'r',
    parentId: null,
    nodeType: 'text' as const,
    text: 'Root',
    value: null,
    color: null,
    createdAt: '2026-03-10T00:00:00Z',
    children: [
      {
        id: 'c1',
        parentId: 'r',
        nodeType: 'text' as const,
        text: 'Child One',
        value: null,
        color: '#EF4444',
        createdAt: '2026-03-10T00:00:00Z',
        children: [],
      },
      {
        id: 'c2',
        parentId: 'r',
        nodeType: 'link' as const,
        text: 'Link Node',
        value: 'https://example.com',
        color: null,
        createdAt: '2026-03-10T00:00:00Z',
        children: [],
      },
    ],
  },
};

describe('MindMapEditor', () => {
  let fixture: ComponentFixture<MindMapEditor>;
  let component: MindMapEditor;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MindMapEditor],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideAnimations(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => 'mm1' } },
          },
        },
      ],
    });
    TestBed.overrideComponent(MindMapEditor, {
      remove: { imports: [NgxGraphModule] },
      add: { schemas: [NO_ERRORS_SCHEMA] },
    });
    fixture = TestBed.createComponent(MindMapEditor);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function initComponent(): void {
    fixture.detectChanges();
    http.expectOne('http://localhost:8080/api/mind-maps/mm1').flush(mockMindMap);
    fixture.detectChanges();
  }

  it('loads mind map and creates graph nodes/links', () => {
    initComponent();
    expect(component.mindMap()?.name).toBe('Test Map');
    expect(component.graphNodes()).toHaveLength(3);
    expect(component.graphLinks()).toHaveLength(2);
    expect(component.loading()).toBe(false);
  });

  it('selects and deselects nodes', () => {
    initComponent();
    component.selectNode('nc1');
    expect(component.selectedNodeId()).toBe('nc1');
    expect(component.selectedNode()?.text).toBe('Child One');

    component.deselectNode();
    expect(component.selectedNodeId()).toBeNull();
    expect(component.selectedNode()).toBeNull();
  });

  it('searches nodes by text', () => {
    initComponent();
    component.searchQuery.set('child');
    component.onSearchInput();
    expect(component.searchResults()).toHaveLength(1);
    expect(component.searchResults()[0].id).toBe('c1');
    expect(component.matchingNodeIds().has('nc1')).toBe(true);
  });

  it('clears search', () => {
    initComponent();
    component.searchQuery.set('child');
    component.onSearchInput();
    component.clearSearch();
    expect(component.searchQuery()).toBe('');
    expect(component.searchResults()).toHaveLength(0);
    expect(component.showSearchDropdown()).toBe(false);
  });

  it('handles 404 error', () => {
    fixture.detectChanges();
    http.expectOne('http://localhost:8080/api/mind-maps/mm1').flush(null, { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();
    expect(component.error()).toBe('Mind map not found.');
    expect(component.loading()).toBe(false);
  });

  it('getImageSrc returns correct URL for uploaded files', () => {
    initComponent();
    const node = { ...mockMindMap.rootNode, nodeType: 'picture' as const, value: 'abc.png' };
    expect(component.getImageSrc(node as any)).toBe('http://localhost:8080/uploads/abc.png');
  });

  it('getImageSrc returns external URL directly', () => {
    initComponent();
    const node = { ...mockMindMap.rootNode, nodeType: 'picture' as const, value: 'https://example.com/img.jpg' };
    expect(component.getImageSrc(node as any)).toBe('https://example.com/img.jpg');
  });
});

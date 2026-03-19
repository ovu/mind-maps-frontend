import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NodeEditorPanel } from './node-editor-panel';
import { NodeResponse } from '../../models/mind-map.model';
import { ComponentRef } from '@angular/core';

function makeNode(overrides: Partial<NodeResponse> = {}): NodeResponse {
  return {
    id: 'n1',
    parentId: 'r',
    nodeType: 'text',
    text: 'Test Node',
    value: null,
    color: '#3B82F6',
    createdAt: '2026-01-01T00:00:00Z',
    children: [],
    ...overrides,
  };
}

describe('NodeEditorPanel', () => {
  let fixture: ComponentFixture<NodeEditorPanel>;
  let component: NodeEditorPanel;
  let componentRef: ComponentRef<NodeEditorPanel>;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NodeEditorPanel],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(NodeEditorPanel);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    http = TestBed.inject(HttpTestingController);
    componentRef.setInput('mindMapId', 'mm1');
    componentRef.setInput('node', makeNode());
    componentRef.setInput('isRoot', false);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('displays current node properties', () => {
    expect(component.currentType).toBe('text');
    expect(component.currentText).toBe('Test Node');
    expect(component.currentColor).toBe('#3B82F6');
  });

  it('updates node type via API', () => {
    component.onTypeChange('link');
    const req = http.expectOne('http://localhost:8080/api/mind-maps/mm1/nodes/n1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ nodeType: 'link' });
    req.flush({});
  });

  it('updates text on blur', () => {
    component.onTextBlur('New Text');
    const req = http.expectOne('http://localhost:8080/api/mind-maps/mm1/nodes/n1');
    expect(req.request.body).toEqual({ text: 'New Text' });
    req.flush({});
  });

  it('does not update text if unchanged', () => {
    component.onTextBlur('Test Node');
    http.expectNone('http://localhost:8080/api/mind-maps/mm1/nodes/n1');
  });

  it('updates color', () => {
    component.onColorChange('#EF4444');
    const req = http.expectOne('http://localhost:8080/api/mind-maps/mm1/nodes/n1');
    expect(req.request.body).toEqual({ color: '#EF4444' });
    req.flush({});
  });

  it('adds a child node', () => {
    const emitSpy = vi.fn();
    component.nodeUpdated.subscribe(emitSpy);
    component.addChild();
    const req = http.expectOne('http://localhost:8080/api/mind-maps/mm1/nodes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ parentId: 'n1', nodeType: 'text', text: 'New node' });
    req.flush({});
    expect(emitSpy).toHaveBeenCalled();
  });

  it('deletes node with confirmation', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const emitSpy = vi.fn();
    component.nodeDeleted.subscribe(emitSpy);
    component.deleteNode();
    const req = http.expectOne('http://localhost:8080/api/mind-maps/mm1/nodes/n1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Deleted' });
    expect(emitSpy).toHaveBeenCalled();
  });

  it('does not delete if confirmation cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    component.deleteNode();
    http.expectNone('http://localhost:8080/api/mind-maps/mm1/nodes/n1');
  });

  it('uploads picture file', () => {
    const file = new File(['data'], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as unknown as Event;
    component.onFileSelected(event);
    const req = http.expectOne('http://localhost:8080/api/mind-maps/mm1/nodes/n1/upload');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('sets image URL', () => {
    component.imageUrlInput.set('https://example.com/img.jpg');
    component.setImageUrl();
    const req = http.expectOne('http://localhost:8080/api/mind-maps/mm1/nodes/n1');
    expect(req.request.body).toEqual({ value: 'https://example.com/img.jpg' });
    req.flush({});
  });

  it('getImageSrc handles uploaded files', () => {
    componentRef.setInput('node', makeNode({ value: 'pic.png' }));
    fixture.detectChanges();
    expect(component.getImageSrc()).toBe('http://localhost:8080/uploads/pic.png');
  });

  it('getImageSrc handles external URLs', () => {
    componentRef.setInput('node', makeNode({ value: 'https://example.com/pic.jpg' }));
    fixture.detectChanges();
    expect(component.getImageSrc()).toBe('https://example.com/pic.jpg');
  });
});

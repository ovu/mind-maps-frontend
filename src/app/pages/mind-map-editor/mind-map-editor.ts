import { Component, inject, signal, computed, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GraphComponent, NgxGraphModule } from '@swimlane/ngx-graph';
import { Subject } from 'rxjs';
import { MindMapService } from '../../services/mind-map.service';
import { NodeService } from '../../services/node.service';
import { MindMapResponse, NodeResponse } from '../../models/mind-map.model';
import { flattenTree, findNodeInTree, collectAllNodes, toGraphId, fromGraphId, GraphNode, GraphLink } from '../../utils/tree-flatten';
import { NodeEditorPanel } from '../../components/node-editor-panel/node-editor-panel';

const API_BASE = 'http://localhost:8080';

@Component({
  selector: 'app-mind-map-editor',
  standalone: true,
  imports: [FormsModule, SlicePipe, NgxGraphModule, NodeEditorPanel],
  templateUrl: './mind-map-editor.html',
})
export class MindMapEditor implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private zone = inject(NgZone);
  private mindMapService = inject(MindMapService);
  private nodeService = inject(NodeService);

  @ViewChild('graphComponent') graphComponent?: GraphComponent;

  graphUpdate$ = new Subject<boolean>();
  zoomToFit$ = new Subject<{ autoCenter: boolean }>();
  autoZoomEnabled = signal(true);

  mindMap = signal<MindMapResponse | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  graphNodes = signal<GraphNode[]>([]);
  graphLinks = signal<GraphLink[]>([]);

  selectedNodeId = signal<string | null>(null);
  searchQuery = signal('');
  searchResults = signal<NodeResponse[]>([]);
  showSearchDropdown = signal(false);

  // selectedNodeId stores graph IDs (prefixed with 'n')
  selectedNode = computed(() => {
    const graphId = this.selectedNodeId();
    const map = this.mindMap();
    if (!graphId || !map) return null;
    return findNodeInTree(map.rootNode, fromGraphId(graphId));
  });

  matchingNodeIds = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return new Set<string>();
    const map = this.mindMap();
    if (!map) return new Set<string>();
    const allNodes = collectAllNodes(map.rootNode);
    return new Set(
      allNodes
        .filter(n => n.text?.toLowerCase().includes(query))
        .map(n => toGraphId(n.id))
    );
  });

  layoutSettings = {
    orientation: 'TB' as const,
    rankSep: 80,
    nodeSep: 60,
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/mind-maps']);
      return;
    }
    this.loadMindMap(id);
  }

  loadMindMap(id: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.mindMapService.get(id).subscribe({
      next: (map) => {
        this.mindMap.set(map);
        this.refreshGraph(map);
        this.loading.set(false);
        // Disable autoZoom/autoCenter after initial render to prevent
        // SVG teardown/rebuild on subsequent updates (causes getScreenCTM error)
        setTimeout(() => this.autoZoomEnabled.set(false), 500);
      },
      error: (err) => {
        if (err.status === 404) {
          this.error.set('Mind map not found.');
        } else {
          this.error.set('Failed to load mind map.');
        }
        this.loading.set(false);
      },
    });
  }

  refreshGraph(map: MindMapResponse, forceRecreate = false): void {
    const { nodes, links } = flattenTree(map.rootNode);
    if (forceRecreate) {
      // Force ngx-graph to destroy and recreate node template views
      // by briefly clearing the arrays (it caches embedded views by node ID)
      this.graphNodes.set([]);
      this.graphLinks.set([]);
      setTimeout(() => {
        this.graphNodes.set(nodes);
        this.graphLinks.set(links);
        setTimeout(() => this.graphUpdate$.next(true));
      });
    } else {
      this.graphNodes.set(nodes);
      this.graphLinks.set(links);
      setTimeout(() => this.graphUpdate$.next(true));
    }
  }

  onNodeSelect(event: any): void {
    const nodeId = typeof event === 'string' ? event : event?.id;
    if (nodeId) {
      this.selectNode(nodeId);
    }
  }

  // Track mousedown to distinguish clicks from drags
  private _mouseDownTarget: string | null = null;
  private _mouseDownTime = 0;
  private _mouseDownPos = { x: 0, y: 0 };

  onNodeMouseDown(event: MouseEvent, nodeId: string): void {
    this._mouseDownTarget = nodeId;
    this._mouseDownTime = Date.now();
    this._mouseDownPos = { x: event.clientX, y: event.clientY };
  }

  onNodeMouseUp(event: MouseEvent, nodeId: string): void {
    if (this._mouseDownTarget !== nodeId) return;
    const elapsed = Date.now() - this._mouseDownTime;
    const dx = Math.abs(event.clientX - this._mouseDownPos.x);
    const dy = Math.abs(event.clientY - this._mouseDownPos.y);
    // Treat as click if short duration and minimal movement
    if (elapsed < 300 && dx < 5 && dy < 5) {
      this.selectNode(nodeId);
    }
    this._mouseDownTarget = null;
  }

  selectNode(nodeId: string): void {
    this.zone.run(() => {
      this.selectedNodeId.set(nodeId);
    });
  }

  deselectNode(): void {
    this.selectedNodeId.set(null);
  }

  isSearchActive(): boolean {
    return this.searchQuery().length > 0;
  }

  isNodeHighlighted(nodeId: string): boolean {
    return this.matchingNodeIds().has(nodeId);
  }

  isNodeSelected(nodeId: string): boolean {
    return this.selectedNodeId() === nodeId;
  }

  getNodeOpacity(node: GraphNode): number {
    if (!this.isSearchActive()) return 1;
    return this.isNodeHighlighted(node.id) ? 1 : 0.25;
  }

  openNodeLink(event: MouseEvent, node: GraphNode): void {
    event.stopPropagation();
    const url = node.data.value;
    if (url) window.open(url, '_blank', 'noopener');
  }

  getNodeColor(node: GraphNode): string {
    return node._nodeColor || '#ffffff';
  }

  getNodeBorderColor(node: GraphNode): string {
    if (this.isNodeSelected(node.id)) return '#3B82F6';
    if (this.isNodeHighlighted(node.id)) return '#F59E0B';
    return node._nodeColor || '#d1d5db';
  }

  getImageSrc(node: NodeResponse): string {
    if (!node.value) return '';
    if (node.value.startsWith('http')) return node.value;
    return `${API_BASE}/uploads/${node.value}`;
  }

  // Search
  onSearchInput(): void {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      this.searchResults.set([]);
      this.showSearchDropdown.set(false);
      return;
    }
    const map = this.mindMap();
    if (!map) return;
    const allNodes = collectAllNodes(map.rootNode);
    const results = allNodes.filter(n => n.text?.toLowerCase().includes(query));
    this.searchResults.set(results);
    this.showSearchDropdown.set(results.length > 0);
  }

  selectSearchResult(node: NodeResponse): void {
    this.selectNode(toGraphId(node.id));
    this.showSearchDropdown.set(false);
    if (this.graphComponent) {
      this.graphComponent.panToNodeId(toGraphId(node.id));
    }
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.showSearchDropdown.set(false);
  }

  // Node mutations — called from the side panel (reload without flicker)
  onNodeUpdated(): void {
    const map = this.mindMap();
    if (!map) return;
    this.mindMapService.get(map.id).subscribe({
      next: (updated) => {
        this.mindMap.set(updated);
        this.refreshGraph(updated, true);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/mind-maps']);
  }
}

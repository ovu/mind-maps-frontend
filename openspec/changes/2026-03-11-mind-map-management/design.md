## Context

Angular 21 application with Tailwind CSS, standalone components, JWT auth already implemented. Backend at `http://localhost:8080` provides full CRUD for mind maps and nodes (tree structure with parent-child relationships). Nodes support types: text, link, picture. No x/y position fields on nodes yet — layout must be computed client-side.

## Goals / Non-Goals

**Goals:**
- Visual mind map editor with auto-layout tree rendering
- Full CRUD for mind maps (list page) and nodes (editor page)
- Node editing: type switching, text, color (picker + palette), image upload/URL
- Client-side search on both pages
- Drag nodes visually on the canvas

**Non-Goals:**
- Persisting node x/y positions (backend doesn't support it yet)
- Reparenting nodes via drag-and-drop
- Real-time collaboration or multi-user editing
- Backend search endpoint (all search is client-side)
- Undo/redo

## Decisions

### 1. Visualization library: `@swimlane/ngx-graph`

**Decision**: Use `@swimlane/ngx-graph` with dagre layout for rendering the mind map tree.

**Rationale**: Native Angular library — no React wrapper needed. Provides dagre auto-layout (handles tree/hierarchical structures), custom node templates via `ng-template`, built-in pan/zoom/drag, and edge rendering. Data model maps cleanly: flatten the recursive `NodeResponse.children[]` into ngx-graph's flat `nodes[]` + `links[]` arrays.

**Alternatives considered**:
- React Flow — best-in-class but requires wrapping React in Angular, adding complexity
- Cytoscape.js — powerful but node customization is style-based, not template-based
- D3.js — full control but requires building everything manually (drag, edges, layout)

### 2. Node editing: side panel

**Decision**: Use a side panel on the right side of the editor for node editing controls.

**Rationale**: Node editing involves type switching, text input, color picker, and image upload — too much for an inline popup. A persistent side panel provides space for all controls without cluttering the canvas. Panel shows when a node is selected, collapses when deselected.

### 3. Image handling: dual approach

**Decision**: File upload uses `POST /nodes/:id/upload` (binary). URL-based images store the URL directly in the `value` field via `PUT /nodes/:id`.

**Rationale**: Simple, no CORS issues. Frontend rendering logic: if `value` starts with `http`, use as `img src` directly; otherwise prepend `http://localhost:8080/uploads/` to get the uploaded file.

### 4. Search: two-tier client-side

**Decision**: List page filters mind maps by name. Editor page searches nodes by text field, highlights matches on canvas and shows a dropdown result list that pans to the node on click.

**Rationale**: All data is already loaded in both contexts (`GET /api/mind-maps` for list, `GET /api/mind-maps/:id` for editor tree). No backend search endpoint needed. Cross-map node search can be added later if a backend endpoint is introduced.

### 5. Replace `/welcome` with `/mind-maps`

**Decision**: The welcome page becomes the mind map list. Default redirect after login changes from `/welcome` to `/mind-maps`.

**Rationale**: The welcome page served as a placeholder. The mind map list is the real landing page for authenticated users.

### 6. Color editing: picker + preset palette

**Decision**: Offer both a native color picker input and a row of preset color swatches.

**Rationale**: Preset palette gives quick, consistent colors. Color picker allows full customization. Both are lightweight to implement.

### 7. Tree data transformation

**Decision**: Flatten the recursive `NodeResponse` tree (with nested `children[]`) into two flat arrays for ngx-graph: `nodes[]` (each node with id, label, data) and `links[]` (each with source/target derived from parent-child relationships).

**Rationale**: ngx-graph expects flat arrays, not nested trees. A recursive flatten utility converts between the backend's nested format and ngx-graph's flat format.

## Risks / Trade-offs

- **ngx-graph maturity** — Less ecosystem than React Flow. Mitigation: the required features (custom nodes, dagre layout, drag, pan/zoom) are well-supported in ngx-graph
- **Visual drag resets on refresh** — No position persistence. Mitigation: dagre auto-layout provides a consistent default; positions will persist when backend adds x/y fields
- **Large mind maps** — Client-side search and rendering may slow with hundreds of nodes. Mitigation: acceptable for MVP; pagination or virtualization can be added later
- **Image URL breakage** — External URLs may become unreachable. Mitigation: user's responsibility, same as any external link; upload option available for permanent storage

## 1. Services & Data Layer

- [x] 1.1 Create `MindMapService` with methods: `list()`, `create(name)`, `update(id, name)`, `delete(id)`, `get(id)` calling the corresponding `/api/mind-maps` endpoints
- [x] 1.2 Create `NodeService` with methods: `add(mmId, parentId, nodeType, text?, value?, color?)`, `update(mmId, nodeId, fields)`, `delete(mmId, nodeId)`, `uploadPicture(mmId, nodeId, file)` calling the corresponding `/api/mind-maps/:mmId/nodes` endpoints
- [x] 1.3 Define TypeScript interfaces: `MindMapListItem`, `MindMapResponse`, `NodeResponse`, `CreateNodeRequest`, `UpdateNodeRequest` matching the OpenAPI schemas
- [x] 1.4 Create a tree-flatten utility: converts recursive `NodeResponse` (with `children[]`) into flat `nodes[]` and `links[]` arrays for ngx-graph

## 2. Routing & Navigation Updates

- [x] 2.1 Add routes: `/mind-maps` (list page, auth guard), `/mind-maps/:id` (editor page, auth guard)
- [x] 2.2 Update default redirect from `/` to `/mind-maps` instead of `/login`
- [x] 2.3 Update `guestGuard` redirect target from `/welcome` to `/mind-maps`
- [x] 2.4 Update `authGuard` redirect from `/login` to keep as-is (correct)
- [x] 2.5 Update login success redirect from `/welcome` to `/mind-maps`
- [x] 2.6 Remove `/welcome` route and `WelcomeComponent` (replaced by mind map list)

## 3. Mind Map List Page

- [x] 3.1 Create `MindMapListComponent` at `/mind-maps` with header showing user name/email and logout button
- [x] 3.2 Fetch and display mind maps list sorted by creation date descending
- [x] 3.3 Add "Create" button with inline form or modal for entering mind map name
- [x] 3.4 Add inline rename functionality per mind map (edit icon → input field → save)
- [x] 3.5 Add delete button per mind map with confirmation prompt
- [x] 3.6 Click a mind map row navigates to `/mind-maps/:id`
- [x] 3.7 Add search input that filters mind maps by name (client-side, case-insensitive)
- [x] 3.8 Handle loading state, empty state, and error states
- [x] 3.9 Style with Tailwind CSS — responsive layout consistent with existing auth pages

## 4. Install & Configure ngx-graph

- [x] 4.1 Install `@swimlane/ngx-graph` and its peer dependency `d3` (or required d3 sub-packages)
- [x] 4.2 Verify ngx-graph renders a basic graph with dagre layout in a test component

## 5. Mind Map Editor Page

- [x] 5.1 Create `MindMapEditorComponent` at `/mind-maps/:id`
- [x] 5.2 Fetch mind map via `GET /api/mind-maps/:id`, flatten tree to ngx-graph format using the utility from 1.4
- [x] 5.3 Render ngx-graph with dagre layout, custom node template, and edge template
- [x] 5.4 Implement custom node template: display differently based on `nodeType` (text shows text, link shows text + URL icon, picture shows thumbnail image)
- [x] 5.5 Apply node `color` as background/border on node visuals
- [x] 5.6 Enable pan, zoom, and visual node dragging on the canvas
- [x] 5.7 Click node to select (highlight + open side panel); click background to deselect
- [x] 5.8 Add header with back button to `/mind-maps`, mind map name display, and search input
- [x] 5.9 Handle loading state and 404 error (map not found)
- [x] 5.10 Style with Tailwind CSS — full-height layout with canvas and side panel

## 6. Node Editing Side Panel

- [x] 6.1 Create `NodeEditorPanelComponent` shown when a node is selected
- [x] 6.2 Type selector dropdown (text, link, picture) — updates node type via API on change
- [x] 6.3 Text input field — updates node text via API on change/blur
- [x] 6.4 Color picker: native `<input type="color">` plus preset palette swatches (red, orange, yellow, green, blue, purple, pink, gray) — updates node color via API
- [x] 6.5 Link type: URL input field — updates node `value` via API
- [x] 6.6 Picture type: file upload input (`image/png`, `image/jpeg`) — uploads via `POST /nodes/:id/upload`
- [x] 6.7 Picture type: "From URL" input — updates node `value` via API
- [x] 6.8 Picture preview: display current image (URL or uploaded file)
- [x] 6.9 "Add Child" button — creates a new child node under selected node, auto-selects the new node
- [x] 6.10 "Delete" button with confirmation — deletes node and descendants; disabled for root node
- [x] 6.11 Update canvas graph after every node mutation (re-flatten tree, update ngx-graph data)

## 7. Editor Search

- [x] 7.1 Search input in editor toolbar — filters nodes by `text` field (case-insensitive partial match)
- [x] 7.2 Highlight matching nodes on the canvas (e.g., glowing border or accent background)
- [x] 7.3 Show dropdown result list below search input with matching node names
- [x] 7.4 Click a result: select node, open side panel, pan canvas to center on it
- [x] 7.5 Clear search: remove highlights, hide dropdown

## 8. Tests

- [x] 8.1 Unit tests for `MindMapService` (list, create, update, delete, get)
- [x] 8.2 Unit tests for `NodeService` (add, update, delete, uploadPicture)
- [x] 8.3 Unit tests for tree-flatten utility
- [x] 8.4 Component tests for `MindMapListComponent` (list display, create, rename, delete, search filter, navigation)
- [x] 8.5 Component tests for `MindMapEditorComponent` (loads map, renders graph, node selection)
- [x] 8.6 Component tests for `NodeEditorPanelComponent` (type switch, text edit, color picker, image upload, add child, delete)
- [x] 8.7 Component tests for editor search (search input, highlighting, dropdown, pan to node)

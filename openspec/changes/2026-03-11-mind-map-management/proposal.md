## Why

Authenticated users currently land on a welcome page with no functionality. The backend already supports full mind map and node CRUD. Users need a visual interface to create, manage, and edit mind maps with their hierarchical node trees.

## What Changes

- Replace `/welcome` page with a mind map list page at `/mind-maps` showing the user's maps with create, rename, and delete
- Add mind map editor page at `/mind-maps/:id` with a visual canvas powered by `@swimlane/ngx-graph` and dagre auto-layout
- Custom node rendering supporting three types: text, link, and picture
- Side panel for editing selected node: change type, text, color (picker + preset palette), and image (file upload or URL)
- Add child nodes to any selected node, delete nodes (cascades to descendants)
- Visual drag of nodes on the canvas (cosmetic only, no position persistence yet)
- Client-side search: filter mind maps by name on list page; search nodes by text on editor page with canvas highlighting and dropdown result list
- Image upload via binary POST to `/nodes/:id/upload`; image from URL stored directly in `value` field
- Update routing: `/` redirects to `/mind-maps`, guest guard on auth pages, auth guard on mind map pages

## Capabilities

### New Capabilities

- `mind-map-list`: List, create, rename, and delete mind maps via `/api/mind-maps` endpoints
- `mind-map-editor`: Visual canvas for viewing and interacting with a mind map's node tree using ngx-graph with dagre layout
- `node-management`: Add, update, and delete nodes within a mind map; supports text, link, and picture types
- `node-editing-panel`: Side panel UI for editing node type, text, color (picker + palette), and image (file upload or URL)
- `mind-map-search`: Filter mind maps by name on list page; search nodes by text on editor page with highlight and dropdown results

### Modified Capabilities

- `welcome-page`: Replaced by `mind-map-list` — the welcome page becomes the mind map list

## Impact

- New dependency: `@swimlane/ngx-graph` (graph visualization with dagre layout)
- New routes: `/mind-maps` (list), `/mind-maps/:id` (editor)
- Removed route: `/welcome`
- New services: `MindMapService`, `NodeService`
- Backend integration: all `/api/mind-maps` and `/api/mind-maps/:mmId/nodes` endpoints, plus `/uploads/:filename` for images
- Route guard updates: auth guard on new routes, guest guard redirect target changes from `/welcome` to `/mind-maps`

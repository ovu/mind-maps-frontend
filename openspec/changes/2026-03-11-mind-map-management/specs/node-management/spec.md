## node-management

Node CRUD operations within the mind map editor. Nodes are managed through the side panel and toolbar.

### Behavior

#### Add Node
- User selects a parent node, then clicks "Add Child" in the side panel
- Choose node type (text, link, or picture) for the new node
- Calls `POST /api/mind-maps/:mmId/nodes` with `{ parentId, nodeType }`
- New node appears in the tree; graph re-layouts with dagre
- New node is auto-selected for editing

#### Update Node
- User selects a node; side panel shows current values
- Edit type, text, value, or color via the side panel form
- On change, calls `PUT /api/mind-maps/:mmId/nodes/:nodeId` with updated fields
- Node visual updates immediately on the canvas

#### Delete Node
- User selects a node, clicks "Delete" in the side panel
- Show confirmation prompt (warns that descendants are also deleted)
- Cannot delete the root node (API returns 400)
- Calls `DELETE /api/mind-maps/:mmId/nodes/:nodeId`
- Node and all descendants removed from graph; re-layout

#### Upload Picture
- When node type is `picture`, side panel shows two options:
  1. **Upload from computer**: file input accepting `image/png` and `image/jpeg`, sends binary body to `POST /api/mind-maps/:mmId/nodes/:nodeId/upload`
  2. **From URL**: text input for URL, saves via `PUT /api/mind-maps/:mmId/nodes/:nodeId` with `{ value: url }`
- After upload/URL set, the picture renders on the node in the canvas

### API Integration

| Action | Method | Endpoint | Request | Response |
|--------|--------|----------|---------|----------|
| Add | POST | `/api/mind-maps/:mmId/nodes` | `{ parentId, nodeType, text?, value?, color? }` | `NodeResponse` |
| Update | PUT | `/api/mind-maps/:mmId/nodes/:nodeId` | `{ nodeType?, text?, value?, color? }` | `NodeResponse` |
| Delete | DELETE | `/api/mind-maps/:mmId/nodes/:nodeId` | — | `MessageResponse` |
| Upload | POST | `/api/mind-maps/:mmId/nodes/:nodeId/upload` | binary (image/png or image/jpeg) | `NodeResponse` |

### Error Handling

- Show error messages for failed operations
- Disable buttons during pending operations
- Prevent deleting root node (disable delete button for root)

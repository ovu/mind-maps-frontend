## mind-map-list

The mind map list page is the authenticated user's landing page at `/mind-maps`. It displays all mind maps owned by the user and supports create, rename, and delete operations.

### Behavior

- On load, fetch mind maps from `GET /api/mind-maps` and display as a list sorted by `createdAt` descending
- Show each map's name and creation date
- "Create" button opens an inline form or modal to enter a name, calls `POST /api/mind-maps`
- "Rename" button on each map allows inline editing of the name, calls `PUT /api/mind-maps/:id`
- "Delete" button on each map shows a confirmation prompt, then calls `DELETE /api/mind-maps/:id`
- Clicking a mind map navigates to `/mind-maps/:id` (the editor)
- Show loading state while fetching maps
- Show empty state when user has no mind maps
- Display the user's name or email in a header/nav area with a logout button
- Filter mind maps by name via a search input (client-side, filters the loaded list)

### API Integration

| Action | Method | Endpoint | Request | Response |
|--------|--------|----------|---------|----------|
| List | GET | `/api/mind-maps` | — | `MindMapListItem[]` |
| Create | POST | `/api/mind-maps` | `{ name }` | `MindMapResponse` |
| Rename | PUT | `/api/mind-maps/:id` | `{ name }` | `MindMapResponse` |
| Delete | DELETE | `/api/mind-maps/:id` | — | `MessageResponse` |

### Error Handling

- If list fetch fails with 401, redirect to `/login` (existing auth interceptor pattern)
- Show error message for failed create/rename/delete operations
- Disable submit buttons during pending operations

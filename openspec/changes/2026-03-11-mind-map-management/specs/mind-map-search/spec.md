## mind-map-search

Client-side search on both the mind map list page and the mind map editor page.

### List Page Search

- Search input in the header area filters the loaded mind map list by name
- Case-insensitive partial match
- Filters in real-time as the user types
- Empty search shows all maps
- No API call — filters the already-loaded `MindMapListItem[]` array

### Editor Page Search

- Search input in the editor toolbar searches nodes by their `text` field
- Case-insensitive partial match across all nodes in the loaded tree
- Results displayed in two ways simultaneously:
  1. **Canvas highlighting**: matching nodes get a visual highlight (e.g., glowing border or distinct background)
  2. **Dropdown result list**: a list of matching nodes shown below the search input
- Clicking a result in the dropdown:
  - Selects that node (opens it in the side panel)
  - Pans the canvas to center on that node
- Empty search clears all highlights and hides the dropdown
- Search covers the `text` field of all nodes regardless of type

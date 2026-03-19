## mind-map-editor

The mind map editor page at `/mind-maps/:id` renders the mind map's node tree as a visual graph using `@swimlane/ngx-graph` with dagre auto-layout.

### Behavior

- On load, fetch the mind map with full node tree from `GET /api/mind-maps/:id`
- Flatten the recursive `NodeResponse` tree into flat `nodes[]` and `links[]` arrays for ngx-graph
- Render the graph with dagre layout (hierarchical/tree orientation)
- Custom node templates: render each node differently based on `nodeType` (text, link, picture)
- Apply node `color` as background or border color on the node visual
- Display node `text` on the node; for link nodes also show `value` as a clickable URL; for picture nodes show the image
- For picture nodes: if `value` starts with `http`, render `<img [src]="value">`; otherwise render `<img [src]="baseUrl + '/uploads/' + value">`
- Pan and zoom the canvas (built-in ngx-graph features)
- Drag nodes visually on the canvas (cosmetic only, positions reset on refresh)
- Click a node to select it (opens the editing side panel)
- Click canvas background to deselect
- Show mind map name in the header with a back button to `/mind-maps`
- Show loading state while fetching the mind map
- Handle 404 (map not found) by showing error and link back to list

### Layout

```
┌──────────────────────────────────────────────────────────┐
│  ← Back    "Map Name"                    [Search: ____] │
│  ┌────────────────────────────────┬─────────────────────┐│
│  │                                │                     ││
│  │        ngx-graph canvas        │   Side panel        ││
│  │        (pan, zoom, drag)       │   (node editing)    ││
│  │                                │                     ││
│  └────────────────────────────────┴─────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

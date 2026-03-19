## node-editing-panel

The side panel displayed when a node is selected in the mind map editor. Provides controls to edit all node properties.

### Behavior

- Panel appears on the right side of the editor when a node is selected
- Panel collapses/hides when no node is selected (click canvas background)
- Shows the following controls based on node type:

#### Common Controls (all types)
- **Type selector**: dropdown to switch between text, link, picture. Changing type calls `PUT /nodes/:id` with `{ nodeType }`
- **Text input**: text field for the node's label/text. Updates via `PUT /nodes/:id` with `{ text }`
- **Color picker**: native `<input type="color">` plus a row of preset color swatches. Clicking a swatch or picking a color updates via `PUT /nodes/:id` with `{ color }`
- **Add Child button**: creates a new child node under the selected node
- **Delete button**: deletes the selected node (disabled for root node)

#### Link Type
- **URL input**: text field for `value` (the link URL). Updates via `PUT /nodes/:id` with `{ value }`

#### Picture Type
- **Upload from computer**: `<input type="file" accept="image/png,image/jpeg">`. Sends binary to `POST /nodes/:id/upload`
- **From URL**: text field for image URL. Updates via `PUT /nodes/:id` with `{ value: url }`
- **Image preview**: shows the current image (from upload or URL)

### Preset Color Palette

A row of color swatches offering quick color selection. Suggested colors:
- Red (`#EF4444`), Orange (`#F97316`), Yellow (`#EAB308`), Green (`#22C55E`), Blue (`#3B82F6`), Purple (`#8B5CF6`), Pink (`#EC4899`), Gray (`#6B7280`)

### Layout

```
┌─────────────────────┐
│  Node Editor        │
│                     │
│  Type: [text    ▼]  │
│                     │
│  Text:              │
│  [_______________]  │
│                     │
│  Color:             │
│  [● picker      ]  │
│  ● ● ● ● ● ● ● ●  │
│                     │
│  ── if link ──      │
│  URL:               │
│  [_______________]  │
│                     │
│  ── if picture ──   │
│  [Upload file    ]  │
│  [From URL: ___  ]  │
│  ┌───────────────┐  │
│  │  preview img  │  │
│  └───────────────┘  │
│                     │
│  [+ Add Child]      │
│  [Delete Node]      │
└─────────────────────┘
```

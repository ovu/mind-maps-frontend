export interface MindMapListItem {
  id: string;
  name: string;
  createdAt: string;
}

export interface MindMapResponse {
  id: string;
  name: string;
  createdAt: string;
  rootNode: NodeResponse;
}

export interface NodeResponse {
  id: string;
  parentId: string | null;
  nodeType: 'text' | 'link' | 'picture';
  text: string | null;
  value: string | null;
  color: string | null;
  createdAt: string;
  children: NodeResponse[];
}

export interface CreateNodeRequest {
  parentId: string;
  nodeType: 'text' | 'link' | 'picture';
  text?: string | null;
  value?: string | null;
  color?: string | null;
}

export interface UpdateNodeRequest {
  nodeType?: 'text' | 'link' | 'picture';
  text?: string | null;
  value?: string | null;
  color?: string | null;
}

export interface CreateMindMapRequest {
  name: string;
}

export interface UpdateMindMapRequest {
  name: string;
}

export interface MessageResponse {
  message: string;
}

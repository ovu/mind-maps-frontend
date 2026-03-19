import { NodeResponse } from '../models/mind-map.model';

export interface GraphNode {
  id: string;
  label: string;
  data: NodeResponse;
  /** Original node color — stored separately because ngx-graph overwrites data.color in tick() */
  _nodeColor: string | null;
  dimension?: { width: number; height: number };
}

export interface GraphLink {
  id: string;
  source: string;
  target: string;
}

export interface FlatGraph {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Prefix IDs with a letter so they are valid CSS selectors
// (ngx-graph uses querySelector('#id') internally and UUIDs starting with digits are invalid)
export function toGraphId(id: string): string {
  return `n${id}`;
}

export function fromGraphId(graphId: string): string {
  return graphId.substring(1);
}

export function flattenTree(root: NodeResponse): FlatGraph {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  function traverse(node: NodeResponse): void {
    nodes.push({
      id: toGraphId(node.id),
      label: node.text || node.nodeType,
      data: node,
      _nodeColor: node.color,
      dimension: { width: 180, height: 70 },
    });

    for (const child of node.children) {
      links.push({
        id: `l${node.id}_${child.id}`,
        source: toGraphId(node.id),
        target: toGraphId(child.id),
      });
      traverse(child);
    }
  }

  traverse(root);
  return { nodes, links };
}

export function findNodeInTree(root: NodeResponse, nodeId: string): NodeResponse | null {
  if (root.id === nodeId) return root;
  for (const child of root.children) {
    const found = findNodeInTree(child, nodeId);
    if (found) return found;
  }
  return null;
}

export function collectAllNodes(root: NodeResponse): NodeResponse[] {
  const result: NodeResponse[] = [root];
  for (const child of root.children) {
    result.push(...collectAllNodes(child));
  }
  return result;
}

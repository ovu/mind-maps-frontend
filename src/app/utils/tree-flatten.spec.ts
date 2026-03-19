import { flattenTree, findNodeInTree, collectAllNodes } from './tree-flatten';
import { NodeResponse } from '../models/mind-map.model';

function makeNode(id: string, text: string, children: NodeResponse[] = []): NodeResponse {
  return {
    id,
    parentId: null,
    nodeType: 'text',
    text,
    value: null,
    color: null,
    createdAt: '2026-01-01T00:00:00Z',
    children,
  };
}

describe('flattenTree', () => {
  it('flattens a single root node with prefixed id', () => {
    const root = makeNode('r', 'Root');
    const { nodes, links } = flattenTree(root);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].id).toBe('nr');
    expect(links).toHaveLength(0);
  });

  it('flattens a tree with children using prefixed ids', () => {
    const root = makeNode('r', 'Root', [
      makeNode('a', 'A'),
      makeNode('b', 'B', [makeNode('c', 'C')]),
    ]);
    const { nodes, links } = flattenTree(root);
    expect(nodes).toHaveLength(4);
    expect(links).toHaveLength(3);
    expect(links.map(l => `${l.source}->${l.target}`)).toEqual(['nr->na', 'nr->nb', 'nb->nc']);
  });

  it('uses text as label, falls back to nodeType', () => {
    const root = makeNode('r', '');
    root.text = null;
    const { nodes } = flattenTree(root);
    expect(nodes[0].label).toBe('text');
  });
});

describe('findNodeInTree', () => {
  const tree = makeNode('r', 'Root', [
    makeNode('a', 'A'),
    makeNode('b', 'B', [makeNode('c', 'C')]),
  ]);

  it('finds the root', () => {
    expect(findNodeInTree(tree, 'r')?.text).toBe('Root');
  });

  it('finds a deep child', () => {
    expect(findNodeInTree(tree, 'c')?.text).toBe('C');
  });

  it('returns null for missing id', () => {
    expect(findNodeInTree(tree, 'z')).toBeNull();
  });
});

describe('collectAllNodes', () => {
  it('collects all nodes in the tree', () => {
    const tree = makeNode('r', 'Root', [
      makeNode('a', 'A'),
      makeNode('b', 'B', [makeNode('c', 'C')]),
    ]);
    const all = collectAllNodes(tree);
    expect(all).toHaveLength(4);
    expect(all.map(n => n.id)).toEqual(['r', 'a', 'b', 'c']);
  });
});

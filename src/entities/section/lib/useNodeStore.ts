// stores/useNodesStore.ts
import { create } from 'zustand'

import { AnswerNode } from '../ui/Section'

interface NodesState {
  nodes: Record<string, AnswerNode[]>
  getNodesBySection: (sectionId: string) => AnswerNode[]
  addNode: (sectionId: string, node: AnswerNode) => void
  updateNode: (
    sectionId: string,
    nodeId: string,
    updates: Partial<AnswerNode>
  ) => void
  removeNode: (sectionId: string, nodeId: string) => void
  setNodesForSection: (sectionId: string, nodes: AnswerNode[]) => void
}

export const useNodesStore = create<NodesState>((set, get) => ({
  nodes: {},

  getNodesBySection: sectionId => get().nodes[sectionId] || [],

  addNode: (sectionId, node) =>
    set(state => ({
      nodes: {
        ...state.nodes,
        [sectionId]: [...(state.nodes[sectionId] || []), node]
      }
    })),

  updateNode: (sectionId, nodeId, updates) =>
    set(state => ({
      nodes: {
        ...state.nodes,
        [sectionId]: (state.nodes[sectionId] || []).map(node =>
          node.id === nodeId ? { ...node, ...updates } : node
        )
      }
    })),

  removeNode: (sectionId, nodeId) =>
    set(state => ({
      nodes: {
        ...state.nodes,
        [sectionId]: (state.nodes[sectionId] || []).filter(n => n.id !== nodeId)
      }
    })),

  setNodesForSection: (sectionId, nodes) =>
    set(state => ({
      nodes: { ...state.nodes, [sectionId]: nodes }
    }))
}))

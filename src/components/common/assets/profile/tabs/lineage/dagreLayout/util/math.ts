import { Edge } from '../types.ts'
import { isObject } from './object.ts'

export const getEdgeTerminal = (edge: Edge, type: 'source' | 'target') => {
    const terminal = edge[type]
    if (isObject(terminal)) {
        return terminal.cell
    }
    return terminal
}

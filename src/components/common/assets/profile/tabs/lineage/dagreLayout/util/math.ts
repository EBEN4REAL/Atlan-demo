import { Edge } from '../types'
import { isObject } from './object'

export const getEdgeTerminal = (edge: Edge, type: 'source' | 'target') => {
    const terminal = edge[type]
    if (isObject(terminal)) {
        return terminal.cell
    }
    return terminal
}

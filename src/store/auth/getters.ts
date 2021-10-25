import { GettersTree } from 'pinia'
import { State } from './state'

export interface Getters {}

export const getters: GettersTree<State> & Getters = {}

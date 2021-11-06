import { GettersTree } from 'pinia'
import { State } from './state'

import { SourceList } from '~/constant/source'

export interface Getters {}

export const getters: GettersTree<State> & Getters = {}

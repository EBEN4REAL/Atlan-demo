import { GettersTree } from 'pinia'
import { State } from './state'

import { SourceList } from '~/constant/source'

export interface Getters {
    getSourceList(): any[]
}

export const getters: GettersTree<State> & Getters = {
    getSourceList() {
        const tempSourceList = [
            ...new Set(this.list?.map((i) => i.attributes.connectorName)),
        ]

        return SourceList.filter((item) =>
            tempSourceList.includes(item.id)
        ).sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0))
    },
}

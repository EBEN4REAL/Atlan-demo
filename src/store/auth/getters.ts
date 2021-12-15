import { GettersTree } from 'pinia'
import { State } from './state'

import { SourceList } from '~/constant/source'

export interface Getters {
    getSourceList(): any[]
    getConnectorImageMapping(): any
    getImage(): (id: string) => any
}

export const getters: GettersTree<State> & Getters = {
    getSourceList() {
        const duplicateList = this.list?.map((i) =>
            i.attributes?.connectorName?.toLowerCase()
        )

        const countMap = (duplicateList || []).reduce((prev, cur) => {
            prev[cur] = (prev[cur] || 0) + 1
            return prev
        }, {})

        const sourceList = SourceList.map((i) => ({
            ...i,
            count: countMap[i.id],
        }))

        return sourceList
            .filter((item) => item.count > 0)
            .sort((a, b) =>
                a.count < b.count ? 1 : b.count < a.count ? -1 : 0
            )
    },
    getConnectorImageMapping() {
        const map = {}
        SourceList.forEach((item) => {
            map[item.id.toLowerCase()] = item.image
        })
        return map
    },
    getImage() {
        return (id) => this.getSourceList?.find((item) => item.id === id)?.image
    },
}

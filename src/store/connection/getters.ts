import { GettersTree } from 'pinia'
import { State } from './state'

import { SourceList } from '~/constant/source'

export interface Getters {
    getList(state: State): ConnectionType[]
    getSourceList(): any[]
    getFilteredSourceList(): (list: string[]) => any
    getConnectorImageMapping(): any
    getConnectorLabelMapping(): any
    getImage(): (id: string) => any
}

export const getters: GettersTree<State> & Getters = {
    getList(state: State) {
        return state.list
    },
    getFilteredSourceList() {
        return (list) => {
            const duplicateList = this.list
                ?.filter((i) => list?.includes(i.guid))
                .map((i) => i.attributes?.connectorName?.toLowerCase())

            let countMap = (duplicateList || []).reduce((prev, cur) => {
                prev[cur] = (prev[cur] || 0) + 1
                return prev
            }, {})

            const sourceList = SourceList.map((i) => ({
                ...i,
                count: countMap[i.id.toLowerCase()],
            }))

            return sourceList
                .filter((item) => item.count > 0)
                .sort((a, b) =>
                    a.count < b.count ? 1 : b.count < a.count ? -1 : 0
                )
        }
    },
    getSourceList() {
        const duplicateList = this.list?.map((i) =>
            i.attributes?.connectorName?.toLowerCase()
        )

        let countMap = (duplicateList || []).reduce((prev, cur) => {
            prev[cur] = (prev[cur] || 0) + 1
            return prev
        }, {})

        const sourceList = SourceList.map((i) => ({
            ...i,
            count: countMap[i.id.toLowerCase()],
        }))

        return sourceList
            .filter((item) => item.count > 0)
            .sort((a, b) =>
                a.count < b.count ? 1 : b.count < a.count ? -1 : 0
            )
    },
    activeConnectionSourceList() {
        return this.getSourceList.filter(s => this.list.some(
            l => l.attributes.connectorName.toLowerCase() === s.id.toLowerCase(0)
                && l.status === 'ACTIVE'))
    },
    getConnectorImageMapping() {
        const map = {}
        SourceList.forEach((item) => {
            map[item.id.toLowerCase()] = item.image
        })
        return map
    },
    getConnectorLabelMapping() {
        const map = {}
        SourceList.forEach((item) => {
            map[item.id.toLowerCase()] = item.label
        })
        return map
    },
    getImage() {
        return (id) => this.getSourceList?.find((item) => item.id === id)?.image
    },
}

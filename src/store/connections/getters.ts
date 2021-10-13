// eslint-disable-next-line import/no-cycle

import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'
import { SourceList } from '~/constant/source'
import { ConnectionType } from '~/types/atlas/connection'
import { State, Status } from './state'
import useAssetInfo from '~/composables/asset/useAssetInfo'

export type Getters = {
    getList(state: State): ConnectionType[]
    getSourceMap(): (string | undefined)[]
    getSourceList(): {
        id: string
        label: string
        image: string
        types: string[]
        hierarchy: Record<string, any>[]
        filterMaxLevel: number
    }[]
    getImage(): (id: string) => any
    getSourceTree(): (searchText: string) => TreeDataItem[]
    getStatus(state: State): Status
    getConnectorName(attributes: any): string
    getConnectorsNameFromQualifiedName(
        qualifiedName: string
    ): string | undefined
}

export const getters: Getters = {
    getStatus(state) {
        return state.status
    },
    getList(state) {
        return state.data.entities
    },
    getSourceMap() {
        const { getConnectorName } = useAssetInfo()
        return [
            ...new Set(
                this.getList?.map((i) => getConnectorName(i.attributes))
            ),
        ]
    },
    getSourceList() {
        return SourceList.filter((s) =>
            this.getSourceMap?.includes(s.id.toLowerCase())
        ).sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0))
    },
    getImage() {
        return (id) => this.getSourceList?.find((item) => item.id === id)?.image
    },
    getSourceTree() {
        return (searchText) => {
            const { getConnectorName } = useAssetInfo()
            const treeData: TreeDataItem[] = []

            this.getSourceList?.forEach((src) => {
                const children = this.getList
                    .filter((item) => {
                        if (searchText && searchText !== '') {
                            return (
                                getConnectorName(item.attributes) === src.id &&
                                (getConnectorName(item.attributes)
                                    .toLowerCase()
                                    .includes(searchText?.toLowerCase()) ||
                                    item.attributes.displayName
                                        ?.toLowerCase()
                                        .includes(searchText?.toLowerCase()))
                            )
                        }
                        return getConnectorName(item.attributes) === src.id
                    })
                    .map((item) => ({
                        key: item.guid,
                        title:
                            item.attributes.displayName || item.attributes.name,
                        type: 'connection',
                        isLeaf: true,
                    }))
                    .sort((a, b) =>
                        a.title > b.title ? 1 : b.title > a.title ? -1 : 0
                    )

                if (children.length > 0) {
                    treeData.push({
                        key: src.id,
                        title: src.label,
                        image: src?.image,
                        children,
                        count: children?.length,
                        type: 'connector',
                        isRoot: true,
                        isLeaf: false,
                    })
                }
            })
            return treeData
        }
    },
}

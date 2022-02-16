import { Ref, toRaw } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { assetInterface } from '~/types/assets/asset.interface'
import { generateUUID } from '~/utils/helper/generator'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'

export function addFilter(
    activeInlineTab: Ref<activeInlineTabInterface>,
    item: Ref<assetInterface>
) {
    const filterIndex = activeInlineTab.value.playground.vqb.panels.findIndex(
        (panel) => panel.id.toLowerCase() === 'filter'
    )
    if (filterIndex > 0) {
        let _index = activeInlineTab.value.playground.vqb.panels[
            filterIndex
        ].subpanels.findIndex(
            (column) =>
                column.qualifiedName ===
                item.value?.entity.attributes?.qualifiedName
        )

        // column already added
        if (_index >= 0) return

        // only add subpanel
        const subpanels = [
            ...activeInlineTab.value.playground.vqb.panels[filterIndex]
                .subpanels,
            {
                id: generateUUID(),
                column: {
                    attributes: item.value?.entity.attributes,
                    isForeign: item.value?.entity.attributes?.isForeign,
                    isPrimary: item.value?.entity.attributes?.isPrimary,
                    isPartition: item.value?.entity.attributes?.isPartition,
                    item: item.value?.entity,
                    label: item.value?.entity.attributes?.name,
                    qualifiedName: item.value?.entity.attributes?.qualifiedName,
                    type: item.value?.entity.attributes?.dataType,
                },
                filter: {
                    filterType: 'and',
                    name: 'equal',
                    title: 'Equal to',
                    type: 'input',
                },
                expand: true,
            },
        ]
        const len =
            activeInlineTab.value.playground.vqb.panels[filterIndex].subpanels
                .length
        if (len > 0) {
            // edge case when previous subpanel is empty
            const previousSubpanel =
                activeInlineTab.value.playground.vqb.panels[filterIndex]
                    .subpanels[len - 1]
            if (Object.keys(previousSubpanel?.column ?? {}).length === 0) {
                // remove previous el
                subpanels.splice(len - 1, 1)
            }
        }
        activeInlineTab.value.playground.vqb.panels[filterIndex].subpanels =
            subpanels
    } else {
        const panel = {
            id: 'filter',
            hide: true,
            active: false,
            order: activeInlineTab.value.playground.vqb.panels.length,
            subpanels: [
                {
                    id: generateUUID(),
                    column: {
                        attributes: item.value?.entity.attributes,
                        isForeign: item.value?.entity.attributes?.isForeign,
                        isPrimary: item.value?.entity.attributes?.isPrimary,
                        isPartition: item.value?.entity.attributes?.isPartition,
                        item: item.value?.entity,
                        label: item.value?.entity.attributes?.name,
                        qualifiedName:
                            item.value?.entity.attributes?.qualifiedName,
                        type: item.value?.entity.attributes?.dataType,
                    },
                    filter: {
                        filterType: 'and',
                        name: 'equal',
                        title: 'Equal to',
                        type: 'input',
                    },
                    expand: true,
                },
            ],
            expand: true,
        }
        activeInlineTab.value.playground.vqb.panels.push(panel)
    }
}

export function addAggregate(
    activeInlineTab: Ref<activeInlineTabInterface>,
    item: Ref<assetInterface>
) {
    const aggregateIndex =
        activeInlineTab.value.playground.vqb.panels.findIndex(
            (panel) => panel.id.toLowerCase() === 'aggregate'
        )
    if (aggregateIndex > 0) {
        let _index = activeInlineTab.value.playground.vqb.panels[
            aggregateIndex
        ].subpanels.findIndex(
            (column) =>
                column.qualifiedName ===
                item.value?.entity.attributes?.qualifiedName
        )

        // column already added
        if (_index >= 0) return

        // only add subpanel
        const subpanels = [
            ...activeInlineTab.value.playground.vqb.panels[aggregateIndex]
                .subpanels,
            {
                id: generateUUID(),
                column: {
                    attributes: item.value?.entity.attributes,
                    isForeign: item.value?.entity.attributes?.isForeign,
                    isPrimary: item.value?.entity.attributes?.isPrimary,
                    isPartition: item.value?.entity.attributes?.isPartition,
                    item: item.value?.entity,
                    label: item.value?.entity.attributes?.name,
                    qualifiedName: item.value?.entity.attributes?.qualifiedName,
                    type: item.value?.entity.attributes?.dataType,
                    order: undefined,
                },
                aggregators: [],
                expand: true,
            },
        ]

        const len =
            activeInlineTab.value.playground.vqb.panels[aggregateIndex]
                .subpanels.length
        if (len > 0) {
            // edge case when previous subpanel is empty
            const previousSubpanel =
                activeInlineTab.value.playground.vqb.panels[aggregateIndex]
                    .subpanels[len - 1]
            if (Object.keys(previousSubpanel?.column ?? {}).length === 0) {
                // remove previous el
                subpanels.splice(len - 1, 1)
            }
        }
        activeInlineTab.value.playground.vqb.panels[aggregateIndex].subpanels =
            subpanels
    } else {
        const panel = {
            id: 'aggregate',
            hide: true,
            active: false,
            order: activeInlineTab.value.playground.vqb.panels.length,
            subpanels: [
                {
                    id: generateUUID(),
                    column: {
                        attributes: item.value?.entity.attributes,
                        isForeign: item.value?.entity.attributes?.isForeign,
                        isPrimary: item.value?.entity.attributes?.isPrimary,
                        isPartition: item.value?.entity.attributes?.isPartition,
                        item: item.value?.entity,
                        label: item.value?.entity.attributes?.name,
                        qualifiedName:
                            item.value?.entity.attributes?.qualifiedName,
                        type: item.value?.entity.attributes?.dataType,
                        order: undefined,
                    },
                    aggregators: [],
                    expand: true,
                },
            ],
            expand: true,
        }
        activeInlineTab.value.playground.vqb.panels.push(panel)
    }
}

function getTableQualifiedNameFromColumnQualifiedName(
    qualifiedName: string | undefined
) {
    if (qualifiedName) {
        const t = qualifiedName.split('/')
        t.pop()
        return t.join('/')
    }
    return undefined
}

export function addGroup(
    activeInlineTab: Ref<activeInlineTabInterface>,
    item: Ref<assetInterface>
) {
    const filterIndex = activeInlineTab.value.playground.vqb.panels.findIndex(
        (panel) => panel.id.toLowerCase() === 'group'
    )
    if (filterIndex > 0) {
        // only add subpanel
        let subpanels = JSON.parse(
            JSON.stringify(
                activeInlineTab.value.playground.vqb.panels[filterIndex]
                    .subpanels
            )
        )
        let subpanel = subpanels[0]
        let _index = subpanel.columns.findIndex(
            (qualifiedName) =>
                qualifiedName === item.value?.entity.attributes?.qualifiedName
        )

        // column already added
        if (_index >= 0) return

        subpanel = {
            ...subpanel,
            columns: [
                ...subpanel.columns,
                item.value?.entity.attributes?.qualifiedName,
            ],
            columnsData: [
                ...subpanel.columnsData,

                {
                    item: item.value?.entity,
                    label: item.value?.entity.attributes?.name,
                    qualifiedName: item.value?.entity.attributes?.qualifiedName,
                    type: item.value?.entity.attributes?.dataType,
                },
            ],
        }
        subpanels = [subpanel]

        activeInlineTab.value.playground.vqb.panels[filterIndex].subpanels =
            subpanels
    } else {
        const panel = {
            id: 'group',
            hide: true,
            active: false,
            order: activeInlineTab.value.playground.vqb.panels.length,
            subpanels: [
                {
                    id: generateUUID(),
                    columns: [item.value?.entity.attributes?.qualifiedName],
                    columnsData: [
                        {
                            item: item.value?.entity,
                            label: item.value?.entity.attributes?.name,
                            qualifiedName:
                                item.value?.entity.attributes?.qualifiedName,
                            type: item.value?.entity.attributes?.dataType,
                        },
                    ],
                    expand: true,
                },
            ],
            tableQualfiedName: undefined,
            expand: true,
        }
        activeInlineTab.value.playground.vqb.panels.push(panel)
    }
}
export function addTable(
    activeInlineTab: Ref<activeInlineTabInterface>,
    item: Ref<assetInterface>,
    tabs: Ref<activeInlineTabInterface[]>
) {
    const { modifyActiveInlineTab } = useInlineTab()
    const tableIndex = activeInlineTab.value.playground.vqb.panels.findIndex(
        (panel) => panel.id.toLowerCase() === 'columns'
    )

    if (tableIndex > 0) {
        return
    } else {
        let subpanels = JSON.parse(
            JSON.stringify(
                activeInlineTab.value.playground.vqb.panels[0].subpanels
            )
        )

        // setting context for editor when editor context is different than schema explorer
        if (
            activeInlineTab.value.playground.editor.context.attributeValue !==
            activeInlineTab.value.explorer.schema.connectors.attributeValue
        ) {
            const activeInlineTabCopy = JSON.parse(
                JSON.stringify(toRaw(activeInlineTab.value))
            )
            activeInlineTabCopy.playground.editor.context =
                activeInlineTab.value.explorer.schema.connectors

            modifyActiveInlineTab(
                activeInlineTabCopy,
                tabs,
                activeInlineTabCopy.isSaved,
                true
            )
        }

        let subpanel = subpanels[0]
        subpanel = {
            ...subpanel,
            tableData: {
                assetType: item.value?.entity.typeName,
                certificateStatus:
                    item.value?.entity?.attributes?.certificateStatus,
                item: {},
            },
            tableQualfiedName: item.value?.entity.attributes?.qualifiedName,
        }
        subpanels = [subpanel]

        activeInlineTab.value.playground.vqb.panels[0].subpanels = subpanels
        activeInlineTab.value.playground.vqb.selectedTables = [
            {
                addedBy: 'column',
                tableQualifiedName:
                    item.value?.entity.attributes?.qualifiedName,
            },
        ]
    }
}

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

function getTableNameFromColumnQualifiedName(columnQualifiedName: string) {
    const spiltArray = columnQualifiedName?.split('/')
    if (spiltArray?.length > 5) {
        return `${spiltArray[5]}`
    }
    return ''
}

export function addJoin(
    activeInlineTab: Ref<activeInlineTabInterface>,
    item: Ref<assetInterface>
) {
    // debugger
    const joinIndex = activeInlineTab.value.playground.vqb.panels.findIndex(
        (panel) => panel.id.toLowerCase() === 'join'
    )
    if (joinIndex > 0) {
        let subpanels = JSON.parse(
            JSON.stringify(
                toRaw(activeInlineTab.value).playground.vqb.panels[joinIndex]
                    .subpanels
            )
        )
        // assuming first table should be selected before join
        let index,
            pos,
            subpanelLen = subpanels.length

        // ensure the column is from same table it is selected

        /* 
        item.value?.entity.attributes?.qualifiedName.includes(
                activeInlineTab.value.playground.vqb.selectedTables[0]
                    .tableQualifiedName
            )
        */

        // let ifAlreadyThere = false;
        // activeInlineTab.value.playground.vqb.selectedTables.every((table)=>{
        //     if(item.value?.entity.attributes?.qualifiedName.includes(
        //         table
        //             .tableQualifiedName
        //     )){
        //         ifAlreadyThere=true;
        //         return false;
        //     }
        //     return true

        // })

        const canThisCoulmnInsertableInLeft =
            Object.keys(subpanels[0].columnsDataLeft, {}).length === 0 &&
            item.value?.entity.attributes?.qualifiedName.includes(
                activeInlineTab.value.playground.vqb.selectedTables[0]
                    .tableQualifiedName
            )
        if (canThisCoulmnInsertableInLeft) {
            const subpanel = {
                ...subpanels[0],
                columnsDataLeft: {
                    columnQualifiedName:
                        item.value?.entity.attributes?.qualifiedName,
                    label: item.value?.entity.attributes?.name,
                    tableName: getTableNameFromColumnQualifiedName(
                        item.value?.entity.attributes?.qualifiedName
                    ),
                    type: item.value?.entity.attributes?.dataType,
                    value: item.value?.entity.attributes?.name,
                },
            }
            subpanels.splice(0, 1, subpanel)
            // only add subpanel
            activeInlineTab.value.playground.vqb.panels[joinIndex].subpanels =
                subpanels
            return
        } else {
            // found very first empty filed in joins
            for (let i = 0; i < subpanelLen; i++) {
                // first check right side then left side
                if (
                    Object.keys(subpanels[i].columnsDataLeft, {}).length === 0
                ) {
                    index = i
                    pos = 'left'
                    break
                } else if (
                    Object.keys(subpanels[i].columnsDataRight, {}).length === 0
                ) {
                    index = i
                    pos = 'right'
                    break
                }
            }
        }

        if (index !== undefined) {
            if (pos === 'left') {
                const subpanel = {
                    ...subpanels[index],
                    columnsDataLeft: {
                        columnQualifiedName:
                            item.value?.entity.attributes?.qualifiedName,
                        label: item.value?.entity.attributes?.name,
                        tableName: getTableNameFromColumnQualifiedName(
                            item.value?.entity.attributes?.qualifiedName
                        ),
                        type: item.value?.entity.attributes?.dataType,
                        value: item.value?.entity.attributes?.name,
                    },
                }
                // replacing the element
                subpanels.splice(index, 1, subpanel)
            } else {
                const subpanel = {
                    ...subpanels[index],
                    columnsDataRight: {
                        columnQualifiedName:
                            item.value?.entity.attributes?.qualifiedName,
                        label: item.value?.entity.attributes?.name,
                        tableName: getTableNameFromColumnQualifiedName(
                            item.value?.entity.attributes?.qualifiedName
                        ),
                        type: item.value?.entity.attributes?.dataType,
                        value: item.value?.entity.attributes?.name,
                    },
                }

                subpanels.splice(index, 1, subpanel)
                const tableQualifiedName =
                    getTableQualifiedNameFromColumnQualifiedName(
                        item.value?.entity.attributes?.qualifiedName
                    )
                const addedBy = `joins-${subpanels[index].id}${index}2`
                const selectedTables = JSON.parse(
                    JSON.stringify(
                        toRaw(activeInlineTab.value).playground.vqb
                            .selectedTables
                    )
                )
                selectedTables.push({
                    tableQualifiedName: tableQualifiedName,
                    addedBy,
                })

                // setting the new tables
                activeInlineTab.value.playground.vqb.selectedTables =
                    selectedTables
            }
        }
        // index not found this means we have to insert a new subpanel
        else {
            const id = generateUUID()

            const subpanel = {
                id,
                columnsDataLeft: {
                    columnQualifiedName:
                        item.value?.entity.attributes?.qualifiedName,
                    label: item.value?.entity.attributes?.name,
                    tableName: getTableNameFromColumnQualifiedName(
                        item.value?.entity.attributes?.qualifiedName
                    ),
                    type: item.value?.entity.attributes?.dataType,
                    value: item.value?.entity.attributes?.name,
                },
                columnsDataRight: {},
                joinType: {
                    name: 'Inner Join',
                    type: 'inner_join',
                },
                expand: true,
            }
            subpanels = [...subpanels, subpanel]
            // const tableQualifiedName = getTableQualifiedNameFromColumnQualifiedName(item.value?.entity.attributes?.qualifiedName);
            // const addedBy = `joins-${id}${subpanelLen-1}1`
        }

        // only add subpanel
        activeInlineTab.value.playground.vqb.panels[joinIndex].subpanels =
            subpanels
    } else {
        // debugger
        // ensure you allow this column from same table present in context
        const panel = {
            id: 'join',
            hide: true,
            active: false,
            order: activeInlineTab.value.playground.vqb.panels.length,
            subpanels: [
                {
                    id: generateUUID(),
                    columnsDataLeft: {
                        columnQualifiedName:
                            item.value?.entity.attributes?.qualifiedName,
                        label: item.value?.entity.attributes?.name,
                        tableName: getTableNameFromColumnQualifiedName(
                            item.value?.entity.attributes?.qualifiedName
                        ),
                        type: item.value?.entity.attributes?.dataType,
                        value: item.value?.entity.attributes?.name,
                    },
                    columnsDataRight: {},
                    joinType: {
                        name: 'Inner Join',
                        type: 'inner_join',
                    },
                },
            ],
            expand: true,
        }

        activeInlineTab.value.playground.vqb.panels.push(panel)
    }
}

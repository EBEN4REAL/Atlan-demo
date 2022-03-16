import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import squel from 'squel'
import { useUtils } from './useUtils'
import { aggregatedAliasMap } from '../constants/aggregation'
import { useFilter } from './useFilter'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { getDialectInfo } from '~/components/insights/common/composables/getDialectInfo'

const { nameMap, getInputTypeFromColumnType } = useFilter()

export function getTableName(columnQualifiedName: string) {
    const spiltArray = columnQualifiedName?.split('/')
    if (spiltArray?.length > 5) {
        return `${spiltArray[5]}`
    }
    return ''
}
export function getColumnName(columnQualifiedName: string) {
    const spiltArray = columnQualifiedName?.split('/')
    if (spiltArray?.length > 6) {
        return `${spiltArray[6]}`
    }
    return ''
}

export function getValueStringFromType(subpanel, value) {
    let res = ''
    const type = getInputTypeFromColumnType(
        subpanel?.column?.type
    )?.toLocaleLowerCase()
    if (type === 'number') res += `${Number(value)}`
    else if (type === 'text') {
        if (subpanel?.filter?.name?.includes('like')) {
            console.log(subpanel?.filter?.name?.includes('like'), 'sd like')
            switch (subpanel?.filter?.name) {
                case 'start_like': {
                    res += `'${value}%'`
                    break
                }
                case 'end_like': {
                    res += `'%${value}'`
                    break
                }
            }
        } else if (subpanel?.filter?.name?.includes('contains')) {
            switch (subpanel?.filter?.name) {
                case 'not_contains': {
                    res += `'%${value}%'`
                    break
                }
                case 'contains': {
                    res += `'%${value}%'`
                    break
                }
            }
        } else res += `'${value}'`
    } else if (type === 'date') {
        // check if the column type is TIMESTAMP
        if (
            subpanel?.column.attributes?.dataType?.toUpperCase() === 'TIMESTAMP'
        ) {
            res += `TIMESTAMP '${value}'`
        } else {
            res += `DATE '${value}'`
        }
    }
    return res
}

// if you are changing this don't
function suffixDuplicates(copyList) {
    const list = JSON.parse(JSON.stringify(copyList))
    // Containers

    var count = {}
    var firstOccurences = {}

    // Loop through the list

    var subpanel, itemCount
    for (var i = 0, c = list.length; i < c; i++) {
        subpanel = list[i]
        itemCount = count[subpanel.column.label]
        itemCount = count[subpanel.column.label] =
            itemCount == null ? 1 : itemCount + 1

        if (itemCount == 2)
            list[firstOccurences[subpanel.column.label]] =
                list[firstOccurences[subpanel.column.label]]

        if (count[subpanel.column.label] > 1)
            list[i].column.label =
                list[i].column.label + (count[subpanel.column.label] - 1)
        else firstOccurences[subpanel.column.label] = i
    }

    // Return
    return list
}

export function generateSQLQuery(
    activeInlineTab: activeInlineTabInterface,
    limitRows: {
        checked: boolean
        rowsCount: number
    },
    useSchemaExplorerContext?: boolean
) {
    const { getTableNameFromTableQualifiedName } = useUtils()
    const { getDatabaseName, getSchemaName, getConnectorName } = useConnector()
    // for assetQuote Info of different sources

    const context = !useSchemaExplorerContext
        ? activeInlineTab.playground.editor.context
        : activeInlineTab.explorer.schema.connectors

    const assetQuoteType = getDialectInfo(
        getConnectorName(context.attributeValue) ?? ''
    )

    let select = squel.select()
    if (assetQuoteType)
        select = squel.select({ fieldAliasQuoteCharacter: assetQuoteType })
        
    const columnPanel = activeInlineTab.playground.vqb.panels.find(
        (panel) => panel.id.toLowerCase() === 'columns'
    )
    const aggregatePanel = activeInlineTab.playground.vqb.panels.find(
        (panel) => panel.id.toLowerCase() === 'aggregate'
    )
    const groupPanel = activeInlineTab.playground.vqb.panels.find(
        (panel) => panel.id.toLowerCase() === 'group'
    )
    const sortPanel = activeInlineTab.playground.vqb.panels.find(
        (panel) => panel.id.toLowerCase() === 'sort'
    )
    const filter = activeInlineTab.playground.vqb.panels.find(
        (panel) => panel.id.toLowerCase() === 'filter'
    )

    const join = activeInlineTab.playground.vqb.panels.find(
        (panel) => panel.id.toLowerCase() === 'join'
    )

    function getTableNameWithQuotes(columnQualifiedName: string) {
        const spiltArray = columnQualifiedName?.split('/')
        if (spiltArray?.length > 5) {
            return `${assetQuoteType}${spiltArray[5]}${assetQuoteType}`
        }
        return ''
    }

    function isValidValueArray(arr: any[]) {
        let res = true
        arr.forEach((el) => {
            if (el === '') res = false
            if (el === null) res = false
            if (el === undefined) res = false
        })
        return res
    }
    // "TABLENAME"."COLUMNNAME"
    // "default/snowflake/1640717306/ATLAN_SAMPLE_DATA/COVID_19/COVID_COUNTY_LEVEL_PIVOT/LAST_UPDATED_DATE"
    function getJoinFormattedColumnName(columnQualifiedName: string) {
        const spiltArray = columnQualifiedName?.split('/')
        if (spiltArray.length > 6) {
            return `${assetQuoteType}${spiltArray[5]}${assetQuoteType}.${assetQuoteType}${spiltArray[6]}${assetQuoteType}`
        }
    }

    function getContext(qualifiedName, useSchemaExplorerContext?: boolean) {
        let contextPrefix = ''
        if (useSchemaExplorerContext) {
            contextPrefix += `${assetQuoteType}${
                getDatabaseName(qualifiedName ?? '') ?? ''
            }${assetQuoteType}.${assetQuoteType}${
                getSchemaName(qualifiedName ?? '') ?? ''
            }${assetQuoteType}`
            return contextPrefix
        }
        /*_______________CONTEXT_______ */
        if (context.attributeName === 'connectionQualifiedName') {
            contextPrefix += `${assetQuoteType}${
                getDatabaseName(qualifiedName ?? '') ?? ''
            }${assetQuoteType}.${assetQuoteType}${
                getSchemaName(qualifiedName ?? '') ?? ''
            }${assetQuoteType}`
        } else if (context.attributeName === 'databaseQualifiedName') {
            contextPrefix += `${assetQuoteType}${
                getSchemaName(qualifiedName ?? '') ?? ''
            }${assetQuoteType}`
        }
        return contextPrefix
        /* _______________________________ */
    }

    /* NOTE: Don't confuse hide=true means panel hide, it's opposite here, hide=true means it's included. The reaon why 
    it is this way because of two way binidng */

    if (columnPanel?.hide) {
        columnPanel?.subpanels.forEach((subpanel, i) => {
            if (i == 0) {
                let contextPrefix = ''
                contextPrefix = getContext(
                    columnPanel?.subpanels[0]?.tableQualfiedName ?? '',
                    useSchemaExplorerContext
                )

                if (subpanel.tableQualfiedName) {
                    let tableName = getTableNameFromTableQualifiedName(
                        subpanel.tableQualfiedName
                    )
                    if (tableName) {
                        // if context is set
                        if (contextPrefix !== '') {
                            select.from(
                                `${contextPrefix}.${assetQuoteType}${tableName}${assetQuoteType}`
                            )
                        } else {
                            select.from(
                                `${assetQuoteType}${tableName}${assetQuoteType}`
                            )
                        }
                    }
                }

                /* GROUP PANEL */
                let _addAggregatorGroup = false

                if (
                    groupPanel?.subpanels[0]?.columnsData?.length > 0 &&
                    groupPanel?.hide
                ) {
                    groupPanel?.subpanels[0]?.columnsData?.forEach(
                        (columnData) => {
                            let contextPrefix = ''
                            contextPrefix = getContext(
                                columnData.columnsQualifiedName ??
                                    columnData?.qualifiedName ??
                                    columnData?.columnQualifiedName ??
                                    ''
                            )

                            _addAggregatorGroup = true
                            const tableName = getTableNameWithQuotes(
                                columnData.columnsQualifiedName ??
                                    columnData?.qualifiedName ??
                                    columnData?.columnQualifiedName
                            )
                            if (contextPrefix !== '') {
                                select.field(
                                    `${contextPrefix}.${tableName}.${assetQuoteType}${columnData.label}${assetQuoteType}`
                                )
                            } else
                                select.field(
                                    `${tableName}.${assetQuoteType}${columnData.label}${assetQuoteType}`
                                )
                        }
                    )
                }

                /* AGGREGATE PANEL LOOPING for checking if there are aggregators for select field */
                if (
                    aggregatePanel?.subpanels?.length > 0 &&
                    aggregatePanel?.hide
                ) {
                    aggregatePanel?.subpanels?.forEach((subpanel) => {
                        subpanel?.aggregators?.forEach((aggregator) => {
                            _addAggregatorGroup = true
                        })
                    })
                }
                if (!_addAggregatorGroup) {
                    select.field('*')
                }
            }
        })
    }
    /* NOTE: Don't confuse hide=true means panel hide, it's opposite here, hide=true means it's included. The reaon why 
    it is this way because of two way binidng */

    if (aggregatePanel?.hide) {
        let subpanels = suffixDuplicates(aggregatePanel?.subpanels)
        // debugger
        subpanels.forEach((subpanel, i) => {
            subpanel.aggregators.forEach((aggregator: string) => {
                let contextPrefix = ''
                contextPrefix = getContext(
                    subpanel.column?.qualifiedName ??
                        subpanel.column?.columnsQualifiedName ??
                        subpanel.column?.columnQualifiedName ??
                        ''
                )
                const aggregatorUpperCase = aggregator.toUpperCase()
                const tableName = getTableNameWithQuotes(
                    subpanel.column?.qualifiedName ??
                        subpanel.column?.columnsQualifiedName ??
                        subpanel.column?.columnQualifiedName
                )
                const columnName = getColumnName(
                    subpanel.column?.qualifiedName ??
                        subpanel.column?.columnsQualifiedName ??
                        subpanel.column?.columnQualifiedName
                )
                // if there are duplicates then this name will be sufiixed by 1-2-3-4
                const duplicatedColumnName = subpanel.column.label
                // console.log(aggregatorUpperCase, 'fxn')
                if (aggregatorUpperCase === 'UNIQUE') {
                    if (aggregatorUpperCase && tableName && columnName) {
                        if (contextPrefix !== '') {
                            select.field(
                                `COUNT (DISTINCT ${contextPrefix}.${tableName}.${assetQuoteType}${columnName}${assetQuoteType})`,
                                aggregatedAliasMap[aggregatorUpperCase](
                                    duplicatedColumnName
                                )
                            )
                        } else {
                            select.field(
                                `COUNT (DISTINCT ${tableName}.${assetQuoteType}${columnName}${assetQuoteType})`,
                                aggregatedAliasMap[aggregatorUpperCase](
                                    duplicatedColumnName
                                )
                            )
                        }
                    }
                } else {
                    if (aggregatorUpperCase && tableName && columnName) {
                        if (contextPrefix !== '') {
                            select.field(
                                `${aggregatorUpperCase} (${contextPrefix}.${tableName}.${assetQuoteType}${columnName}${assetQuoteType})`,
                                aggregatedAliasMap[aggregatorUpperCase](
                                    duplicatedColumnName
                                )
                            )
                        } else {
                            select.field(
                                `${aggregatorUpperCase} (${tableName}.${assetQuoteType}${columnName}${assetQuoteType})`,
                                aggregatedAliasMap[aggregatorUpperCase](
                                    duplicatedColumnName
                                )
                            )
                        }
                    }
                }
            })
        })
        // console.log(select.toString(), 'select.toString()')
    }

    /* NOTE: Don't confuse hide=true means panel hide, it's opposite here, hide=true means it's included. The reaon why 
    it is this way because of two way binidng */

    if (groupPanel?.hide) {
        groupPanel?.subpanels.forEach((subpanel, i) => {
            subpanel?.columnsData?.forEach((columnData) => {
                const tableName = getTableNameWithQuotes(
                    columnData.qualifiedName ?? ''
                )
                if (tableName && columnData?.label) {
                    let contextPrefix = ''
                    contextPrefix = getContext(columnData.qualifiedName ?? '')
                    if (contextPrefix !== '') {
                        select.group(
                            `${contextPrefix}.${tableName}.${assetQuoteType}${columnData.label}${assetQuoteType}`
                        )
                    } else {
                        select.group(
                            `${tableName}.${assetQuoteType}${columnData.label}${assetQuoteType}`
                        )
                    }
                }
            })
        })
        // console.log(select.toString(), 'select.toString()')
    }

    /* NOTE: Don't confuse hide=true means panel hide, it's opposite here, hide=true means it's included. The reaon why 
    it is this way because of two way binidng */
    if (sortPanel?.hide) {
        sortPanel?.subpanels.forEach((subpanel) => {
            const order = subpanel.order === 'asc'

            if (sortPanel.active === false) {
                let contextPrefix = ''
                contextPrefix = getContext(
                    subpanel.column?.qualifiedName ??
                        subpanel.column?.columnsQualifiedName ??
                        subpanel.column?.columnQualifiedName ??
                        ''
                )
                if (subpanel?.column?.label) {
                    const tableName = getTableNameWithQuotes(
                        subpanel.column?.qualifiedName ??
                            subpanel.column?.columnsQualifiedName ??
                            subpanel.column?.columnQualifiedName
                    )

                    if (tableName && subpanel.column?.label) {
                        if (contextPrefix !== '') {
                            select.order(
                                `${contextPrefix}.${tableName}.${assetQuoteType}${subpanel.column.label}${assetQuoteType}`,
                                order
                            )
                        } else {
                            select.order(
                                `${tableName}.${assetQuoteType}${subpanel.column.label}${assetQuoteType}`,
                                order
                            )
                        }
                    }
                }
            } else {
                let contextPrefix = ''
                contextPrefix = getContext(
                    subpanel.aggregateORGroupColumn?.qualifiedName ?? ''
                )
                const tableName = getTableNameWithQuotes(
                    subpanel.aggregateORGroupColumn?.qualifiedName ?? ''
                )
                if (subpanel.aggregateORGroupColumn?.label) {
                    if (contextPrefix !== '') {
                        if (
                            subpanel.aggregateORGroupColumn.addedBy !== 'group'
                        ) {
                            select.order(
                                `${assetQuoteType}${subpanel.aggregateORGroupColumn?.label}${assetQuoteType}`,
                                order
                            )
                        } else {
                            select.order(
                                `${contextPrefix}.${tableName}.${assetQuoteType}${subpanel.aggregateORGroupColumn.label}${assetQuoteType}`,
                                order
                            )
                        }
                    } else {
                        if (
                            subpanel.aggregateORGroupColumn.addedBy !== 'group'
                        ) {
                            select.order(
                                `${assetQuoteType}${subpanel.aggregateORGroupColumn?.label}${assetQuoteType}`,
                                order
                            )
                        } else {
                            select.order(
                                `${tableName}.${assetQuoteType}${subpanel.aggregateORGroupColumn.label}${assetQuoteType}`,
                                order
                            )
                        }
                    }
                }
            }
        })
        // console.log(select.toString(), 'select.toString()')
    }
    /* NOTE: Don't confuse hide=true means panel hide, it's opposite here, hide=true means it's included. The reaon why 
    it is this way because of two way binidng */
    if (filter?.hide) {
        let res = ''
        filter?.subpanels.forEach((subpanel, index) => {
            if (subpanel?.column?.label && nameMap[subpanel?.filter?.name]) {
                if (
                    !['IS NOT NULL', 'IS NULL'].includes(
                        nameMap[subpanel?.filter?.name]
                    ) &&
                    subpanel.filter?.value == undefined
                )
                    return
                // for value based filters
                if (
                    index > 0 &&
                    Object.keys(filter?.subpanels[index - 1]?.column ?? {})
                        .length > 0 &&
                    filter?.subpanels[index - 1]?.filter?.value &&
                    filter?.subpanels[index - 1]?.filter?.type !== 'none'
                )
                    res += ` ${subpanel?.filter?.filterType?.toUpperCase()} `

                // for non value based filters
                if (
                    index > 0 &&
                    Object.keys(filter?.subpanels[index - 1]?.column ?? {})
                        .length > 0 &&
                    filter?.subpanels[index - 1]?.filter?.type === 'none'
                )
                    res += ` ${subpanel?.filter?.filterType?.toUpperCase()} `

                const tableName = getTableNameWithQuotes(
                    subpanel.column.columnQualifiedName ??
                        subpanel.column?.qualifiedName ??
                        subpanel.column?.columnQualifiedName
                )
                let contextPrefix = ''
                contextPrefix = getContext(
                    subpanel.column?.qualifiedName ??
                        subpanel.column?.columnsQualifiedName ??
                        subpanel.column?.columnQualifiedName ??
                        ''
                )

                switch (subpanel?.filter?.type) {
                    case 'range_input': {
                        if (index == 0) res = ''
                        if (
                            tableName &&
                            subpanel?.column?.label &&
                            nameMap[subpanel?.filter?.name] &&
                            subpanel?.filter?.value?.length > 0 &&
                            isValidValueArray(subpanel?.filter?.value)
                        ) {
                            if (contextPrefix !== '') {
                                res += `${contextPrefix}.${tableName}.${assetQuoteType}${subpanel?.column?.label}${assetQuoteType}`
                            } else {
                                res += `${tableName}.${assetQuoteType}${subpanel?.column?.label}${assetQuoteType}`
                            }
                            res += ` ${nameMap[subpanel?.filter?.name]} `

                            if (subpanel?.filter?.name === 'between') {
                                const firstVal = getValueStringFromType(
                                    subpanel,
                                    subpanel?.filter?.value[0] ?? ''
                                )
                                const secondVal = getValueStringFromType(
                                    subpanel,
                                    subpanel?.filter?.value[1] ?? ''
                                )
                                res += `${firstVal} AND ${secondVal}`
                            }
                        }

                        break
                    }
                    case 'input': {
                        if (index == 0) res = ''
                        if (
                            tableName &&
                            subpanel?.column?.label &&
                            nameMap[subpanel?.filter?.name]
                        ) {
                            if (contextPrefix !== '') {
                                res += `${contextPrefix}.${tableName}.${assetQuoteType}${subpanel?.column?.label}${assetQuoteType}`
                            } else {
                                res += `${tableName}.${assetQuoteType}${subpanel?.column?.label}${assetQuoteType}`
                            }
                            res += ` ${nameMap[subpanel?.filter?.name]} `
                            res += `${getValueStringFromType(
                                subpanel,
                                subpanel?.filter?.value ?? ''
                            )}`
                        }

                        break
                    }
                    case 'multi_input': {
                        if (index == 0) res = ''
                        if (
                            tableName &&
                            subpanel?.column?.label &&
                            nameMap[subpanel?.filter?.name] &&
                            subpanel?.filter?.value?.length > 0 &&
                            isValidValueArray(subpanel?.filter?.value)
                        ) {
                            if (contextPrefix !== '') {
                                res += `${contextPrefix}.${tableName}.${assetQuoteType}${subpanel?.column?.label}${assetQuoteType}`
                            } else {
                                res += `${tableName}.${assetQuoteType}${subpanel?.column?.label}${assetQuoteType}`
                            }
                            res += ` ${nameMap[subpanel?.filter?.name]} `

                            res += ` ( `
                            subpanel?.filter?.value?.forEach((el, i) => {
                                if (i !== subpanel?.filter?.value?.length - 1)
                                    res += `'${el}',`
                                else res += `'${el}'`
                            })
                            res += ` )`
                        }

                        break
                    }
                    case 'none': {
                        if (index == 0) res = ''
                        if (
                            tableName &&
                            subpanel?.column?.label &&
                            nameMap[subpanel?.filter?.name]
                        ) {
                            if (contextPrefix !== '') {
                                res += `${contextPrefix}.${tableName}.${assetQuoteType}${subpanel?.column?.label}${assetQuoteType}`
                            } else {
                                res += `${tableName}.${assetQuoteType}${subpanel?.column?.label}${assetQuoteType}`
                            }
                            res += ` ${nameMap[subpanel?.filter?.name]} `
                        }

                        break
                    }
                }
            }
        })
        select.where(res)
    }

    if (join?.hide) {
        console.log('join: ', join)

        join?.subpanels.forEach((subpanel, i) => {
            // leftColumnName = "TABLENAME"."COLUMNNAME"

            let leftColumnName = getJoinFormattedColumnName(
                subpanel.columnsDataLeft?.columnQualifiedName ?? ''
            )
            let rightColumnName = getJoinFormattedColumnName(
                subpanel.columnsDataRight?.columnQualifiedName ?? ''
            )
            if (leftColumnName === undefined) return
            if (rightColumnName === undefined) return

            // leftTableName = "TABLENAME"
            let rightTableName = getTableNameWithQuotes(
                subpanel.columnsDataRight?.columnQualifiedName ?? ''
            )

            let leftColumnContextPrefix = ''
            leftColumnContextPrefix = getContext(
                subpanel.columnsDataLeft?.columnQualifiedName ?? ''
            )
            if (leftColumnContextPrefix !== '') {
                leftColumnName = `${leftColumnContextPrefix}.${leftColumnName}`
            }

            let rightColumnContextPrefix = ''
            rightColumnContextPrefix = getContext(
                subpanel.columnsDataRight?.columnQualifiedName ?? ''
            )
            if (rightColumnContextPrefix !== '') {
                rightColumnName = `${rightColumnContextPrefix}.${rightColumnName}`
            }

            let rightTableContextPrefix = ''
            rightTableContextPrefix = getContext(
                subpanel.columnsDataRight?.columnQualifiedName ?? ''
            )
            if (rightColumnContextPrefix !== '') {
                rightTableName = `${rightTableContextPrefix}.${rightTableName}`
            }

            if (leftColumnName && rightTableName && rightColumnName) {
                switch (subpanel.joinType.type) {
                    case 'inner_join': {
                        select.join(
                            rightTableName,
                            null,
                            `${leftColumnName} = ${rightColumnName}`
                        )
                        break
                    }
                    case 'outer_join': {
                        select.outer_join(
                            rightTableName,
                            null,
                            `${leftColumnName} = ${rightColumnName}`
                        )
                        break
                    }
                    case 'left_join': {
                        select.left_join(
                            rightTableName,
                            null,
                            `${leftColumnName} = ${rightColumnName}`
                        )
                        break
                    }
                    case 'right_join': {
                        select.right_join(
                            rightTableName,
                            null,
                            `${leftColumnName} = ${rightColumnName}`
                        )
                        break
                    }
                    default: {
                        select.join(
                            rightTableName,
                            null,
                            `${leftColumnName} = ${rightColumnName}`
                        )
                    }
                }
            }
        })
    }

    let res = select.toString()
    // keyword subsitution
    res = res.replaceAll('OUTER JOIN', 'FULL OUTER JOIN')
    if (limitRows?.checked) {
        return `${res} LIMIT ${limitRows.rowsCount}`
    }
    console.log(res, 'res')

    return res
}

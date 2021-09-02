import {
    AdvancedAttributeList,
    OperatorList,
} from '~/constant/advancedAttributes'
import { List as AssetCategoryList } from '~/constant/assetCategory'

export interface criterion {
    attributeName: string
    attributeValue?: string | undefined
    operator?: string | undefined
}

export function getEncodedStringFromOptions(options: any) {
    const routerQuery: {
        searchText: string
        limit: string
        filters: string
        connectorsPayload: string
    } = {}

    if (options.searchText) {
        routerQuery.searchText = options.searchText
    }

    if (options.filters) {
        const filterKeys = Object.keys(options.filters)
        console.log(filterKeys, 'filterkey', options.filters)
        const filtersString: Array<string> = []
        filterKeys.forEach((filterKey) => {
            let filterKeyValue = options.filters[filterKey]
            switch (filterKey) {
                case 'connector': {
                    let connectorPyloadStirng = ''
                    let criterion = options.filters[filterKey].criterion
                    if (criterion.length == 1) {
                        connectorPyloadStirng += `connector:${criterion[0].attributeValue}`
                    }
                    if (criterion.length == 2) {
                        connectorPyloadStirng += `connector:${criterion[0].attributeValue}`
                        connectorPyloadStirng += `,connection:${criterion[1].attributeValue}`
                    }

                    filterKeyValue = connectorPyloadStirng
                    break
                }
                case 'assetCategory': {
                    filterKeyValue =
                        options.filters[filterKey]?.selectedIds ?? []
                    filterKeyValue = filterKeyValue
                        .map((selectedId: criterion) => selectedId)
                        .join(',')
                    break
                }
                case 'classifications': {
                    filterKeyValue = options.filters[filterKey].criterion
                    const tempNames: Array<string | undefined> = []
                    filterKeyValue.forEach((e: criterion) => {
                        if (e.attributeName === '__classificationNames') {
                            tempNames.push(e.attributeValue)
                        }
                    })
                    filterKeyValue = tempNames.join(',')
                    break
                }
                case 'status': {
                    filterKeyValue = options.filters[filterKey].criterion
                    filterKeyValue = filterKeyValue
                        .map((e: criterion) => e.attributeValue)
                        .join(',')
                    break
                }
                case 'owners': {
                    filterKeyValue = options.filters[filterKey].criterion
                    let ownerString = ''
                    const uniqueOwnerAttributes = new Set(
                        filterKeyValue.map((e: criterion) => e.attributeName)
                    )
                    ;[...uniqueOwnerAttributes].map((uniqueOwnerAttribute) => {
                        ownerString += `${uniqueOwnerAttribute}:`
                        filterKeyValue.forEach((e: criterion) => {
                            if (e.attributeName === uniqueOwnerAttribute) {
                                ownerString += `${e.attributeValue},`
                            }
                        })
                        ownerString = ownerString.slice(0, -1)
                        ownerString += '&'
                    })
                    ownerString = ownerString.slice(0, -1)
                    filterKeyValue = ownerString
                    break
                }
                case 'advanced': {
                    filterKeyValue = options.filters[filterKey].criterion
                    filterKeyValue = filterKeyValue
                        .map(
                            (e: criterion) =>
                                (e.attributeName ? `${e.attributeName}:` : '') +
                                (e.attributeValue
                                    ? `${e.attributeValue}:`
                                    : '') +
                                (e.operator ? `${e.operator}:` : '')
                        )
                        .join(',')
                    filterKeyValue = filterKeyValue.slice(0, -1)
                    break
                }
                default: {
                    filterKeyValue = options.filters[filterKey].criterion
                    filterKeyValue = filterKeyValue
                        .map(
                            (e: criterion) =>
                                (e.attributeName
                                    ? `${e.attributeName.split('.')[1]}:`
                                    : '') +
                                (e.attributeValue
                                    ? `${e.attributeValue}:`
                                    : '-:') +
                                (e.operator ? `${e.operator}:` : '')
                        )
                        .join(',')
                    filterKeyValue = filterKeyValue.slice(0, -1)
                    break
                }
            }
            // TODO include business met data and other filters
            if (options.filters[filterKey].criterion.length > 0) {
                const temp = `${filterKey}::${filterKeyValue}`
                if (temp) {
                    filtersString.push(temp)
                }
            }
        })
        if (filtersString.length) {
            routerQuery.filters = filtersString.join(':::')
        }
    }
    // if (options.connectorsPayload) {
    //     const payload = options.connectorsPayload
    //     let connectorPyloadStirng = ''
    //     if (payload.connector) {
    //         connectorPyloadStirng += `connector:${payload.connector}`
    //     }
    //     if (payload.connection) {
    //         connectorPyloadStirng += `,connection:${payload.connection}`
    //     }
    //     routerQuery.connectorsPayload = connectorPyloadStirng
    // }

    // if (options.sortBy) {
    //   routerQuery.sortBy = options.sortBy;
    // }

    // if (options.sortOrder) {
    //   routerQuery.sortOrder = options.sortOrder;
    // }

    if (options.limit) {
        routerQuery.limit = options.limit
    }
    console.log('setRouterQuery -> routerQuery', routerQuery)

    const queryKeys = Object.keys(routerQuery)
    let str = ''
    queryKeys.forEach((queryKey) => {
        str += `&${queryKey}=${routerQuery[queryKey]}`
    })
    str = str.substring(1)
    const encodedStr = encodeStringToBase64(str)
    return encodedStr
}
export function getDecodedOptionsFromString(router) {
    let encodedQueryString = router.currentRoute.value?.query || ''
    try {
        // due to query object
        encodedQueryString = Object.keys(encodedQueryString)[0] ?? ''
    } catch (err) {
        encodedQueryString = ''
    }
    console.log(encodedQueryString, 'errorrrrrr')
    const decodedQueryString = decodeBase64ToString(encodedQueryString)
    const url = new URL(`https://x?${decodedQueryString}`)
    console.log(url.searchParams.get('filters'))
    const filters = url.searchParams.get('filters')
    const searchText = url.searchParams.get('searchText')
    const connectorsPayloadString = url.searchParams.get('connectorsPayload')
    let connectorsPayload = {}
    const limit = url.searchParams.get('limit')
    const facetsFiltersStrings = filters?.split(':::')
    const initialBodyCriterion: Array<any> = []
    const facetsFilters: filterMapType = {
        connector: {
            checked: [],
            condition: 'AND',
            criterion: [],
        },
        assetCategory: {
            checked: [],
            condition: 'OR',
            criterion: [],
        },
        status: {
            checked: [],
            condition: 'OR',
            criterion: [],
        },
        classifications: {
            checked: [],
            condition: 'OR',
            criterion: [],
        },
        owners: {
            userValue: [],
            groupValue: [],
            condition: 'OR',
            criterion: [],
        },
        advanced: {
            list: [],
            condition: 'OR',
            criterion: [],
        },
    }

    facetsFiltersStrings?.forEach((facetFilterString: string) => {
        const facetFilter = facetFilterString.split('::')
        const facetFilterName = facetFilter[0] // name
        const facetFilterValuesString = facetFilter[1] // verified,draft
        let criterion: Array<criterion> = []

        switch (facetFilterName) {
            case 'connector': {
                const facetFilterValues = facetFilterValuesString.split(',')
                console.log(facetFilterValues, 'facetFilterValues', facetFilter)
                const connectorsPayloadCriterion: criterion = []
                const conenctorData = {}
                facetFilterValues.forEach((connectorValue) => {
                    const subConnectorValues = connectorValue.split(':')
                    console.log(subConnectorValues, 'subconector')
                    if (subConnectorValues[0] === 'connector') {
                        conenctorData.connector = subConnectorValues[1]
                    } else {
                        conenctorData.connection = subConnectorValues[1]
                    }
                })
                connectorsPayload = conenctorData

                connectorsPayloadCriterion.push({
                    attributeName: 'integrationName',
                    attributeValue: connectorsPayload.connector,
                    operator: '=',
                })
                if (facetFilterValues.length > 1) {
                    connectorsPayloadCriterion.push({
                        attributeName: 'connectionQualifiedName',
                        attributeValue: connectorsPayload.connection,
                        operator: '=',
                    })
                }

                facetsFilters.connector.criterion = connectorsPayloadCriterion
                facetsFilters.connector.checked = conenctorData
                criterion = [...connectorsPayloadCriterion, ...criterion]
                break
            }
            case 'assetCategory': {
                const facetFilterValues = facetFilterValuesString.split(',')
                const selectedIds: string[] = []
                facetFilterValues.forEach((facetFilterValue) => {
                    selectedIds.push(facetFilterValue)
                    const includedAssetTypes = AssetCategoryList.find(
                        (asset) => asset.id === facetFilterValue
                    ).include
                    includedAssetTypes.forEach((assetType) => {
                        criterion.push({
                            attributeName: '__typeName',
                            attributeValue: assetType,
                            operator: 'eq',
                        })
                    })
                })
                facetsFilters.assetCategory.criterion = criterion
                facetsFilters.assetCategory.checked = facetFilterValues
                facetsFilters.assetCategory.selectedIds = selectedIds
                break
            }
            case 'status': {
                const facetFilterValues = facetFilterValuesString.split(',')
                facetFilterValues.forEach((facetFilterValue) => {
                    criterion.push({
                        attributeName: 'assetStatus',
                        attributeValue: facetFilterValue,
                        operator: 'eq',
                    })
                })
                facetsFilters.status.criterion = criterion
                facetsFilters.status.checked = facetFilterValues
                break
            }
            case 'classifications': {
                const facetFilterValues = facetFilterValuesString.split(',')
                console.log(facetFilterValues, 'classifications')
                facetFilterValues.forEach((facetFilterValue) => {
                    criterion.push({
                        attributeName: '__classificationNames',
                        attributeValue: facetFilterValue,
                        operator: 'eq',
                    })
                    criterion.push({
                        attributeName: '__propagatedClassificationNames',
                        attributeValue: facetFilterValue,
                        operator: 'eq',
                    })
                })
                facetsFilters.classifications.criterion = criterion
                facetsFilters.classifications.checked = facetFilterValues
                break
            }
            case 'owners': {
                const usersAndGroupsString: string[] =
                    facetFilterValuesString.split('&') // ownerUsers:ab,cd&ownerGroups:ab,cd
                usersAndGroupsString.forEach((item) => {
                    const subFacetFilterValues = item.split(':')
                    if (subFacetFilterValues[0] === 'ownerUsers') {
                        const usersArray: string[] =
                            subFacetFilterValues[1].split(',')
                        usersArray.forEach((user) => {
                            criterion.push({
                                attributeName: 'ownerUsers',
                                attributeValue: user,
                                operator: 'contains',
                            })
                        })

                        facetsFilters.owners.userValue = usersArray
                    } else {
                        const groupsArray: string[] =
                            subFacetFilterValues[1].split(',')
                        groupsArray.forEach((group) => {
                            criterion.push({
                                attributeName: 'ownerGroups',
                                attributeValue: group,
                                operator: 'contains',
                            })
                        })
                        facetsFilters.owners.groupValue = groupsArray
                    }
                })
                facetsFilters.owners.criterion = criterion
                break
            }
            case 'advanced': {
                const facetFilterValues = facetFilterValuesString.split(',')
                const options: Array<any> = []
                AdvancedAttributeList.forEach((item) => {
                    const temp = item
                    temp.children = OperatorList.filter((op) =>
                        op.allowedType.includes(item.type)
                    )
                    options.push(temp)
                })
                try {
                    let tmp: {
                        isInput: boolean | undefined
                        operand: string
                        type: string
                        operator: Array<string>
                    }
                    facetFilterValues.forEach((facetFilterValue) => {
                        tmp = {
                            isInput: false,
                            operand: '',
                            type: '',
                            operator: [],
                        }
                        const subFacetFilterValues = facetFilterValue.split(':')
                        let attributeName: string
                        let attributeValue: any
                        let operator: any
                        attributeName = subFacetFilterValues[0]
                        if (subFacetFilterValues.length > 0)
                            attributeValue = subFacetFilterValues[1]
                        if (subFacetFilterValues.length > 1)
                            operator = subFacetFilterValues[2]

                        const found = options.find(
                            (op) => op.value === attributeName
                        )
                        tmp.type = found?.type
                        const foundOperator = OperatorList.find(
                            (op) => op.value === operator
                        )
                        tmp.isInput = foundOperator?.isInput
                        tmp.operand = attributeValue
                        const operatorArray = []
                        operatorArray.push(attributeName)
                        if (operator) operatorArray.push(operator)
                        tmp.operator = operatorArray

                        criterion.push({
                            attributeName,
                            attributeValue,
                            operator,
                        })
                    })
                    facetsFilters.advanced.criterion = criterion
                    facetsFilters.advanced.list.push(tmp)
                } catch (err) {
                    console.log(err)
                }
                break
            }
            default: {
                const allFilters = facetFilterValuesString.split(',')
                const applied = {}
                const criterion = []
                allFilters.forEach((att) => {
                    const [a, v, o] = att.split(':')
                    applied[a] = {
                        ...(applied[a] || {}),
                        [o]: v,
                    }
                    criterion.push({
                        attributeName: `${facetFilterName}.${a}`,
                        attributeValue:
                            v === '-' && ['isNull', 'notNull'].includes(o)
                                ? ''
                                : v,
                        operator: o,
                    })
                })

                facetsFilters[facetFilterName] = {
                    applied,
                    criterion,
                }
            }
        }

        // if (connectorsPayload) {
        //     // const connectorsPayloadCriterion: criterion = [];
        //     const connectorValues = connectorsPayloadString.split(',')
        //     const conenctorData = {}
        //     connectorValues.forEach((connectorValue) => {
        //         const subConnectorValues = connectorValue.split(':')
        //         console.log(subConnectorValues, 'subconector')
        //         if (subConnectorValues[0] === 'connector') {
        //             conenctorData.connector = subConnectorValues[1]
        //         } else {
        //             conenctorData.connection = subConnectorValues[1]
        //         }
        //     })
        //     connectorsPayload = conenctorData

        //     // connectorsPayloadCriterion.push({
        //     //   attributeName: "integrationName",
        //     //   attributeValue: connectorsPayload.connections,
        //     //   operator: "=",
        //     // });
        //     // connectorsPayloadCriterion.push({
        //     //   attributeName: "connectionQualifiedName",
        //     //   attributeValue: connectorsPayload.connections,
        //     //   operator: "=",
        //     // });
        //     // criterion = [...criterion, connectorsPayloadCriterion];
        // }
        switch (facetFilterName) {
            case 'connector': {
                initialBodyCriterion.push({
                    condition: 'AND',
                    criterion,
                })
                break
            }
            default: {
                initialBodyCriterion.push({
                    condition: 'OR',
                    criterion,
                })
            }
        }
    })
    console.log(initialBodyCriterion, facetsFilters, 'facetsFilters')
    return {
        connectorsPayload,
        initialBodyCriterion,
        facetsFilters,
        searchText,
        limit,
    }
}

export function encodeStringToBase64(str: string) {
    return btoa(str)
}
export function decodeBase64ToString(str: string) {
    return atob(str)
}

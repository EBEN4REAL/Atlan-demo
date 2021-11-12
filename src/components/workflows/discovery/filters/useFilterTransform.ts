export const transformFacets = (facetsFilters) => {
    const output = []
    const { owners, workflowType } = facetsFilters
    // further filters would be transformed, labelled and pushed in here
    if (owners?.userValue?.length > 0) {
        const temp = owners.userValue.map((x) => ({
            labels: { $elemMatch: { 'workflows.argoproj.io/creator': x } },
        }))
        output.push(...temp)
    }
    if (workflowType?.checked?.length > 0) {
        const temp = workflowType.checked.map((x) => ({
            labels: { $elemMatch: { 'com.atlan.orchestration/source': x } },
        }))
        output.push(...temp)
    }
    return output
}

export const transformToFilters = (AllFilters, searchKey?: string) => {
    // console.log('facetsFilters: ', AllFilters.facetsFilters)
    const output = {}
    const { facetsFilters, searchText, sortOrder } = AllFilters
    const transformedFilters = transformFacets(facetsFilters)
    if (searchText) {
        if (searchKey) output[searchKey as string] = { $ilike: `%${searchText}%` }
        else output.name = { $ilike: `%${searchText}%` }
    }
    if (transformedFilters.length > 0) output.$or = transformedFilters
    return { filter: output, sort: sortOrder }
}

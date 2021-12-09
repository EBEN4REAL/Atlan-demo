export const transformFacets = (facetsFilters) => {
    const output = []
    const { owners, workflowType } = facetsFilters
    // further filters would be transformed, labelled and pushed in here
    if (owners?.userValue?.length > 0) {
        const temp = owners.userValue.map((x) => (
            {
                metadata: { $elemMatch: { labels: { 'workflows.argoproj.io/creator': x } } },
            }
        ))
        output.push(...temp)
    }
    if (workflowType?.checked?.length > 0) {
        const temp = workflowType.checked.map((x) => (
            {
                metadata: { $elemMatch: { labels: { 'com.atlan.orchestration/source': x } } },
            }
        ))
        output.push(...temp)
    }
    return output
}

export const transformToFilters = (AllFilters, searchKey?: string) => {
    /**
    let output: object = {}
    const { facetsFilters, searchText, sortOrder } = AllFilters
    const transformedFilters = transformFacets(facetsFilters)
    if (searchText) {
        if (searchKey) {
            output = { data: { $elemMatch: {} } }
            output.data.$elemMatch[searchKey] = { $ilike: `%${searchText}%` }
        }
        else {
            output = { metadata: { $elemMatch: {} } }
            output.metadata.$elemMatch.name = { $ilike: `%${searchText}%` }
        }
    }
     */

    const output = {}
    const { facetsFilters, searchText, sortOrder } = AllFilters
    const transformedFilters = transformFacets(facetsFilters)
    if (searchText) {
        // FIXME with BE resolved
        if (searchKey) output[searchKey as string] = { $ilike: `%${searchText}%` }
        else output.name = { $ilike: `%${searchText}%` }
    }
    if (transformedFilters.length > 0) output.$or = transformedFilters
    return { filter: output, sort: sortOrder }
}

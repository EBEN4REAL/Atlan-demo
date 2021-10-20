export const transformFacets = (facetsFilters) => {
  const output = []
  const { owners } = facetsFilters
  // further filters would be transformed, labelled and pushed in here
  if (owners?.userValue?.length > 0) {
    const temp = owners.userValue.map(x => ({ labels: { $elemMatch: { "workflows.argoproj.io/creator": x } } }))
    output.push(...temp)
  }
  return output
}

// transform Allfilters 
export const transformToFilters = (AllFilters) => {
  // console.log('facetsFilters: ', AllFilters.facetsFilters)
  const { facetsFilters, searchText, sortOrder } = AllFilters
  const output = {}
  if (searchText) output.name = { $ilike: `%${searchText}%` }
  if (Object.keys(facetsFilters).length !== 0) output.$or = transformFacets(facetsFilters)
  return { filter: output, sort: sortOrder }
}
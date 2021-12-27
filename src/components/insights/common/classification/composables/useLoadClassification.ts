import { Ref, ref } from 'vue'

import { useAPIPromise } from '~/services/api/useAPIPromise'
import {map} from '~/services/meta/search/key'

import {
    InternalAttributes,
    BasicSearchAttributes,
    SavedQueryAttributes,
} from '~/constant/projection'

interface useLoadClassificationProps {
    connector: Ref<string | undefined>,
}

const useLoadClassification = ({
    connector,
}: useLoadClassificationProps) => {

    const attributes = [
        'name',
        'displayName',
        'typeName',
        'dataType',
        'description',
        'userDescription',
        'certificateStatus',
        'ownerUsers',
        'adminUsers',
        'adminGroups',
        'ownerGroups',
        'classifications',

        'connectorName',
        'connectionId',
        'connectionQualifiedName',
        'parentQualifiedName',
        'defaultSchemaQualifiedName',
        'defaultDatabaseQualifiedName',
        'parentFolder',
        'columns', //TODO: queries
        'folder',
        'compiledQuery',
        'rawQuery',
        ...InternalAttributes,
        ...BasicSearchAttributes,
        ...SavedQueryAttributes,
    ]
    const body = ref()

    const refreshBody = () => {
        body.value = {
            dsl: {
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    "__state": "ACTIVE"
                                }
                            }
                        ]
                    }
                },
                aggs: {
                    group_by_direct_classifications: {
                        terms: {
                            field: "__traitNames",
                            size: 50
                        }
                    },
                    group_by_propagated_classifications: {
                        terms: {
                            field: "__propagatedTraitNames",
                            size: 50
                        }
                    }
                }
            },
            attributes
        }

        if (connector.value) {

            body.value.dsl.query.bool.must.push(
                {
                    term: {
                        "connectionName": `${connector.value}`
                    }
                }
            )
        }
    }

    refreshBody()

    const getAssetCountOnClassification = (type) => {
        refreshBody()
        body.value.dsl.query.bool.must.push(
            {
                term: {
                    "__typeName.keyword": type
                }
            }
        )
        return useAPIPromise(map.INDEX_SEARCH(), 'POST', {
            body
        })
    }


    return {
        getAssetCountOnClassification
    }
}

export default useLoadClassification

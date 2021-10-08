import { Ref } from 'vue'
import { useAPI } from '~/api/useAPI'
import { classificationInterface } from '~/types/classifications/classification.interface'

const getClassificationList = <T>({ cache }: { cache: boolean }) =>
    useAPI<T>('GET_CLASSIFICATION_LIST', 'GET', {
        cache,
    })

const createClassification = <T>({
    cache,
    payload,
}: {
    cache: boolean
    payload: {
        classificationDefs: classificationInterface[]
    }
}) =>
    useAPI<T>('CREATE_CLASSIFICATION', 'POST', {
        cache,
        body: payload,
    })
const updateClassification = <T>({
    cache,
    params,
}: {
    cache: boolean
    params: any
}) => {
    const payload = {
        classificationDefs: [{ ...params }],
    }
    return useAPI<T>('UPDATE_CLASSIFICATION', 'PUT', {
        cache,
        body: payload,
    })
}

const archiveClassification = <T>({
    cache,
    typeName,
    entityGuid,
}: {
    cache: string | undefined
    typeName: string
    entityGuid: string
}) =>
    useAPI<T>('ARCHIVE_CLASSIFICATION', 'DELETE', {
        cache,
        pathVariables: { typeName, entityGuid },
    })

const linkClassification = <T>({
    cache,
    entityGuid,
    payload,
}: {
    cache: string | undefined
    entityGuid: string
    payload: Ref<{
        attributes: Object
        propagate: boolean
        removePropagationsOnEntityDelete: boolean
        typeName: string
        validityPeriods: Array<any>
    }>
}) =>
    useAPI<T>('LINK_CLASSIFICATION', 'POST', {
        cache,
        body: payload,
        pathVariables: { entityGuid },
    })
export const Classification = {
    linkClassification,
    getClassificationList,
    createClassification,
    updateClassification,
    archiveClassification,
}

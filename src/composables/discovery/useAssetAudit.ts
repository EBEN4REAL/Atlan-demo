import { reactive, watch, ref } from 'vue'
import { toRefs } from '@vueuse/core'
import { useAPI } from '~/services/api/useAPI'
import { Components } from '~/api/atlas/client'
// import { GET_ASSET_AUDIT } from '~/api/keyMaps/asset/index'
import { map } from '~/services/meta/lineage/key'


const useAssetAudit = (params: any, guid: string) => {
    const response = reactive({
        audits: [] as any,
        error: null as any,
        isLoading: ref(false),
        isFetchingMore: ref(false),
        isAllLogsFetched: true,
    })

    const fetchAudits = (p: any, g: string) => {
        const { data, error, isLoading } = useAPI<
            Components.Schemas.EntityAuditEventV2[]
        >(map.GET_ASSET_AUDIT, 'GET', {
            params: p,
            pathVariables: { guid: g },

        }, {})
        response.audits = data
        response.error = error
        response.isLoading = isLoading
        // @ts-ignore
        response.isAllLogsFetched = data?.value?.length < params.count
    }

    const fetchMoreAudits = (fetchmoreParams: any) => {
        const { data, isLoading, error } = useAPI<
            Components.Schemas.EntityAuditEventV2[]
        >(map.GET_ASSET_AUDIT, 'GET', {
            params: fetchmoreParams,
            pathVariables: { guid },
        }, {})

        response.isFetchingMore = isLoading

        watch(data, () => {
            if (data.value?.length && !error.value) {
                response.audits = ref([...response.audits, ...data.value])
                response.isAllLogsFetched =
                    data?.value?.length < fetchmoreParams.count
            }
        })
    }
    const eventMap: any = [
        {
            id: 'ENTITY_CREATE',
            color: 'success',
            label: 'Asset created',
        },
        {
            id: 'ENTITY_UPDATE',
            color: 'blueGray',
            label: 'Asset updated',
        },
        {
            id: 'ENTITY_DELETE',
            color: 'warning',
            label: 'Asset deleted',
        },
        {
            id: 'TERM_ADD',
            color: 'success',
            label: 'Term linked',
        },
        {
            id: 'TERM_DELETE',
            color: 'warning',
            label: 'Term unlinked',
        },
        {
            id: 'CLASSIFICATION_UPDATE',
            color: 'blueGray',
            label: 'Classification updated',
        },
        {
            id: 'CLASSIFICATION_DELETE',
            color: 'warning',
            label: 'Classification unlinked',
        },
        {
            id: 'CLASSIFICATION_ADD',
            color: 'success',
            label: 'Classification linked',
        },
        {
            id: 'PROPAGATED_CLASSIFICATION_UPDATE',
            color: 'blueGray',
            label: 'Propagated Classification updated',
        },
        {
            id: 'PROPAGATED_CLASSIFICATION_DELETE',
            color: 'warning',
            label: 'Propagated Classification unlinked',
        },
        {
            id: 'PROPAGATED_CLASSIFICATION_ADD',
            color: 'success',
            label: 'Propagated Classification linked',
        },
        {
            id: 'BUSINESS_ATTRIBUTE_UPDATE',
            color: 'blueGray',
            label: 'Business metadata updated',
        },
    ]

    const getEventByAction = (asset: any) =>
        eventMap.find((event: any) => event.id === asset.action)

    const filterClassificationTypeNameDisplayName = (parsedDetails: any) =>
        // eslint-disable-next-line no-nested-ternary
        typeof parsedDetails === 'object'
            ? parsedDetails?.typeName ?? ''
            : typeof parsedDetails === 'string'
                ? parsedDetails
                : ''

    const filterTermTypeNameDisplayName = (parsedDetails: any) =>
        parsedDetails?.name ?? ''

    const getEntityUpdateLogs = (logs: any) => {
        const data = {
            displayValue: 'Asset was updated',
            value: [],
        }
        if ('attributes' in logs) {
            const { attributes } = logs
            const owners = 'ownerUsers' in attributes || 'ownerGroups' in attributes
            const experts = 'expertUsers' in attributes
            const status = 'certificateUpdatedAt' in attributes
            const userDescription =
                'userDescription' in attributes ||
                'shortDescription' in attributes

            if (owners) {
                let users = [];
                let groups = [];

                if (attributes.ownerUsers) {
                    users = attributes.ownerUsers.split(',')
                    users = users.map(user => ({ name: user, type: "user" }));
                }
                if (attributes.ownerGroups) {
                    groups = attributes.ownerGroups.split(',')
                    groups = groups.map(group => ({ name: group, type: "group" }));
                }
                if (attributes.ownerUsers === '' && attributes.ownerGroups === '') {
                    data.displayValue = 'owners'
                    return data
                }

                data.displayValue = 'owners'
                data.value = [...users, ...groups]
                return data
            }
            if (experts) {
                const users = attributes.expertUsers.split(',')
                if (attributes.expertUsers === '') {
                    data.displayValue = 'Removed all experts'
                    return data
                }
                data.displayValue = 'experts'
                data.value = users
                return data
            }

            if (status) {
                data.value = attributes
                data.displayValue = 'status'

                return data
            }

            if (userDescription) {
                const value =
                    attributes.userDescription || attributes.shortDescription
                data.value = value

                data.displayValue = 'description'

                return data
            }
        }
        return data
    }

    const getDetailsForEntityAuditEvent = (auditEvent: any) => {
        if (auditEvent.details) {
            const eventDetail = auditEvent.details.split(/:(.+)/)
            let parsedDetails: any = {}
            const data = {
                displayValue: '',
                value: [],
            }

            if (eventDetail && eventDetail.length > 2) {
                switch (auditEvent.action) {
                    case 'LABEL_ADD':
                        data.displayValue = `Label <b>${eventDetail[1].trim()}</b> added`
                        return data
                    case 'LABEL_DELETE':
                        data.displayValue = `Label <b>${eventDetail[1].trim()}</b> removed`
                        return data
                    case 'CLASSIFICATION_ADD':
                        try {
                            // This handles the case when classification is linked using Atlan Bot user
                            // In this case, classification object comes in details
                            parsedDetails = JSON.parse(eventDetail[1].trim())

                            if (parsedDetails.typeName) {
                                data.value =
                                    filterClassificationTypeNameDisplayName(
                                        parsedDetails
                                    )
                                data.displayValue = 'classificationAdded'

                                return data
                            }
                            return null
                        } catch (error) {
                            data.value = eventDetail[1].trim()
                            data.displayValue = 'classificationAdded'

                            return data
                        }
                    case 'CLASSIFICATION_DELETE':
                        parsedDetails = eventDetail[1].trim()
                        data.value =
                            filterClassificationTypeNameDisplayName(
                                parsedDetails
                            )
                        data.displayValue = 'classificationRemoved'

                        return data
                    case 'PROPAGATED_CLASSIFICATION_ADD':
                        parsedDetails = JSON.parse(eventDetail[1].trim())
                        data.displayValue = `Classification <b>${filterClassificationTypeNameDisplayName(
                            parsedDetails
                        )}</b> linked via propagation`
                        return data
                    case 'PROPAGATED_CLASSIFICATION_DELETE':
                        try {
                            parsedDetails = JSON.parse(eventDetail[1].trim())
                            data.displayValue = `Classification <b>${filterClassificationTypeNameDisplayName(
                                parsedDetails
                            )}</b> unlinked via propagation`
                            return data
                        } catch (error) {
                            parsedDetails = eventDetail[1].trim()
                            if (parsedDetails) {
                                data.displayValue = `Classification <b>${parsedDetails}</b> unlinked via propagation`
                                return data
                            }
                            return null
                        }
                    case 'TERM_ADD':
                        try {
                            parsedDetails = JSON.parse(eventDetail[1].trim())
                            data.value =
                                filterTermTypeNameDisplayName(parsedDetails)
                            data.displayValue = 'termAdded'

                            return data
                        } catch (error) {
                            return null
                        }
                    case 'TERM_DELETE':
                        try {
                            parsedDetails = JSON.parse(eventDetail[1].trim())
                            data.value =
                                filterTermTypeNameDisplayName(parsedDetails)
                            data.displayValue = 'termRemoved'

                            return data
                        } catch (error) {
                            return null
                        }
                    case 'BUSINESS_ATTRIBUTE_UPDATE':
                        try {
                            parsedDetails = JSON.parse(eventDetail[1].trim())
                            data.value = parsedDetails
                            data.displayValue = 'bmUpdated'

                            return data
                        } catch (error) {
                            return null
                        }
                    case 'ENTITY_UPDATE':
                        try {
                            parsedDetails = JSON.parse(eventDetail[1].trim())
                            return getEntityUpdateLogs(parsedDetails)
                        } catch (error) {
                            return null
                        }

                    default:
                        return null
                }
            }
        }
        return null
    }

    const getActionUser = (user: any) => {
        if (user.startsWith('service-account')) return 'using Atlan services'
        return `${user}`
    }

    fetchAudits(params, guid)
    return {
        ...toRefs(response),
        fetchAudits,
        getEventByAction,
        getDetailsForEntityAuditEvent,
        getActionUser,
        fetchMoreAudits,
    }
}

export default useAssetAudit

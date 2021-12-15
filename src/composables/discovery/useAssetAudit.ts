import { reactive, watch, ref } from 'vue'
import { toRefs } from '@vueuse/core'
import { activityInterface } from '~/types/activitylogs/activitylog.interface'
import { eventMap } from '~/constant/events'
import { Entity } from '~/services/meta/entity'

const useAssetAudit = (params: any, guid: string) => {
    const response = reactive({
        audits: [] as any,
        error: null as any,
        isLoading: ref(false),
        isFetchingMore: ref(false),
        isAllLogsFetched: true,
    })

    const fetchAudits = (p: any, g: string) => {
        const { data, error, isLoading } = Entity.fetchAudits(p, g)
        response.audits = data
        response.error = error
        response.isLoading = isLoading
        // @ts-ignore
        response.isAllLogsFetched = data?.value?.length < params.count
    }

    const fetchMoreAudits = (fetchmoreParams: any) => {
        const { data, isLoading, error } = Entity.fetchMoreAudits(
            fetchmoreParams,
            guid
        )

        response.isFetchingMore = isLoading

        watch(data, () => {
            if (data.value?.length && !error.value) {
                response.audits = ref([...response.audits, ...data.value])
                response.isAllLogsFetched =
                    data?.value?.length < fetchmoreParams.count
            }
        })
    }

    const getEventByAction = (asset: any) =>
        eventMap.find((event: any) => event.id === asset.action)

    const filterClassificationTypeNameDisplayName = (parsedDetails: any) => {
        if (typeof parsedDetails === 'object')
            return parsedDetails?.typeName ?? ''
        else if (typeof parsedDetails === 'string') return parsedDetails
        return ''
    }

    const filterTermTypeNameDisplayName = (parsedDetails: any) =>
        parsedDetails?.name ?? ''

    const getEntityUpdateLogs = (logs: any) => {
        const data = {
            displayValue: 'Asset was updated',
            value: <any>[],
            component: '',
        }
        if ('attributes' in logs) {
            const { attributes } = logs
            const owners =
                'ownerUsers' in attributes || 'ownerGroups' in attributes
            const experts = 'expertUsers' in attributes
            const certificate =
                'certificateStatus' in attributes ||
                'certificateStatusMessage' in attributes
            const userDescription =
                'userDescription' in attributes ||
                'shortDescription' in attributes

            if (owners) {
                let users = <any>[]
                let groups = <any>[]

                if (attributes.ownerUsers) {
                    users = attributes.ownerUsers
                    users = users.map((user) => ({ name: user, type: 'user' }))
                }
                if (attributes.ownerGroups) {
                    groups = attributes.ownerGroups
                    groups = groups.map((group) => ({
                        name: group,
                        type: 'group',
                    }))
                }
                if (
                    attributes.ownerUsers === '' &&
                    attributes.ownerGroups === ''
                ) {
                    data.displayValue = 'owners'
                    data.component = 'Owners'
                    return data
                }

                data.displayValue = 'owners'
                data.value = [...users, ...groups]
                data.component = 'Owners'

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
                data.component = 'Experts'

                return data
            }

            if (certificate) {
                data.value = attributes
                data.displayValue = 'certificate'
                data.component = 'Certificate'

                return data
            }

            if (userDescription) {
                const value =
                    attributes.userDescription || attributes.shortDescription
                data.value = value

                data.displayValue = 'description'
                data.component = 'Description'

                return data
            }
        }
        return data
    }

    const getDetailsForEntityAuditEvent = (
        auditEvent: any
    ): activityInterface | null => {
        if (auditEvent.details) {
            const eventDetail = auditEvent.details.split(/:(.+)/)
            let parsedDetails: any = {}
            const data: activityInterface = {
                displayValue: '',
                value: [],
                component: '',
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
                                data.displayValue = 'added'
                                data.component = 'Classifications'

                                return data
                            }
                            return null
                        } catch (error) {
                            data.value = eventDetail[1].trim()
                            data.displayValue = 'added'
                            data.component = 'Classifications'
                            return data
                        }
                    case 'CLASSIFICATION_DELETE':
                        try {
                            parsedDetails = JSON.parse(eventDetail[1].trim())

                            if (parsedDetails.typeName) {
                                data.value =
                                    filterClassificationTypeNameDisplayName(
                                        parsedDetails
                                    )
                                data.displayValue = 'removed'
                                data.component = 'Classifications'

                                return data
                            }
                            return null
                        } catch (error) {
                            data.value = eventDetail[1].trim()
                            data.displayValue = 'removed'
                            data.component = 'Classifications'
                            return data
                        }
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
                            data.displayValue = 'added'
                            data.component = 'Terms'
                            return data
                        } catch (error) {
                            return null
                        }
                    case 'TERM_DELETE':
                        try {
                            parsedDetails = JSON.parse(eventDetail[1].trim())
                            data.value =
                                filterTermTypeNameDisplayName(parsedDetails)
                            data.displayValue = 'removed'
                            data.component = 'Terms'
                            return data
                        } catch (error) {
                            return null
                        }
                    case 'BUSINESS_ATTRIBUTE_UPDATE':
                        try {
                            parsedDetails = JSON.parse(eventDetail[1].trim())
                            data.value = parsedDetails
                            data.component = 'BusinessMetadata'

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

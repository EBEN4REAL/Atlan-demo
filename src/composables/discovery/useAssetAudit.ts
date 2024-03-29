import { computed, reactive, watch, ref } from 'vue'
import { toRefs } from '@vueuse/core'
import { activityInterface } from '~/types/activitylogs/activitylog.interface'
import { eventMap } from '~/constant/events'
import { Entity } from '~/services/meta/entity'
import { default as glossaryLabel } from '@/glossary/constants/assetTypeLabel'
import { capitalizeFirstLetter } from '~/utils/string'
import { certificateList } from '~/constant/certification'
import useTypedefData from '~/composables/typedefs/useTypedefData'

const useAssetAudit = (params: any, guid: string) => {
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
        const data: activityInterface = {
            displayValue: 'Asset was updated',
            value: <any>[],
            component: '',
        }

        if ('attributes' in logs) {
            const { attributes } = logs
            if (
                Object.keys(attributes)?.length > 1 &&
                !(
                    'announcementType' in attributes ||
                    'announcementTitle' in attributes ||
                    'announcementMessage' in attributes
                )
            ) {
                data.displayValue = 'Asset was updated'
                data.value = logs
                data.component = 'MultipleAttributes'
                return data
            }

            if ('ownerUsers' in attributes || 'ownerGroups' in attributes) {
                data.displayValue = 'owners'
                data.value = {}
                if (attributes.ownerUsers) {
                    data.value.ownerUsers = attributes.ownerUsers
                    data.icon = 'User'
                }
                if (attributes.ownerGroups) {
                    data.value.ownerGroups = attributes.ownerGroups
                    data.icon = 'Group'
                }

                data.component = 'Owners'
                return data
            }

            if ('userDescription' in attributes) {
                data.value = attributes.userDescription
                data.icon = 'Pencil'

                data.displayValue = 'description'
                data.component = 'Description'

                return data
            }
            if (
                'certificateStatus' in attributes ||
                'certificateStatusMessage' in attributes
            ) {
                data.value = logs
                data.displayValue = 'certificate'
                data.component = 'Certificate'
                const icon = logs?.attributes?.certificateStatus?.toLowerCase()
                if (icon?.length) data.icon = capitalizeFirstLetter(icon)
                if (logs?.attributes?.certificateStatus === null)
                    data.icon = 'Nostatus'
                return data
            }
            if ('name' in attributes) {
                data.value = attributes?.name
                data.displayValue = 'name'
                data.component = 'Name'
                data.icon = 'Pencil'
                return data
            }
            if (
                'announcementType' in attributes ||
                'announcementTitle' in attributes ||
                'announcementMessage' in attributes
            ) {
                data.value = logs
                data.displayValue = 'announcement'
                data.component = 'Announcement'
                data.icon = 'Megaphone'
                return data
            }
            if ('adminUsers' in attributes || 'adminGroups' in attributes) {
                data.displayValue = 'admins'
                data.value = {}
                if (attributes.adminUsers) {
                    data.value.adminUsers = attributes.adminUsers
                    data.icon = 'User'
                }
                if (attributes.adminGroups) {
                    data.value.adminGroups = attributes.adminGroups
                    data.icon = 'Group'
                }

                data.component = 'Admins'
                return data
            }
            if ('viewerUsers' in attributes || 'viewerGroups' in attributes) {
                data.displayValue = 'viewers'
                data.value = {}
                if (attributes.viewerUsers) {
                    data.value.viewerUsers = attributes.viewerUsers
                    data.icon = 'User'
                }
                if (attributes.viewerGroups) {
                    data.value.viewerGroups = attributes.viewerGroups
                    data.icon = 'Group'
                }

                data.component = 'Viewers'
                return data
            }
            if ('sql' in attributes) {
                data.value = attributes?.sql
                data.displayValue = 'query'
                data.component = 'ProcessSQL'
                data.icon = 'Query'
                return data
            }
            if ('rawQuery' in attributes) {
                data.value = attributes?.rawQuery
                data.displayValue = 'query'
                data.component = 'ProcessSQL'
                data.icon = 'Query'
                return data
            }
        }
        if ('relationshipAttributes' in logs) {
            const { relationshipAttributes } = logs
            if (relationshipAttributes.meanings) {
                data.value = []
                data.displayValue = 'added'
                data.component = 'Terms'
                data.icon = 'Term'
            }
            if (relationshipAttributes.categories) {
                data.value = []
                data.displayValue = 'added'
                data.component = 'Category'
                data.icon = 'Category'
            }
            if (
                relationshipAttributes.parentCategory ||
                relationshipAttributes.hasOwnProperty('parentCategory')
            ) {
                data.value = []
                data.displayValue = 'added'
                data.component = 'Category'
                data.icon = 'Category'
            }

            // data.displayValue = 'owners'
            // data.value = {}
            // if (attributes.ownerUsers) {
            //     data.value.ownerUsers = attributes.ownerUsers
            // }
            // if (attributes.ownerGroups) {
            //     data.value.ownerGroups = attributes.ownerUsers
            // }
            // if (attributes.ownerGroups) {
            //     data.value.push(...ownerGroups)
            // }

            return data
        }

        // if ('attributes' in logs) {
        //     const { attributes } = logs
        //     const owners =
        //         'ownerUsers' in attributes || 'ownerGroups' in attributes
        //     const experts = 'expertUsers' in attributes
        //     const certificate =
        //         'certificateStatus' in attributes ||
        //         'certificateStatusMessage' in attributes
        //     const userDescription =
        //         'userDescription' in attributes ||
        //         'shortDescription' in attributes

        //     if (owners) {
        //         let users = <any>[]
        //         let groups = <any>[]

        //         if (attributes.ownerUsers) {
        //             users = attributes.ownerUsers
        //             users = users.map((user) => ({ name: user, type: 'user' }))
        //         }
        //         if (attributes.ownerGroups) {
        //             groups = attributes.ownerGroups
        //             groups = groups.map((group) => ({
        //                 name: group,
        //                 type: 'group',
        //             }))
        //         }
        //         if (
        //             attributes.ownerUsers === '' &&
        //             attributes.ownerGroups === ''
        //         ) {
        //             data.displayValue = 'owners'
        //             data.component = 'Owners'
        //             return data
        //         }

        //         data.displayValue = 'owners'
        //         data.value = [...users, ...groups]
        //         data.component = 'Owners'

        //         return data
        //     }
        //     if (experts) {
        //         const users = attributes.expertUsers.split(',')
        //         if (attributes.expertUsers === '') {
        //             data.displayValue = 'Removed all experts'
        //             return data
        //         }
        //         data.displayValue = 'experts'
        //         data.value = users
        //         data.component = 'Experts'

        //         return data
        //     }

        //     if (certificate) {
        //         data.value = attributes
        //         data.displayValue = 'certificate'
        //         data.component = 'Certificate'

        //         return data
        //     }

        //     if (userDescription) {
        //         const value =
        //             attributes.userDescription || attributes.shortDescription
        //         data.value = value

        //         data.displayValue = 'description'
        //         data.component = 'Description'

        //         return data
        //     }
        // }
        return data
    }

    const getAuditEventComponent = (
        auditEvent: any
    ): activityInterface | null => {
        if (auditEvent.detail) {
            const eventDetail = auditEvent.detail
            const data: activityInterface = {
                displayValue: '',
                value: [],
                component: '',
            }

            if (eventDetail) {
                switch (auditEvent.action) {
                    // case 'LABEL_ADD':
                    //     data.displayValue = `Label <b>${eventDetail[1].trim()}</b> added`
                    //     return data
                    // case 'LABEL_DELETE':
                    //     data.displayValue = `Label <b>${eventDetail[1].trim()}</b> removed`
                    //     return data
                    case 'CLASSIFICATION_UPDATE':
                        data.value = eventDetail
                        data.displayValue = 'updated'
                        data.component = 'Classifications'
                        data.icon = 'Shield'

                        return data
                    case 'CLASSIFICATION_ADD':
                        data.value = eventDetail
                        data.displayValue = 'added'
                        data.component = 'Classifications'
                        data.icon = 'Shield'

                        return data
                    case 'CLASSIFICATION_DELETE':
                        data.value = eventDetail
                        data.displayValue = 'removed'
                        data.component = 'Classifications'
                        data.icon = 'Shield'

                        return data
                    case 'PROPAGATED_CLASSIFICATION_ADD':
                        data.value = eventDetail
                        data.displayValue = 'added via propagation'
                        data.component = 'Classifications'
                        data.icon = 'Shield'
                        return data
                    case 'PROPAGATED_CLASSIFICATION_DELETE':
                        data.value = eventDetail
                        data.displayValue = 'removed via propagation'
                        data.component = 'Classifications'
                        data.icon = 'Shield'
                        return data
                    // case 'CLASSIFICATION_DELETE':
                    //     try {
                    //         parsedDetails = JSON.parse(eventDetail[1].trim())

                    //         if (parsedDetails.typeName) {
                    //             data.value =
                    //                 filterClassificationTypeNameDisplayName(
                    //                     parsedDetails
                    //                 )
                    //             data.displayValue = 'removed'
                    //             data.component = 'Classifications'

                    //             return data
                    //         }
                    //         return null
                    //     } catch (error) {
                    //         data.value = eventDetail[1].trim()
                    //         data.displayValue = 'removed'
                    //         data.component = 'Classifications'
                    //         return data
                    //     }
                    // case 'PROPAGATED_CLASSIFICATION_ADD':
                    //     parsedDetails = JSON.parse(eventDetail[1].trim())
                    //     data.displayValue = `Classification <b>${filterClassificationTypeNameDisplayName(
                    //         parsedDetails
                    //     )}</b> linked via propagation`
                    //     return data
                    // case 'PROPAGATED_CLASSIFICATION_DELETE':
                    //     try {
                    //         parsedDetails = JSON.parse(eventDetail[1].trim())
                    //         data.displayValue = `Classification <b>${filterClassificationTypeNameDisplayName(
                    //             parsedDetails
                    //         )}</b> unlinked via propagation`
                    //         return data
                    //     } catch (error) {
                    //         parsedDetails = eventDetail[1].trim()
                    //         if (parsedDetails) {
                    //             data.displayValue = `Classification <b>${parsedDetails}</b> unlinked via propagation`
                    //             return data
                    //         }
                    //         return null
                    //     }
                    // case 'TERM_ADD':
                    //     try {
                    //         parsedDetails = JSON.parse(eventDetail[1].trim())
                    //         data.value =
                    //             filterTermTypeNameDisplayName(parsedDetails)
                    //         data.displayValue = 'added'
                    //         data.component = 'Terms'
                    //         return data
                    //     } catch (error) {
                    //         return null
                    //     }
                    // case 'TERM_DELETE':
                    //     try {
                    //         parsedDetails = JSON.parse(eventDetail[1].trim())
                    //         data.value =
                    //             filterparentCategory(parsedDetails)
                    //         data.displayValue = 'removed'
                    //         data.component = 'Terms'
                    //         return data
                    //     } catch (error) {
                    //         return null
                    //     }
                    case 'BUSINESS_ATTRIBUTE_UPDATE':
                        try {
                            data.value = eventDetail
                            data.component = 'BusinessMetadata'
                            const { customMetadataList } = useTypedefData()
                            const found = computed(() => {
                                return customMetadataList.value.find(
                                    (item) => item.name === data?.value.typeName
                                )
                            })

                            if (found.value) {
                                data.icon = found
                            }

                            return data
                        } catch (error) {
                            return null
                        }
                    case 'ENTITY_CREATE':
                        data.value = eventDetail
                        data.component = 'Create'
                        if (
                            [
                                'AtlasGlossary',
                                'AtlasGlossaryTerm',
                                'AtlasGlossaryCategory',
                            ].includes(eventDetail?.typeName)
                        ) {
                            data.icon = capitalizeFirstLetter(
                                glossaryLabel[eventDetail?.typeName]
                            )
                        } else {
                            if (eventDetail?.typeName)
                                data.icon = eventDetail?.typeName
                        }

                        return data
                    case 'ENTITY_DELETE':
                        data.value = eventDetail
                        data.component = 'Delete'
                        if (
                            [
                                'AtlasGlossary',
                                'AtlasGlossaryTerm',
                                'AtlasGlossaryCategory',
                            ].includes(eventDetail?.typeName)
                        ) {
                            data.icon = capitalizeFirstLetter(
                                glossaryLabel[eventDetail?.typeName]
                            )
                        }
                        return data

                    case 'ENTITY_UPDATE':
                        return getEntityUpdateLogs(eventDetail)

                    default:
                        return null
                }
            }
        }
        return null
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
                            data.component = 'BusinessMetadata2'
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

    return {
        getEventByAction,
        getDetailsForEntityAuditEvent,
        getActionUser,
        getAuditEventComponent,
    }
}

export default useAssetAudit

<template>
    <div class="p-4 bg-white rounded">
        <div class="flex items-center mb-4">
            <AtlanIcon icon="TableSummary" class="w-auto h-8 mr-3" /><span
                class="text-base font-bold text-gray"
                >{{ getSummaryVariants(asset)?.label }} Summary</span
            >
        </div>
        <div class="flex flex-col gap-y-10">
            <div class="flex flex-col gap-y-3">
                <div class="flex gap-x-16">
                    <div
                        v-for="(component, index) in getSummaryVariants(asset)
                            ?.components"
                        :key="index"
                    >
                        <component :is="component" :asset="asset"></component>
                    </div>
                </div>
                <div>
                    <div class="flex flex-col">
                        <p class="mb-1 text-sm text-gray-500">Description</p>
                        <Description v-model="localDescription" />
                    </div>
                </div>
                <div class="flex gap-x-32">
                    <div class="flex flex-col">
                        <p class="mb-1 text-sm text-gray-500">Certificate</p>

                        <Certificate
                            v-model="localCertificate"
                            :selected-asset="asset"
                            @change="handleChangeCertificate"
                        />
                    </div>

                    <div v-if="asset.guid" class="flex flex-col">
                        <p class="mb-1 text-sm text-gray-500">Owners</p>
                        <Owners
                            v-model="localOwners"
                            @change="handleOwnersChange"
                        />
                    </div>
                </div>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        watch,
        ref,
        PropType,
        toRefs,
        defineAsyncComponent,
    } from 'vue'

    // Components
    import Description from '@/common/input/description/index.vue'
    import Owners from '@/common/input/owner/index.vue'
    import Certificate from '@/common/input/certificate/index.vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import updateAsset from '~/composables/discovery/updateAsset'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {
            Description,
            Certificate,
            Owners,
            Rows: defineAsyncComponent(() => import('./types/rows.vue')),
            Columns: defineAsyncComponent(() => import('./types/columns.vue')),
            Definition: defineAsyncComponent(
                () => import('./types/definition.vue')
            ),
            TermsCount: defineAsyncComponent(
                () => import('./types/termsCount.vue')
            ),
            CategoriesCount: defineAsyncComponent(
                () => import('./types/categoriesCount.vue')
            ),
            ParentGlossary: defineAsyncComponent(
                () => import('./types/parentGlossary.vue')
            ),
        },

        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        setup(props) {
            const { asset } = toRefs(props)

            const {
                rowCount,
                columnCount,
                sizeBytes,
                sourceUpdatedAt,
                sourceCreatedAt,
                ownerGroups,
                ownerUsers,
                definition,
                description,
                getConnectorImage,
                certificateStatus,
                certificateUpdatedAt,
                certificateStatusMessage,
                certificateUpdatedBy,
                getSummaryVariants,
            } = useAssetInfo()

            const entity = ref({
                guid: asset.value.guid,
                typeName: asset.value.typeName,
                attributes: {
                    name: asset.value.attributes?.name,
                    qualifiedName: asset.value.attributes?.qualifiedName,
                    tenantId: 'default',
                },
            })

            const body = ref({
                entities: [],
            })

            const { mutate, isLoading } = updateAsset(body)

            const localDescription = ref(description(asset.value))

            watch(localDescription, () => {
                entity.value.attributes.userDescription = localDescription.value
                body.value.entities = [entity.value]
                mutate()
            })

            const localOwners = ref({
                ownerUsers: ownerUsers(asset.value),
                ownerGroups: ownerGroups(asset.value),
            })

            const handleOwnersChange = () => {
                entity.value.attributes.ownerUsers =
                    localOwners.value?.ownerUsers
                entity.value.attributes.ownerGroups =
                    localOwners.value?.ownerGroups
                body.value.entities = [entity.value]
                mutate()
            }

            const localCertificate = ref({
                certificateStatus: certificateStatus(asset.value),
                certificateUpdatedAt: certificateUpdatedAt(asset.value),
                certificateUpdatedBy: certificateUpdatedBy(asset.value),
                certificateStatusMessage: certificateStatusMessage(asset.value),
            })

            const handleChangeCertificate = () => {
                if (
                    localCertificate.value.certificateStatus !==
                        certificateStatus(asset.value) ||
                    localCertificate.value.certificateStatusMessage !==
                        certificateStatusMessage(asset.value)
                ) {
                    entity.value.attributes.certificateStatus =
                        localCertificate.value.certificateStatus

                    entity.value.attributes.certificateStatusMessage =
                        localCertificate.value.certificateStatusMessage
                    body.value.entities = [entity.value]
                    mutate()
                }
            }

            return {
                rowCount,
                columnCount,
                sizeBytes,
                sourceUpdatedAt,
                sourceCreatedAt,
                getConnectorImage,
                definition,
                localDescription,
                localOwners,
                handleOwnersChange,
                localCertificate,
                handleChangeCertificate,
                getSummaryVariants,
            }
        },
    })
</script>

<template>
    <a-modal
        style="top: 5rem; right: 0px; margin-left: auto; margin-right: 4rem"
        :mask="false"
        :bodyStyle="{ padding: '20px' }"
    >
        <template #title>
            <span class="text-lg leading-5">
                {{ requestTitle }}
            </span>
        </template>

        <div class="flex flex-col h-64 overflow-y-auto gap-y-6 max-h-64">
            <!-- TOP SECTION -->
            <AssetDetails
                :asset="request?.destinationEntity"
                :asset-qf-name="request?.destination_qualified_name"
                :entityType="request?.entity_type"
            />

            <!-- BOTTOM SECTION -->
            <AttributeChange
                :attribute="request.destination_attribute"
                :value="request.destination_value"
                v-if="request.request_type === 'attribute'"
            />
            <ClassificationPiece
                v-if="
                    request?.request_type === 'create_typedef' &&
                    request?.payload?.classificationDefs
                "
                :data="request.payload.classificationDefs"
            />
            <ClassificationPiece
                v-else-if="request?.request_type === 'attach_classification'"
                :typeName="request.payload.typeName"
            />
            <TermDetails
                v-if="request.request_type === 'create_term'"
                :data="request.payload"
            />

            <TermDetails
                v-if="request.request_type === 'term_link'"
                :data="request.sourceEntity.attributes"
            />

            <div v-if="request?.message">
                <p class="mb-1 text-sm text-gray-500">Note</p>
                <span class="text-gray">{{ request?.message }}</span>
            </div>

            <p class="mt-auto mb-0 text-gray-500">
                Requested {{ createdTimeAgo }} by
                <UserPiece :user="request.createdByUser" :is-pill="false" />
            </p>
        </div>

        <template #footer>
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <AtlanButton
                        color="secondary"
                        @click.stop="$emit('up')"
                        padding="compact"
                        size="sm"
                        ><template #label
                            ><AtlanIcon icon="ChevronUp" />
                        </template>
                    </AtlanButton>
                    <AtlanButton
                        color="secondary"
                        @click.stop="$emit('down')"
                        padding="compact"
                        size="sm"
                        ><template #label
                            ><AtlanIcon icon="ChevronDown" />
                        </template>
                    </AtlanButton>
                </div>
                <RequestActions
                    v-if="request.status === 'active'"
                    @accept="approve"
                    @reject="decline"
                />
                <div
                    v-else-if="request.status === 'approved'"
                    class="text-success"
                >
                    Approved
                </div>
                <div
                    v-else-if="request.status === 'rejected'"
                    class="text-error"
                >
                    Rejected
                </div>
            </div>
        </template>
    </a-modal>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs, inject } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import { useMagicKeys, whenever } from '@vueuse/core'
    import {
        attributeCopyMapping,
        typeCopyMapping,
        requestTypeIcon,
    } from '../requestType'
    import AtlanButton from '@/UI/button.vue'
    import RequestActions from '../requestActions.vue'
    import AssetDetails from './assetDetails.vue'
    // import ClassificationDetails from './classificationDetails.vue'
    import TermDetails from './termDetails.vue'
    import AttributeChange from './attributeChange.vue'

    import UserPiece from '../pieces/user.vue'
    import ClassificationPiece from '../pieces/classifications.vue'

    import { RequestAttributes } from '~/types/atlas/requests'
    import { assetTypeList } from '~/constant/assetType'

    export default defineComponent({
        name: 'RequestDetails',
        components: {
            RequestActions,
            AssetDetails,
            AttributeChange,
            AtlanButton,
            // ClassificationDetails,
            TermDetails,
            UserPiece,
            ClassificationPiece,
        },
        props: {
            request: {
                type: Object as PropType<RequestAttributes>,
                required: true,
            },
        },
        emits: ['up', 'down'],
        setup(props) {
            const { request } = toRefs(props)
            console.log(request)
            const { a, d } = useMagicKeys()
            const handleRejection = inject('handleRejection')
            const handleApproval = inject('handleApproval')

            const requestTitle = computed(() => {
                let title = `${typeCopyMapping[request.value.request_type]} `
                // Attribute change title
                if (
                    ['bm_attribute', 'attribute'].includes(
                        request.value.request_type
                    )
                ) {
                    title += assetTypeList.find(
                        (ast) => ast.id == request.value.entity_type
                    )?.label

                    title += ` ${
                        attributeCopyMapping[
                            request.value.destination_attribute
                        ]
                    }`
                }

                return title
            })

            const createdTimeAgo = useTimeAgo(request.value.created_at)
            const createdDate = computed(() =>
                new Date(request.value.created_at).toLocaleDateString()
            )
            // whenever(a, () => {
            //     handleApproval(request)
            // })
            // whenever(d, () => {
            //     handleRejection(request)
            // })
            const approve = () => {
                handleApproval(request)
            }
            const decline = () => {
                handleRejection(request)
            }
            return {
                requestTitle,
                requestTypeIcon,
                createdTimeAgo,
                createdDate,
                handleRejection,
                handleApproval,
                approve,
                decline,
            }
        },
    })
</script>

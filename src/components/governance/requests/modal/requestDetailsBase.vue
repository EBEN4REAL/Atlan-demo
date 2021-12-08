<template>
    <a-modal
        style="top: 5rem; right: 0px; margin-left: auto; margin-right: 4rem"
        :mask="false"
        :bodyStyle="{ padding: '20px' }"
        class="p-1"
    >
        <template #title>
            <span class="text-lg leading-5">
                {{ requestTitle }}
            </span>
        </template>
        <hr />
        <div class="flex flex-col h-64 p-4 overflow-y-auto gap-y-6 max-h-64">
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
                v-if="request?.request_type === 'attribute'"
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
                :typeName="request?.payload.typeName"
            />
            <TermDetails
                v-if="request?.request_type === 'create_term'"
                :data="request?.payload"
            />

            <TermDetails
                v-if="request?.request_type === 'term_link'"
                :data="request?.sourceEntity.attributes"
            />

            <div v-if="request?.message">
                <p class="mb-1 text-sm text-gray-500">Note</p>
                <span class="text-gray">{{ request?.message }}</span>
            </div>

            <p class="mt-auto mb-0 text-gray-500">
                Requested {{ createdTimeAgo }} by
                <UserPiece :user="request?.createdByUser" :is-pill="false" />
            </p>
        </div>
        <hr />

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
                    v-if="request?.status === 'active'"
                    @accept="handleApproval"
                    @reject="handleRejection"
                />
                <div
                    v-else-if="request?.status === 'approved'"
                    class="text-success"
                >
                    Approved
                </div>
                <div
                    v-else-if="request?.status === 'rejected'"
                    class="text-error"
                >
                    Rejected
                </div>
            </div>
        </template>
    </a-modal>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs, reactive } from 'vue'
    import { message } from 'ant-design-vue'
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
    import {
        approveRequest,
        declineRequest,
    } from '~/composables/requests/useRequests'

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
        emits: ['up', 'down', 'action'],
        setup(props, { emit }) {
            const { request } = toRefs(props)
            const { a, d } = useMagicKeys()
            const state = reactive({
                isLoading: false,
                message: '',
            })

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
            function raiseErrorMessage(msg?: string) {
                message.error(msg || 'Request modification failed, try again')
            }

            async function handleApproval() {
                state.isLoading = true
                try {
                    await approveRequest(request.value.id, state.message)
                    request.value.message = state.message
                    request.value.status = 'approved'
                    emit('action', request.value)
                    message.success('Request approved')
                } catch (error) {
                    raiseErrorMessage()
                }
                state.isLoading = false
            }

            async function handleRejection() {
                state.isLoading = true
                try {
                    await declineRequest(request.value.id, state.message)
                    request.value.message = state.message
                    request.value.status = 'rejected'
                    emit('action', request.value)
                    message.success('Request declined')
                } catch (error) {
                    raiseErrorMessage()
                }
                state.isLoading = false
            }

            // whenever(a, () => {
            //     handleApproval(request)
            // })
            // whenever(d, () => {
            //     handleRejection(request)
            // })
            return {
                requestTitle,
                requestTypeIcon,
                createdTimeAgo,
                createdDate,
                handleRejection,
                handleApproval,
            }
        },
    })
</script>

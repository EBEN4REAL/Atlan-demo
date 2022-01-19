<template>
    <a-modal
        style="top: 5rem; margin-right: auto"
        :mask="false"
        :body-style="{ padding: '20px' }"
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
                :asset-qf-name="request?.destinationQualifiedName"
                :entity-type="request?.entityType"
            />

            <!-- BOTTOM SECTION -->
            <AttributeChange
                v-if="request?.requestType === 'attribute'"
                :attribute="request.destinationAttribute"
                :value="request.destinationValue"
            />
            <ClassificationPiece
                v-if="
                    request?.requestType === 'create_typedef' &&
                    request?.payload?.classificationDefs
                "
                :data="request.payload.classificationDefs"
            />
            <ClassificationPiece
                v-else-if="request?.requestType === 'attach_classification'"
                :type-name="request?.payload.typeName"
            />
            <TermDetails
                v-if="request?.requestType === 'create_term'"
                :data="request?.payload"
            />

            <TermDetails
                v-if="request?.requestType === 'term_link'"
                :data="request?.sourceEntity.attributes"
            />

            <div v-if="request?.message">
                <p class="mb-1 text-sm text-gray-500">Note</p>
                <span class="text-gray">{{ request?.message }}</span>
            </div>

            <p class="mt-auto mb-0 text-gray-500">
                Requested {{ createdTimeAgo }} by
                <UserPiece :user="request?.created_by_user" :is-pill="false" />
            </p>
        </div>
        <hr />

        <template #footer>
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <AtlanButton
                        color="secondary"
                        padding="compact"
                        size="sm"
                        @click.stop="$emit('up')"
                        ><template #label
                            ><AtlanIcon icon="ChevronUp" />
                        </template>
                    </AtlanButton>
                    <AtlanButton
                        color="secondary"
                        padding="compact"
                        size="sm"
                        @click.stop="$emit('down')"
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
            // const { a, d } = useMagicKeys()
            const state = reactive({
                isLoading: false,
                message: '',
            })

            const requestTitle = computed(() => {
                let title = `${typeCopyMapping[request.value.requestType]} `
                // Attribute change title
                if (
                    ['bm_attribute', 'attribute'].includes(
                        request.value.requestType
                    )
                ) {
                    title += assetTypeList.find(
                        (ast) => ast.id == request.value.entityType
                    )?.label

                    title += ` ${
                        attributeCopyMapping[request.value.destinationAttribute]
                    }`
                }

                return title
            })

            const createdTimeAgo = useTimeAgo(request.value.createdAt)
            const createdDate = computed(() =>
                new Date(request.value.createdAt).toLocaleDateString()
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

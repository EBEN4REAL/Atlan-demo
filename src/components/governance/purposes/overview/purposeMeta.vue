<template>
    <div class="grid grid-cols-3 gap-x-3">
        <Summary
            :item="persona"
            :is-loading="loadingLink"
            @changeLink="changeLink"
            @addPolicy="setActiveTab('policies')"
        />
        <div class="col-span-2 p-6 bg-white border border-gray-200 rounded">
            <div class="mb-1 text-gray-500">Classifications</div>
            <Classification
                v-model:modelValue="selectedClassifications"
                :allow-delete="selectedClassifications.length > 1"
                :edit-permission="true"
                @change="updateClassifications"
            />
        </div>
        <!-- <DetailsWidget
            :item="persona"
            class="border border-gray-200"
            @editDetails="$emit('editDetails')"
        >
            <template #actionBtn>
                <div class="hidden">
                <a-switch
                    class="ml-auto"
                    data-test-id="toggle-switch"
                    style="width: 40px !important"
                    :class="purpose.enabled ? 'btn-checked' : 'btn-unchecked'"
                    v-model:checked="purpose.enabled"
                    :loading="enableDisableLoading"
                    @change="handleEnableDisablePurpose"
                />
                <span class="ml-2 text-sm text-gray">Enable Purpose</span>
            </div>
            </template>
        </DetailsWidget> -->
        <!-- <PurposeSummary :purpose="persona" @setActiveTab="setActiveTab">
        </PurposeSummary> -->
        <!-- <div class="pt-6 details-section">
            <span class="text-sm text-gray-500">Created by</span>
            {{ persona.createdBy }}
            <div class="flex items-center text-sm">
                <PopOverUser :item="persona.createdBy">
                    <UserPill
                        :username="persona.createdBy"
                        :allow-delete="false"
                        :enable-hover="true"
                    ></UserPill>
                </PopOverUser>
            </div>
            <span class="text-sm text-gray-500">on</span>

            <a-tooltip
                :title="timeStamp(persona.createdAt, true)"
                placement="right"
                >{{ timeStamp(persona.createdAt) }}</a-tooltip
            >

            <a-switch
                class="ml-auto"
                style="width: 40px !important"
                data-test-id="toggle-switch"
                :class="enablePersonaCheck ? 'btn-checked' : 'btn-unchecked'"
                v-model:checked="enablePersonaCheck"
            />
            <span class="text-sm text-gray">Enable Purpose</span>
        </div>
        <div class="py-4 text-gray-500 gap-x-2">
            <p class="mb-3 text-sm font-bold text-gray-700">Classifications</p>
            <Classification
                v-model:modelValue="selectedClassifications"
                @change="updateClassifications"
            />
        </div>
        <div class="flex items-center py-4 mt-0">
            <div
                class="relative flex items-center flex-1 p-4 mr-3 bg-white border border-gray-300 rounded cursor-pointer group hover:shadow"
                @click="setActiveTab('policies')"
                data-test-id="tab-policies"
            >
                <div class="p-3 mr-3 rounded text-primary bg-primary-light">
                    <AtlanIcon icon="Policy" class="h-6" />
                </div>
                <div class="w-full">
                    <div class="mb-1 font-bold text-gray-700">Policy</div>
                    <div class="flex text-gray-500">
                        <div
                            v-if="
                                persona.dataPolicies?.length === 0 &&
                                persona.metadataPolicies?.length === 0
                            "
                        >
                            No policies added
                        </div>
                        <div v-else class="flex items-center">
                            <div class="mr-3">
                                <b>{{ persona.metadataPolicies?.length }}</b>
                                Metadata policies
                            </div>
                            <div>
                                <b>{{ persona.dataPolicies?.length }}</b>
                                Data policies
                            </div>
                        </div>
                        <div
                            class="absolute right-0 opacity-0 vertical-center group-hover:opacity-100"
                        >
                            <AtlanIcon
                                icon="ArrowRight"
                                class="h-6 ml-auto group-hover:text-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        ref,
        watch,
        computed,
        toRaw,
        toRefs,
        h,
    } from 'vue'
    import { message, Modal } from 'ant-design-vue'
    import Classification from '@common/input/classification/index.vue'
    import { useTimeAgo } from '@vueuse/core'
    import { IPurpose } from '~/types/accessPolicies/purposes'
    import {
        enablePersona,
        updateSelectedPersona,
        selectedPersonaDirty,
        saveClassifications,
        enablePurpose,
        savePersona,
        updatedSelectedData,
    } from '../composables/useEditPurpose'
    import { setActiveTab } from '../composables/usePurposeTabs'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { selectedPurpose } from '../composables/usePurposeList'
    import PopOverUser from '@/common/popover/user/user.vue'
    import UserPill from '@/common/pills/user.vue'
    import { formatDateTime } from '~/utils/date'
    // import PurposeSummary from './PurposeSummary.vue'
    import DetailsWidget from '~/components/common/widgets/detailsWidget.vue'
    import Summary from '@/common/widgets/summaryWidget.vue'

    export default defineComponent({
        name: 'PurposeMeta',
        components: {
            Classification,
            PopOverUser,
            UserPill,
            DetailsWidget,
            Summary,
        },
        props: {
            persona: {
                type: Object as PropType<IPurpose>,
                required: true,
            },
        },
        emits: ['update:persona', 'update:isEditMode'],
        setup(props) {
            const { classificationList } = useTypedefData()
            const { persona } = toRefs(props)
            const enableDisableLoading = ref(false)
            const enablePersonaCheck = ref(true)
            const loadingLink = ref(false)
            /* FIXME: FIND IF WE CAN DO IT IN OTHER WAY! */
            const mapClassificationsFromNames = computed(() => {
                const arr: any[] = []
                classificationList.value.forEach((cl) => {
                    selectedPersonaDirty.value?.tags?.forEach((name) => {
                        if (name === cl.name) {
                            arr.push({
                                typeName: cl.name,
                                entityGuid: cl.guid,
                                entityStatus: 'ACTIVE',
                                propagate: false,
                                validityPeriods: [],
                                removePropagationsOnEntityDelete: false,
                            })
                        }
                    })
                })
                return arr
            })

            /* Mimic the classification Names */

            const selectedClassifications = ref(
                mapClassificationsFromNames.value
            )

            const updateClassifications = async (classifications) => {
                const messageKey = Date.now()
                selectedPersonaDirty.value.tags = classifications.map(
                    (e) => e.typeName
                )
                message.loading({
                    content: 'Saving classifications',
                    duration: 0,
                    key: messageKey,
                })
                try {
                    await saveClassifications()
                    updateSelectedPersona()
                    message.success({
                        content: 'Classifications saved',
                        duration: 1.5,
                        key: messageKey,
                    })
                } catch (error) {
                    selectedPersonaDirty.value = {
                        ...JSON.parse(JSON.stringify(selectedPurpose.value)),
                    }
                    selectedClassifications.value = [
                        ...toRaw(mapClassificationsFromNames.value),
                    ]
                    console.log(error?.response?.data, 'error')
                    message.error({
                        content: error?.response?.data?.message,
                        duration: 1.5,
                        key: messageKey,
                    })
                }
            }

            watch(selectedPurpose, () => {
                selectedClassifications.value =
                    mapClassificationsFromNames.value
            })
            const timeStamp = (time, raw: boolean = false) => {
                if (time) {
                    return raw
                        ? formatDateTime(time) || 'N/A'
                        : useTimeAgo(time).value
                }
                return ''
            }
            const enableDisablePurpose = async (val) => {
                const messageKey = Date.now()
                enableDisableLoading.value = true
                message.loading({
                    content: `${val ? 'Enabling' : 'Disabling'} purpose ${
                        purpose.value.displayName
                    }`,
                    duration: 0,
                    key: messageKey,
                })
                try {
                    await enablePurpose(purpose.value.id, val)
                    message.success({
                        content: `${val ? 'Enabled' : 'Disabled'} purpose ${
                            purpose.value.displayName
                        }`,
                        duration: 1.5,
                        key: messageKey,
                    })
                    enableDisableLoading.value = false
                } catch (e) {
                    message.error({
                        content: `Failed to ${
                            val ? 'enable' : 'disable'
                        } purpose ${purpose.value.displayName}`,
                        duration: 1.5,
                        key,
                    })
                    enableDisableLoading.value = false
                }
            }

            const handleEnableDisablePurpose = (val) => {
                if (val) enableDisablePurpose(val)
                else
                    Modal.confirm({
                        title: 'Disable purpose',
                        class: 'disable-purpose-modal',
                        content: () =>
                            h('div', [
                                'Are you sure you want to disable purpose',
                                h('span', [' ']),
                                h(
                                    'span',
                                    {
                                        class: ['font-bold'],
                                    },
                                    [`${purpose.value.displayName}`]
                                ),
                                h('span', '?'),
                            ]),
                        okType: 'danger',
                        autoFocusButton: null,
                        okButtonProps: {
                            type: 'primary',
                        },
                        okText: 'Disable',
                        cancelText: 'Cancel',
                        async onOk() {
                            enableDisablePurpose(val)
                        },
                    })
            }
            const changeLink = async (val) => {
                try {
                    loadingLink.value = true
                    const payload = { ...persona.value }
                    // delete payload.dataPolicies
                    // delete payload.metadataPolicies
                    // delete payload.glossaryPolicies
                    await savePersona({
                        ...payload,
                        attributes: {
                            ...payload.attributes,
                            channelLink: val,
                        },
                    })
                    updatedSelectedData({
                        id: payload.id,
                        attributes: {
                            ...payload.attributes,
                            channelLink: val,
                        },
                    })
                } catch (error) {
                    message.error(
                        error?.response?.data?.message ||
                            'Some error occured...Please try again later.'
                    )
                } finally {
                    loadingLink.value = false
                }
            }
            return {
                timeStamp,
                selectedPurpose,
                updateClassifications,
                selectedPersonaDirty,
                selectedClassifications,
                enablePersonaCheck,
                enablePersona,
                setActiveTab,
                handleEnableDisablePurpose,
                enableDisableLoading,
                changeLink,
            }
        },
    })
</script>
<style lang="less" scoped>
    .details-section {
        @apply flex items-center gap-x-2 py-4;
        @apply text-gray-500;
        @apply cursor-pointer;
    }
    .user-group-pill {
        @apply rounded-full bg-primary-light text-primary text-xs px-2 py-1;
    }
    .data-policy-pill {
        @apply rounded-full text-xs px-2 py-1;
        background-color: #eeffef;
        color: #00a680;
    }
    .metadata-policy-pill {
        @apply rounded-full text-xs px-2 py-1;
        background-color: #fcf3fc;
        color: #d452d7;
    }
    .btn-checked {
        background: #00a680;
    }
    .vertical-center {
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>

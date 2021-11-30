<template>
    <div>
        <div class="pt-6 details-section">
            <span class="text-sm text-gray-500">Created by</span>
            <div class="flex items-center text-sm">
                <PopOverUser>
                    <UserPill
                        :username="username"
                        :allowDelete="false"
                    ></UserPill>
                </PopOverUser>
            </div>
            <span class="text-sm text-gray-500">on</span>
            <span class="text-sm text-gray">{{
                persona.created_at?.slice(0, -17)
            }}</span>

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
                class="relative flex items-center flex-1 p-4 mr-3 border border-gray-300 rounded cursor-pointer  group hover:shadow"
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
                            class="absolute right-0 opacity-0  vertical-center group-hover:opacity-100"
                        >
                            <AtlanIcon
                                icon="ArrowRight"
                                class="h-6 ml-auto group-hover:text-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
    } from 'vue'
    import { message } from 'ant-design-vue'
    import { IPurpose } from '~/types/accessPolicies/purposes'
    import { enablePersona } from '../composables/useEditPurpose'
    import { setActiveTab } from '../composables/usePurposeTabs'
    import Classification from '@common/input/classification/index.vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import {
        updateSelectedPersona,
        selectedPersonaDirty,
        saveClassifications,
    } from '../composables/useEditPurpose'
    import { selectedPersona } from '../composables/usePurposeList'
    import PopOverUser from '@/common/popover/user/user.vue'
    import UserPill from '@/common/pills/user.vue'

    export default defineComponent({
        name: 'PurposeMeta',
        components: { Classification, PopOverUser, UserPill },
        props: {
            persona: {
                type: Object as PropType<IPurpose>,
                required: true,
            },
            username: {
                type: String,
                required: true,
            },
        },
        emits: ['update:persona', 'update:isEditMode'],
        setup(props) {
            const { classificationList } = useTypedefData()
            const { username, persona } = toRefs(props)

            const enablePersonaCheck = ref(true)

            /* FIXME: FIND IF WE CAN DO IT IN OTHER WAY! */
            const mapClassificationsFromNames = computed(() => {
                let arr: any[] = []
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
                        ...JSON.parse(JSON.stringify(selectedPersona.value)),
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

            watch(selectedPersona, () => {
                selectedClassifications.value =
                    mapClassificationsFromNames.value
            })

            return {
                username,
                selectedPersona,
                updateClassifications,
                selectedPersonaDirty,
                selectedClassifications,
                enablePersonaCheck,
                enablePersona,
                setActiveTab,
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
